 -- {-# LANGUAGE RankNTypes #-}
 -- {-# LANGUAGE ScopedTypeVariables #-}
 -- {-# LANGUAGE TypeApplications #-}
module Core.Check where

import Core.Rig
import Core.Type
import Core.Hash
import Core.Eval
import Core.Print

import Data.Sequence (Seq, (|>), viewr, ViewR((:>), EmptyR))
import qualified Data.Sequence as Seq

import Data.Map (Map)
import qualified Data.Map as Map

import Data.Set (Set)
import qualified Data.Set as Set

import           Data.Text                  (Text)
import qualified Data.Text                  as T

import Control.Monad.ST
import Control.Monad.Except
import Control.Monad.Trans
import Data.STRef

import Debug.Trace

-- TODO: share set of equals hashes between `equal` calls?
equal :: Term -> Term -> Module -> Int -> Bool
equal a b defs dep = runST $ top a b dep
  where
    top :: Term -> Term -> Int -> ST s Bool
    top a b dep = do
      seen <- newSTRef (Set.empty)
      go a b dep seen

    go :: Term -> Term -> Int -> STRef s (Set (Hash,Hash)) -> ST s Bool
    go a b dep seen = do
      let var d = Var noLoc "" d
      let a1 = reduce a defs False
      let b1 = reduce b defs False
      let ah = hash a1
      let bh = hash b1
      s' <- readSTRef seen
      if | (ah == bh)              -> return True
         | (ah,bh) `Set.member` s' -> return True
         | (bh,ah) `Set.member` s' -> return True
         | otherwise -> do
             modifySTRef' seen ((Set.insert (ah,bh)) . (Set.insert (bh,ah)))
             case (a1,b1) of
               (All _ ar as _ ah ab, All _ br bs _ bh bb) -> do
                 let a1_body = ab (var dep) (var (dep + 1))
                 let b1_body = bb (var dep) (var (dep + 1))
                 let rig_eq  = ar == br
                 let self_eq = as == bs
                 bind_eq <- go ah bh dep seen
                 body_eq <- go a1_body b1_body (dep+2) seen
                 return $ rig_eq && self_eq && bind_eq && body_eq
               (Lam _ ae _ ab, Lam _ be _ bb) -> do
                 let a1_body = ab (var dep)
                 let b1_body = bb (var dep)
                 let eras_eq = ae == be
                 body_eq <- go a1_body b1_body (dep+1) seen
                 return $ eras_eq && body_eq
               (App _ ae af aa, App _ be bf ba) -> do
                 let eras_eq = ae == be
                 func_eq <- go af bf dep seen
                 argm_eq <- go aa ba dep seen
                 return $ eras_eq && func_eq && argm_eq
               _ -> return False

data CheckErr = CheckErr Loc Ctx Text deriving Show
type Ctx      = Seq (Rig, Term)
type PreCtx   = Seq (Rig, Term) -- should stand for contexts with only the Zero quantity
type TermType = Term

multiplyCtx :: Rig -> Ctx -> Ctx
multiplyCtx rig ctx = fmap mul ctx
  where mul (rig', typ') = (rig *# rig', typ')

-- Assumes both context are compatible (different only by quantities)
addCtx :: Ctx -> Ctx -> Ctx
addCtx ctx ctx' = Seq.zipWith add ctx ctx'
  where add (rig, typ) (rig', _) = (rig +# rig', typ)

mismatchMsg :: Bool -> Rig -> Rig -> Text
mismatchMsg linear found expected =
  T.concat ["Let quantity mismatch.",
             "\nFound: ", T.pack $ show found,
             "\nExcepted: ", T.pack $ show expected,
             if linear then "" else " or less."]

check :: Bool -> PreCtx -> Rig -> Term -> TermType -> Module -> Except CheckErr Ctx
check linear prectx rig trm typ defs = do
  let var n l = Var noLoc n l
  let typv = reduce typ defs False
  case trm of
    Lam trm_loc _ trm_name trm_body -> case typv of
      All _ typ_rig typ_self typ_name typ_bind typ_body -> do
        let name_var = var trm_name (length prectx)
        let prectx'  = prectx |> (Zero, typ_bind)
        ctx' <- check linear prectx' One (trm_body name_var) (typ_body trm name_var) defs
        case viewr ctx' of
          EmptyR               -> throwError (CheckErr trm_loc prectx "Impossible")
          ctx :> (typ_rig', _) -> do
            unless (if linear then typ_rig' == typ_rig else typ_rig' ≤# typ_rig)
              (throwError (CheckErr trm_loc prectx $ mismatchMsg linear typ_rig' typ_rig))
            return $ multiplyCtx rig ctx
      _  -> do
        throwError (CheckErr trm_loc prectx "Lambda has non-function type")
    Let trm_loc let_rig trm_name trm_expr trm_body -> do
      (ctx, expr_typ) <- infer linear prectx let_rig trm_expr defs
      let expr_var = var trm_name (length prectx)
      let prectx' = prectx |> (Zero, expr_typ)
      ctx' <- check linear prectx' One (trm_body expr_var) typ defs
      case viewr ctx' of
        EmptyR                -> throwError (CheckErr trm_loc prectx "Impossible")
        ctx' :> (typ_rig', _) -> do
          unless (if linear then typ_rig' == let_rig else typ_rig' ≤# let_rig)
            (throwError (CheckErr trm_loc prectx $ mismatchMsg linear typ_rig' let_rig))
          return $ multiplyCtx rig (addCtx ctx ctx')
    _ -> do
      (ctx, infr) <- infer linear prectx rig trm defs
      if equal typ infr defs (length prectx)
        then return ctx
        else do
        let errMsg = T.concat ["Found type... \x1b[2m", term $ normalize infr defs False, "\x1b[0m\n",
                               "Instead of... \x1b[2m", term $ normalize typ defs False,  "\x1b[0m"]
        throwError (CheckErr noLoc prectx errMsg)

infer :: Bool -> PreCtx -> Rig -> Term -> Module -> Except CheckErr (Ctx, TermType)
infer linear prectx rig trm defs = do
  let var n l = Var noLoc n l
  case trm of
    Var l n idx -> do
      let (_, typ) = Seq.index prectx idx
      let ctx = Seq.update idx (rig, typ) prectx
      return (ctx, typ)
    Ref l n -> case (_defs defs) Map.!? n of
      Just (Expr _ t _) -> return (prectx, t)
      Nothing           -> throwError (CheckErr l prectx (T.concat ["Undefined reference ", n]))
    Ann trm_loc _ trm_expr trm_type -> do
      -- The case done = True does not currently work
      ctx <- check linear prectx rig trm_expr trm_type defs
      return (ctx, trm_type)
    Typ l   -> return (prectx, Typ l)
    All trm_loc trm_rig trm_self trm_name trm_bind trm_body -> do
      let self_var = var trm_self $ length prectx
      let name_var = var trm_name $ length prectx + 1
      let prectx'  = prectx |> (Zero, trm) |> (Zero, trm_bind)
      check linear prectx Zero trm_bind (Typ noLoc) defs
      check linear prectx' Zero (trm_body self_var name_var) (Typ noLoc) defs
      return (prectx, Typ noLoc)
    App trm_loc _ trm_func trm_argm -> do
      (ctx, func_typ') <- infer linear prectx rig trm_func defs
      let func_typ = reduce func_typ' defs False
      case func_typ of
        All _ ftyp_rig ftyp_self_ ftyp_name ftyp_bind ftyp_body -> do
          ctx' <- check linear prectx (rig *# ftyp_rig) trm_argm ftyp_bind defs
          let trm_typ = ftyp_body trm_func trm_argm
          return (addCtx ctx ctx', trm_typ)
        _ -> throwError $ CheckErr trm_loc ctx "Non-function application"
    Let trm_loc let_rig trm_name trm_expr trm_body -> do
      (ctx, expr_typ) <- infer linear prectx let_rig trm_expr defs
      let expr_var = var trm_name (length prectx)
      let prectx' = prectx |> (Zero, expr_typ)
      (ctx', trm_typ) <- infer linear prectx' One (trm_body expr_var) defs
      case viewr ctx' of
        EmptyR                -> throwError (CheckErr trm_loc prectx "Impossible")
        ctx' :> (typ_rig', _) -> do
          unless (if linear then typ_rig' == let_rig else typ_rig' ≤# let_rig)
            (throwError (CheckErr trm_loc prectx  $ mismatchMsg linear typ_rig' let_rig))
          return (multiplyCtx rig (addCtx ctx ctx'), trm_typ)
    _ -> throwError $ CheckErr noLoc prectx "Cannot infer type"

checkExpr :: Bool -> Expr -> Module -> Except CheckErr ()
checkExpr linear (Expr n typ trm) mod = do
  --traceM $ "checking: " ++ T.unpack n
  --traceM $ "type: " ++ show typ
  --traceM $ "term: " ++ show trm
  check linear Seq.empty One trm typ mod
  return ()

checkModule :: Bool -> Module -> Except CheckErr ()
checkModule linear mod = forM_ (Map.toList $ _defs mod) (\(n,x) -> checkExpr linear x mod)

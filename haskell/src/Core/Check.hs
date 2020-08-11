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
               (Lam _ _ _ ab, Lam _ _ _ bb) -> do
                 let a1_body = ab (var dep)
                 let b1_body = bb (var dep)
                 body_eq <- go a1_body b1_body (dep+1) seen
                 return body_eq
               (App _ _ af aa, App _ _ bf ba) -> do
                 func_eq <- go af bf dep seen
                 argm_eq <- go aa ba dep seen
                 return $ func_eq && argm_eq
               _ -> return False

data CheckErr = CheckErr Loc Ctx Text deriving Show
type Ctx      = Seq (Rig, Term)
type PreCtx   = Seq (Rig, Term) -- should stand for contexts with only the Zero quantity
type TermType = Term

multiplyCtx :: Rig -> Ctx -> Ctx
multiplyCtx ρ ctx = fmap mul ctx
  where mul (π, typ) = (ρ *# π, typ)

-- Assumes both context are compatible (different only by quantities)
addCtx :: Ctx -> Ctx -> Ctx
addCtx ctx ctx' = Seq.zipWith add ctx ctx'
  where add (π, typ) (π', _) = (π +# π', typ)

mismatchMsg :: Bool -> Rig -> Rig -> Text
mismatchMsg linear found expected =
  T.concat ["Quantity mismatch.",
             "\nFound: ", T.pack $ show found,
             "\nExcepted: ", T.pack $ show expected,
             if linear then "" else " or less."]

check :: Bool -> PreCtx -> Rig -> Term -> TermType -> Module -> Except CheckErr Ctx
check linear prectx ρ trm typ defs =
  case trm of
    Lam loc _ name trm_body -> case reduce typ defs False of
      All _ π _ _ bind typ_body -> do
        let var = Var noLoc name (length prectx)
        let prectx'  = prectx |> (Zero, bind)
        ctx' <- check linear prectx' One (trm_body var) (typ_body trm var) defs
        case viewr ctx' of
          EmptyR               -> throwError (CheckErr loc prectx "Impossible")
          ctx :> (π', _) -> do
            unless (if linear then π' == π else π' ≤# π)
              (throwError (CheckErr loc prectx $ mismatchMsg linear π' π))
            return $ multiplyCtx ρ ctx
      _  -> do
        throwError (CheckErr loc prectx "Lambda has non-function type")
    Let loc π name expr body -> do
      (ctx, expr_typ) <- infer linear prectx π expr defs
      let var = Var noLoc name (length prectx)
      let prectx' = prectx |> (Zero, expr_typ)
      ctx' <- check linear prectx' One (body var) typ defs
      case viewr ctx' of
        EmptyR                -> throwError (CheckErr loc prectx "Impossible")
        ctx' :> (π', _) -> do
          unless (if linear then π' == π else π' ≤# π)
            (throwError (CheckErr loc prectx $ mismatchMsg linear π' π))
          return $ multiplyCtx ρ (addCtx ctx ctx')
    _ -> do
      (ctx, infr) <- infer linear prectx ρ trm defs
      if equal typ infr defs (length prectx)
        then return ctx
        else do
        let errMsg = T.concat ["Found type... \x1b[2m", term $ normalize infr defs False, "\x1b[0m\n",
                               "Instead of... \x1b[2m", term $ normalize typ defs False,  "\x1b[0m"]
        throwError (CheckErr noLoc prectx errMsg)

infer :: Bool -> PreCtx -> Rig -> Term -> Module -> Except CheckErr (Ctx, TermType)
infer linear prectx ρ trm defs =
  case trm of
    Var l n idx -> do
      let (_, typ) = Seq.index prectx idx
      let ctx = Seq.update idx (ρ, typ) prectx
      return (ctx, typ)
    Ref l n -> case (_defs defs) Map.!? n of
      Just (Expr _ t _) -> return (prectx, t)
      Nothing           -> throwError (CheckErr l prectx (T.concat ["Undefined reference ", n]))
    Ann loc expr typ -> do
      ctx <- check linear prectx ρ expr typ defs
      return (ctx, typ)
    Typ l   -> return (prectx, Typ l)
    All loc π self name bind body -> do
      let self_var = Var noLoc self $ length prectx
      let name_var = Var noLoc name $ length prectx + 1
      let prectx'  = prectx |> (Zero, trm) |> (Zero, bind)
      check linear prectx Zero bind (Typ noLoc) defs
      check linear prectx' Zero (body self_var name_var) (Typ noLoc) defs
      return (prectx, Typ noLoc)
    App loc _ func argm -> do
      (ctx, func_typ') <- infer linear prectx ρ func defs
      let func_typ = reduce func_typ' defs False
      case func_typ of
        All _ π _ _ bind body -> do
          ctx' <- check linear prectx (ρ *# π) argm bind defs
          let typ = body func argm
          return (addCtx ctx ctx', typ)
        _ -> throwError $ CheckErr loc ctx "Non-function application"
    Let loc π name expr body -> do
      (ctx, expr_typ) <- infer linear prectx π expr defs
      let expr_var = Var noLoc name (length prectx)
      let prectx' = prectx |> (Zero, expr_typ)
      (ctx', typ) <- infer linear prectx' One (body expr_var) defs
      case viewr ctx' of
        EmptyR                -> throwError (CheckErr loc prectx "Impossible")
        ctx' :> (π', _) -> do
          unless (if linear then π' == π else π' ≤# π)
            (throwError (CheckErr loc prectx  $ mismatchMsg linear π' π))
          return (multiplyCtx ρ (addCtx ctx ctx'), typ)
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

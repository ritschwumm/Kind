{-# LANGUAGE OverloadedStrings #-}
module Core.Eval where

import Core.Rig
import Core.Type
import Core.Hash

import Data.Map (Map)
import qualified Data.Map as Map

import Data.Set (Set)
import qualified Data.Set as Set

import           Data.Text                  (Text)
import qualified Data.Text                  as T

import Control.Monad.ST
import Data.STRef
import Control.Monad.ST.UnsafePerform

import Debug.Trace

reduce :: Term -> Module -> Bool -> Term
reduce term (Module defs) erase = go term
  where
    go term =
      case term of
        Var _ n idx      ->
          Var noLoc n idx
        Ref l n          ->
          case defs Map.!? n of
            Just (Expr _ _ got@(Ref _ m)) -> got
            Just (Expr _ _ got)           -> go got
            Nothing                       -> Ref l n
        Typ _            -> Typ noLoc
        All _ _ _ _ _ _  -> term
        Lam _ q n b      ->
          if q == Zero && erase then go (b (Lam noLoc One "" (\x -> x))) else term
        App _ q f a      ->
          if q == Zero && erase then go f else
            case go f of
              Lam _ e n b  ->
                go (b a)
              x          ->
                term
        Let _ _ n x b    -> go (b x)
        Ann _ x t        -> go x

-- Normalize
normalize :: Term -> Module -> Bool -> Term
normalize term defs erased = runST (top term)
  where
    top :: Term -> ST s Term
    top term = do
      seen <- newSTRef (Set.empty)
      go term seen

    go :: Term -> (STRef s (Set Hash)) -> ST s Term
    go term seen = do
      let norm  = reduce term defs erased
      let termH = hash term
      let normH = hash norm
      seen' <- readSTRef seen
      if | (termH `Set.member` seen' || normH `Set.member` seen') -> return norm
         | otherwise -> do
           modifySTRef' seen ((Set.insert termH) . (Set.insert normH))
           case norm of
             Var l n idx      -> return $ Var l n idx
             Ref l n          -> return $ Ref l n
             Typ l            -> return $ Typ l
             All _ r s n h b  -> do
               bind <- go h seen
               return $ All noLoc r s n bind (\s x -> unsafePerformST $ go (b s x) seen)
             Lam _ q n b      -> traceShow norm $ do
               return $ Lam noLoc q n (\x -> unsafePerformST $ go (b x) seen)
             App _ q f a      -> do
              func <- go f seen
              argm <- go a seen
              return $ App noLoc q func argm
             -- Should not happen
             Let _ _ n x b    -> go (b x) seen
             Ann _ x t        -> go x seen

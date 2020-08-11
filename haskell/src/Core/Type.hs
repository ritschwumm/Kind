module Core.Type where

import Core.Rig

import Data.Text (Text)
import qualified Data.Text as T hiding (find)

import Data.Map (Map)
import qualified Data.Map as M

type Name = Text

data Term
  = Var Loc Text Int
  | Ref Loc Text
  | Typ Loc
  | All Loc Rig  Name Name Term (Term -> Term -> Term)
  | Lam Loc Bool Name (Term -> Term)
  | App Loc Bool Term Term
  | Let Loc Rig Name Term (Term -> Term)
  | Ann Loc Bool Term Term

data Loc = Loc { _from :: Int, _upto :: Int } deriving Show

noLoc = Loc 0 0

data Expr   = Expr { _name :: Name, _type :: Term, _term :: Term }
data Module = Module { _defs :: (Map Name Expr)}

deref :: Name -> Module -> Expr
deref n m = (_defs m) M.! n

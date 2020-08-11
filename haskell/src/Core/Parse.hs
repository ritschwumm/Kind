module Core.Parse where

import           Control.Monad.Identity

import           Data.Text                  (Text)
import qualified Data.Text                  as T
import           Data.Map (Map)
import qualified Data.Map as M
import           Data.Void

import           Text.Megaparsec            hiding (State)
import           Text.Megaparsec.Char
import qualified Text.Megaparsec.Char.Lexer as L

import           Core.Rig
import           Core.Type
import qualified Core.Print as Core.Print

type Ctx = [(Name,Term)]

find :: Ctx -> ((Name,Term) -> Bool) -> Maybe ((Name,Term),Int)
find ctx f = go ctx 0
  where
    go [] _     = Nothing
    go (x:xs) i = if f x then Just (x,i) else go xs (i+1)

type Parser = ParsecT Void Text Identity

name :: Bool -> Parser Name
name empty = (if empty then takeWhileP else takeWhile1P)
  (Just "a name (alphanumeric,'_','.')") (flip elem $ nameChar)
  where nameChar = ['0'..'9'] ++ ['a'..'z'] ++ ['A'..'Z'] ++ "_" ++ "."

spaceC :: Parser ()
spaceC = L.space space1 (L.skipLineComment "//") (L.skipBlockComment "#" "#")

symbol :: Text -> Parser Text
symbol = L.symbol spaceC

-- The term parser
-- TODO: proper error printing instead of the `\n` hack to
-- make the ShowErrorComponent print nicely
-- (Perhaps by using a typerep proxy plus a new typeclass instance)
term :: Parser (Ctx -> Term)
term = do
  from <- getOffset
  t    <- choice $
    [ label "\n - the type of types: \"*\"" $
        symbol "*" >> (return $ \ctx -> Typ (Loc from (from+1)))
    , label "\n - a forall: \"Πself(π x: A) B\"" $ do
        which <- string "∀" <|> string "Π"
        self  <- name True <* symbol "("
        rig   <-
          if which == "∀"
          then return Zero
          else do
            which <- symbol "1" <|> return ""
            return $ if which == "1" then One else Many
        name  <- name True <* spaceC <* symbol ":"
        bind  <- term <* symbol ")"
        body  <- term
        upto  <- getOffset
        return $ \ctx -> All (Loc from upto)
          rig self name (bind ctx) (\s x -> body ((name,x):(self,s):ctx))
    , label "\n - a lambda: \"Λx b\", \"λx b\"" $ do
        from <- getOffset
        string "Λ" <|> string "λ"
        name <- name True <* spaceC
        body <- term
        upto <- getOffset
        return $ \ctx ->
          Lam (Loc from upto) Zero name (\x -> body ((name,x):ctx))
    , label "\n - an application: \"<f a>\", \"(f a)\"" $ do
        eras <- (=="<") <$> (symbol "<" <|> symbol "(")
        func <- term
        argm <- term
        symbol (if eras then ">" else ")")
        upto <- getOffset
        return $ \ctx ->
          App (Loc from upto) Zero (func ctx) (argm ctx)
    , label "\n - a definition: \"$x = y; b\"" $ do
        string "$"
        name <- name True <* spaceC <* symbol "="
        expr <- term <* symbol ";"
        body <- term
        upto <- getOffset
        return $ \ctx ->
          Let (Loc from upto) Many name (expr ctx) (\x -> body ((name,x):ctx))
    , label "\n - a type annotation: \":A x\"" $ do
        symbol ":"
        typ_ <- term
        expr <- term
        upto <- getOffset
        return $ \ctx ->
          Ann (Loc from upto) (expr ctx) (typ_ ctx)
    , label "\n - a reference, either global or local: \"x\"" $ do
        name <- name False
        upto <- getOffset
        return $ \ctx -> case find ctx (\(n,i) -> n == name) of
          Nothing -> Ref (Loc from upto) name
          Just ((n,t),i) -> t
    ]
  spaceC
  return t

expr :: Parser Expr
expr = do
  name <- name False <* symbol ":"
  typ_ <- ($ []) <$> term
  term <- ($ []) <$> term
  return $ Expr name typ_ term

modl :: Parser Module
modl = Module . M.fromList . fmap (\d -> (_name d, d)) <$> defs
  where
    defs :: Parser [Expr]
    defs = (do {spaceC; x <- expr; (x:) <$> defs}) <|> (spaceC >> return [])

module Core.Rig where

data Rig = Zero | One | Many deriving (Eq, Show)

(+#) :: Rig -> Rig -> Rig
Zero +# x    = x
One  +# Zero = One
One  +# x    = Many
Many +# x    = Many

(*#) :: Rig -> Rig -> Rig
Zero *# x    = Zero
One  *# x    = x
Many *# One  = Many
Many *# x    = x

(≤#) :: Rig -> Rig -> Bool
Zero ≤# x    = True
One  ≤# Zero = False
One  ≤# x    = True
Many ≤# Many = True
Many ≤# x    = False

-- Division of multiplicities: x/y is defined as the largest d such that d*y is not larger than x
(/#) :: Rig -> Rig -> Rig
x   /# Zero = Many
x   /# One  = x
One /# Many = Zero
x   /# Many = x

-- Subtraction of multiplicities: x-y is defined, if it exists, as the largest d such that d+y is not larger than x
(-#) :: Rig -> Rig -> Maybe(Rig)
x    -# Zero = Just x
Zero -# x    = Nothing
One  -# One  = Just Zero
One  -# Many = Nothing
Many -# x    = Just Many

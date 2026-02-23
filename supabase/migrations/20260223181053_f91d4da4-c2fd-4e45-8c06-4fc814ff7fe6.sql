
-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

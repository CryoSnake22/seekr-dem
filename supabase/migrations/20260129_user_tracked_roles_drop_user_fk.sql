-- Allow user_tracked_roles to store auth.uid() without requiring a row in public.users.
-- This fixes 500 on PUT when the user exists in auth but not yet in public.users.
ALTER TABLE public.user_tracked_roles DROP CONSTRAINT IF EXISTS user_tracked_roles_user_id_fkey;
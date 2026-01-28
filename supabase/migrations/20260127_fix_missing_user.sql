-- Fix missing user records in public.users
-- This creates records for any auth.users that don't have a corresponding public.users entry

INSERT INTO public.users (id, email, full_name)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name'
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Show what was created
SELECT 'Created user records for: ' || string_agg(email, ', ')
FROM public.users
WHERE created_at > NOW() - INTERVAL '1 minute';

--i Add onboarding_completed column to users table
-- This column tracks whether a user has completed the onboarding wizard

-- Note: Supabase uses auth.users for authentication, but we use a public.users table for profile data
-- The auth.users table is managed by Supabase Auth and doesn't allow custom columns
-- So we add this column to whichever users table exists in the public schema

DO $$
BEGIN
    -- Check if users table exists in public schema
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
    ) THEN
        -- Add onboarding_completed column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'onboarding_completed'
        ) THEN
            ALTER TABLE public.users
            ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
        END IF;
    END IF;
END $$;

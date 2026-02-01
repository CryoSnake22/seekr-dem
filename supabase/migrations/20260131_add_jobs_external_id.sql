-- Add external_id column to jobs table
-- This stores the unique ID from the external job API (JSearch, etc.)
-- Used to prevent duplicate job postings when scraping

DO $$
BEGIN
    -- Check if jobs table exists, create if it doesn't
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'jobs'
    ) THEN
        CREATE TABLE public.jobs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            external_id TEXT,
            job_title TEXT NOT NULL,
            company TEXT NOT NULL,
            description TEXT,
            posted_date TIMESTAMP,
            location TEXT,
            source TEXT,
            job_role TEXT,
            external_url TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Create index on external_id for faster lookups
        CREATE INDEX IF NOT EXISTS idx_jobs_external_id ON public.jobs(external_id);
        CREATE INDEX IF NOT EXISTS idx_jobs_job_role ON public.jobs(job_role);
        CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
    ELSE
        -- Table exists, add external_id column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'jobs'
            AND column_name = 'external_id'
        ) THEN
            ALTER TABLE public.jobs ADD COLUMN external_id TEXT;
            CREATE INDEX IF NOT EXISTS idx_jobs_external_id ON public.jobs(external_id);
        END IF;

        -- Add missing columns if they don't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'jobs'
            AND column_name = 'external_url'
        ) THEN
            ALTER TABLE public.jobs ADD COLUMN external_url TEXT;
        END IF;
    END IF;
END $$;

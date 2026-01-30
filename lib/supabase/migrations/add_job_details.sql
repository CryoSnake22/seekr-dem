-- Add missing columns to user_target_jobs table for job matching feature
ALTER TABLE public.user_target_jobs
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS required_skills TEXT[],
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_target_jobs_user_id ON public.user_target_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_target_jobs_match_score ON public.user_target_jobs(match_score DESC);

-- Add delete policy if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_target_jobs'
    AND policyname = 'Users can delete own target jobs'
  ) THEN
    CREATE POLICY "Users can delete own target jobs" ON public.user_target_jobs
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

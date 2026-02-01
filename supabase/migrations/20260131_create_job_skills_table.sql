-- Create job_skills junction table
-- Links jobs to extracted skills for market intelligence

CREATE TABLE IF NOT EXISTS public.job_skills (
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (job_id, skill_name)
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_job_skills_job_id ON public.job_skills(job_id);
CREATE INDEX IF NOT EXISTS idx_job_skills_skill_name ON public.job_skills(skill_name);

-- Add helpful comment
COMMENT ON TABLE public.job_skills IS 'Junction table linking jobs to their required skills. Used for calculating skill frequency in market intelligence.';

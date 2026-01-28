-- Create project_skills table for storing skill proficiencies per project
CREATE TABLE IF NOT EXISTS project_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  usage_context TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);

-- Add GitHub integration columns to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS github_synced BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS github_repo_url TEXT,
ADD COLUMN IF NOT EXISTS github_last_synced TIMESTAMPTZ;

-- Comment for documentation
COMMENT ON TABLE project_skills IS 'Stores skill proficiencies for each project';
COMMENT ON COLUMN project_skills.usage_context IS 'Description of how the skill was used in the project (e.g., "Built API endpoints", "Configured CI/CD")';

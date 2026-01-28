-- Create github_repositories table for storing synced GitHub repos
CREATE TABLE IF NOT EXISTS github_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  description TEXT,
  languages JSONB DEFAULT '{}',
  stars INTEGER DEFAULT 0,
  last_commit_date TIMESTAMPTZ,
  analyzed_at TIMESTAMPTZ,
  included_in_profile BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, repo_url)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_github_repositories_user_id ON github_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_github_repositories_included ON github_repositories(user_id, included_in_profile);

-- Add GitHub access token storage (encrypted by Supabase)
-- Store in user_metadata or create a separate table
CREATE TABLE IF NOT EXISTS user_github_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'bearer',
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_user_github_tokens_user_id ON user_github_tokens(user_id);

COMMENT ON TABLE github_repositories IS 'Stores synchronized GitHub repositories for users';
COMMENT ON TABLE user_github_tokens IS 'Stores GitHub OAuth tokens for API access (ensure proper encryption)';

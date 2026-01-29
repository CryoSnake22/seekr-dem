-- User tracked roles: which job roles the user wants to see in dashboard/skills-gap
CREATE TABLE IF NOT EXISTS public.user_tracked_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_role)
);

CREATE INDEX IF NOT EXISTS idx_user_tracked_roles_user_id ON public.user_tracked_roles(user_id);

ALTER TABLE public.user_tracked_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tracked roles"
  ON public.user_tracked_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tracked roles"
  ON public.user_tracked_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracked roles"
  ON public.user_tracked_roles FOR DELETE
  USING (auth.uid() = user_id);

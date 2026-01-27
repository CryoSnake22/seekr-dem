-- Seekr Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE public.education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  degree TEXT NOT NULL,
  major TEXT NOT NULL,
  university TEXT NOT NULL,
  graduation_date DATE,
  gpa DECIMAL(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience table
CREATE TABLE public.experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  technologies TEXT[], -- Array of tech used
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skills table
CREATE TABLE public.user_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency TEXT CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table (for scraped job data)
CREATE TABLE public.jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_role TEXT NOT NULL,
  company TEXT,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[],
  source TEXT, -- 'jsearch', 'adzuna', etc.
  external_id TEXT UNIQUE,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills market data (aggregated)
CREATE TABLE public.skills_market_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_role TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  frequency_count INTEGER DEFAULT 0,
  frequency_percentage DECIMAL(5, 2) DEFAULT 0,
  priority_level TEXT CHECK (priority_level IN ('High', 'Medium', 'Low')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_role, skill_name)
);

-- User target jobs
CREATE TABLE public.user_target_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_role TEXT NOT NULL,
  match_score DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Match score history
CREATE TABLE public.match_score_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_role TEXT NOT NULL,
  match_score DECIMAL(5, 2) NOT NULL,
  skills_added TEXT[],
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat messages
CREATE TABLE public.ai_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_education_user_id ON public.education(user_id);
CREATE INDEX idx_experience_user_id ON public.experience(user_id);
CREATE INDEX idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_jobs_job_role ON public.jobs(job_role);
CREATE INDEX idx_skills_market_data_job_role ON public.skills_market_data(job_role);
CREATE INDEX idx_skills_market_data_skill_name ON public.skills_market_data(skill_name);
CREATE INDEX idx_match_score_history_user_id ON public.match_score_history(user_id);
CREATE INDEX idx_ai_chat_messages_user_id ON public.ai_chat_messages(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_target_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own education" ON public.education
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education" ON public.education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education" ON public.education
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own education" ON public.education
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own experience" ON public.experience
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experience" ON public.experience
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experience" ON public.experience
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experience" ON public.experience
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own skills" ON public.user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills" ON public.user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON public.user_skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills" ON public.user_skills
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Public read for market data (authenticated users only)
CREATE POLICY "Authenticated users can view jobs" ON public.jobs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view skills market data" ON public.skills_market_data
  FOR SELECT USING (auth.role() = 'authenticated');

-- User-specific policies for target jobs and history
CREATE POLICY "Users can view own target jobs" ON public.user_target_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own target jobs" ON public.user_target_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own target jobs" ON public.user_target_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own match score history" ON public.match_score_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own match score history" ON public.match_score_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chat messages" ON public.ai_chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.ai_chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_education
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_experience
  BEFORE UPDATE ON public.experience
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_target_jobs
  BEFORE UPDATE ON public.user_target_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

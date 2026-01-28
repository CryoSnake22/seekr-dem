// Backend API Response Types

// Skills Gap Analysis Types
export interface UserSkillItem {
  skill_name: string
  user_proficiency: string | null
  frequency_percentage: number | null
  priority_level: string | null
}

export interface MissingSkillItem {
  skill_name: string
  frequency_percentage: number
  priority: 'High' | 'Medium' | 'Low'
}

export interface SkillGapResult {
  job_role: string
  match_score: number
  user_skill_count: number
  total_market_skills: number
  user_skills: UserSkillItem[]
  missing_skills: MissingSkillItem[]
}

export interface MultiRoleSkillGapResponse {
  user_id: string
  results: SkillGapResult[]
  timestamp: string
}

export interface SkillGapHistoryEntry {
  id: string
  user_id: string
  job_role: string
  match_score: number
  skills_added: string[]
  skills_removed: string[]
  recorded_at: string
}

export interface TrackSkillGapRequest {
  job_role: string
  match_score: number
  skills_added?: string[]
  skills_removed?: string[]
}

// AI Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface ChatHistoryResponse {
  user_id: string
  conversation_history: ChatMessage[]
  total_messages: number
}

export interface AIUsageStats {
  user_id: string
  total_requests: number
  requests_today: number
  daily_limit: number
  remaining_today: number
  last_request_at: string | null
}

export interface WebSocketMessage {
  token?: string
  message: string
  include_profile_context?: boolean
}

export interface WebSocketChunk {
  type: 'chunk' | 'done' | 'error'
  content?: string
  error?: string
}

// GitHub Integration Types
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  updated_at: string
}

export interface DetectedSkill {
  skill_name: string
  source: 'language' | 'framework' | 'topic' | 'readme'
  confidence: number
}

export interface GitHubSyncResponse {
  synced_count: number
  repositories: GitHubRepository[]
  detected_skills: DetectedSkill[]
  projects_created: number
}

export interface GitHubConnectionStatus {
  connected: boolean
  username: string | null
  last_sync: string | null
  repository_count: number
}

// Resume Parsing Types
export interface ResumeParseResponse {
  parse_id: string
  status: 'completed' | 'failed' | 'processing'
  parsed_data: {
    education: Array<{
      degree: string
      major: string | null
      university: string
      graduation_date: string | null
      gpa: number | null
    }>
    experience: Array<{
      company: string
      role: string
      start_date: string | null
      end_date: string | null
      description: string
      technologies: string[]
    }>
    skills: Array<{
      skill_name: string
      proficiency: 'Beginner' | 'Intermediate' | 'Advanced'
    }>
    projects: Array<{
      title: string
      description: string
      technologies: string[]
      github_url: string | null
      demo_url: string | null
    }>
  } | null
  confidence_score: number | null
  error: string | null
}

export interface ParsedEducation {
  institution: string
  degree: string | null
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
}

export interface ParsedExperience {
  company: string
  position: string
  start_date: string | null
  end_date: string | null
  description: string | null
  is_current: boolean
}

export interface ParsedProject {
  name: string
  description: string | null
  technologies: string[]
  url: string | null
  start_date: string | null
  end_date: string | null
}

export interface ParsedSkill {
  skill_name: string
  category: string | null
  proficiency_level: string | null
}

export interface ParsedResume {
  parse_id: string
  filename: string
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  summary: string | null
  education: ParsedEducation[]
  experience: ParsedExperience[]
  projects: ParsedProject[]
  skills: ParsedSkill[]
  certifications: string[]
  languages: string[]
  parsed_at: string
}

export interface ApplyResumeRequest {
  parse_id: string
  confirm: boolean
  overwrite_existing?: boolean
}

export interface ApplyResumeResponse {
  success: boolean
  updated_sections: string[]
  education_added: number
  experience_added: number
  projects_added: number
  skills_added: number
}

// Market Intelligence Types
export interface MarketSkill {
  skill_name: string
  frequency_percentage: number
  priority_level: 'High' | 'Medium' | 'Low'
  related_roles: string[]
}

export interface RoleSkillsResponse {
  job_role: string
  total_skills: number
  skills: MarketSkill[]
  last_updated: string
}

export interface TrendingSkill {
  skill_name: string
  trend_score: number
  growth_rate: number
  current_demand: number
}

export interface TrendingSkillsResponse {
  trending_skills: TrendingSkill[]
  period: string
  last_updated: string
}

export interface RoleInfo {
  role_name: string
  skill_count: number
  avg_frequency: number
}

export interface AvailableRolesResponse {
  roles: RoleInfo[]
  total_roles: number
}

// Generic API Response Wrapper
export interface BackendResponse<T> {
  data: T | null
  error: {
    message: string
    code?: string
  } | null
}

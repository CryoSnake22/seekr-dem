/**
 * Market Intelligence TypeScript Types
 *
 * Types for market data, skill frequencies, trending skills, and job roles.
 * Matches backend API schemas from backend/app/models/schemas.py
 */

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low'

export interface MarketSkill {
  skill_name: string
  frequency_count: number
  frequency_percentage: number
  priority_level: PriorityLevel
}

export interface MarketSkillsResponse {
  job_role: string
  skills: MarketSkill[]
  total_skills: number
  last_updated?: string | null
}

export interface TrendingSkill {
  skill_name: string
  current_frequency: number
  growth_rate: number
  trending_in_roles: string[]
}

export interface TrendingSkillsResponse {
  trending_skills: TrendingSkill[]
  timeframe: string
}

export interface JobRoleMarket {
  job_role: string
  total_skills: number
  total_jobs?: number | null
  avg_match_score?: number | null
}

export interface JobRolesResponse {
  roles: JobRoleMarket[]
}

export interface MarketOverview {
  total_skills: number
  most_in_demand_skill: string
  most_in_demand_frequency: number
  avg_frequency: number
  last_updated?: string | null
}

export interface SkillCategory {
  category: string
  count: number
  percentage: number
}

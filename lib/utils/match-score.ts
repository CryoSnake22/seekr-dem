import { SupabaseClient } from '@supabase/supabase-js'

export interface MarketSkill {
  skill_name: string
  frequency_percentage: number
}

export interface UserSkill {
  name: string
  proficiency_level?: string
}

const PROFICIENCY_WEIGHTS = {
  'Expert': 1.0,
  'Advanced': 1.0,
  'Intermediate': 0.75,
  'Beginner': 0.5,
} as const

/**
 * Calculate match score between user skills and market skills
 * Uses proficiency weighting when available
 */
export function calculateMatchScore(
  userSkills: UserSkill[] | string[],
  marketSkills: MarketSkill[]
): number {
  if (marketSkills.length === 0) return 0

  // Normalize user skills to objects
  const normalizedUserSkills: UserSkill[] = userSkills.map(skill =>
    typeof skill === 'string' ? { name: skill } : skill
  )

  const userSkillsLower = normalizedUserSkills.map(s => s.name.toLowerCase())

  let totalWeight = 0
  let matchedWeight = 0

  for (const marketSkill of marketSkills) {
    const weight = marketSkill.frequency_percentage
    totalWeight += weight

    const userSkillIndex = userSkillsLower.indexOf(marketSkill.skill_name.toLowerCase())

    if (userSkillIndex !== -1) {
      const userSkill = normalizedUserSkills[userSkillIndex]
      const profWeight = userSkill.proficiency_level
        ? (PROFICIENCY_WEIGHTS[userSkill.proficiency_level as keyof typeof PROFICIENCY_WEIGHTS] || 0.5)
        : 1.0 // Default to full credit if no proficiency specified

      matchedWeight += weight * profWeight
    }
  }

  return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0
}

/**
 * Get missing skills with priority based on frequency
 */
export function getMissingSkills(
  userSkills: UserSkill[] | string[],
  marketSkills: MarketSkill[]
): Array<{ name: string; priority: 'High' | 'Medium' | 'Low'; frequency: number }> {
  const normalizedUserSkills: UserSkill[] = userSkills.map(skill =>
    typeof skill === 'string' ? { name: skill } : skill
  )
  const userSkillsLower = normalizedUserSkills.map(s => s.name.toLowerCase())

  const missing = marketSkills
    .filter(skill => !userSkillsLower.includes(skill.skill_name.toLowerCase()))
    .map(skill => ({
      name: skill.skill_name,
      frequency: skill.frequency_percentage,
      priority: skill.frequency_percentage > 50
        ? 'High' as const
        : skill.frequency_percentage > 25
        ? 'Medium' as const
        : 'Low' as const
    }))
    .sort((a, b) => b.frequency - a.frequency)

  return missing
}

/**
 * Calculate match score for a specific job role
 */
export async function calculateMatchScoreForRole(
  supabase: SupabaseClient,
  userId: string,
  jobRole: string
): Promise<{
  matchScore: number
  totalMarketSkills: number
  userSkillCount: number
  missingSkills: Array<{ name: string; priority: 'High' | 'Medium' | 'Low'; frequency: number }>
}> {
  // Fetch user skills
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_name, proficiency_level')
    .eq('user_id', userId)

  const userSkillsData: UserSkill[] = (userSkills || []).map(s => ({
    name: s.skill_name,
    proficiency_level: s.proficiency_level || undefined
  }))

  // Fetch market data
  const { data: marketData } = await supabase
    .from('market_data')
    .select('skill_name, frequency_percentage')
    .eq('job_role', jobRole)
    .order('frequency_percentage', { ascending: false })

  const marketSkills: MarketSkill[] = marketData || []

  // Calculate match score
  const matchScore = calculateMatchScore(userSkillsData, marketSkills)
  const missingSkills = getMissingSkills(userSkillsData, marketSkills)

  return {
    matchScore,
    totalMarketSkills: marketSkills.length,
    userSkillCount: userSkillsData.length,
    missingSkills
  }
}

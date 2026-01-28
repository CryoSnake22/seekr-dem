import { SupabaseClient } from '@supabase/supabase-js'

export interface MatchScoreHistoryRecord {
  user_id: string
  job_role: string
  match_score: number
  skills_added?: string[]
  recorded_at: string
}

/**
 * Record a match score for a user and job role
 */
export async function recordMatchScore(
  supabase: SupabaseClient,
  userId: string,
  jobRole: string,
  matchScore: number,
  skillsAdded?: string[]
) {
  const record: Omit<MatchScoreHistoryRecord, 'recorded_at'> & { recorded_at?: string } = {
    user_id: userId,
    job_role: jobRole,
    match_score: matchScore,
    skills_added: skillsAdded || [],
  }

  const { data, error } = await supabase
    .from('match_score_history')
    .insert(record)
    .select()
    .single()

  if (error) {
    console.error('Error recording match score:', error)
    throw error
  }

  return data
}

/**
 * Record match scores for multiple roles
 */
export async function recordMatchScoresForRoles(
  supabase: SupabaseClient,
  userId: string,
  roleScores: Array<{ role: string; score: number }>,
  skillsAdded?: string[]
) {
  const records = roleScores.map(({ role, score }) => ({
    user_id: userId,
    job_role: role,
    match_score: score,
    skills_added: skillsAdded || [],
  }))

  const { data, error } = await supabase
    .from('match_score_history')
    .insert(records)
    .select()

  if (error) {
    console.error('Error recording match scores:', error)
    throw error
  }

  return data
}

/**
 * Get match score history for a user
 */
export async function getMatchScoreHistory(
  supabase: SupabaseClient,
  userId: string,
  jobRole?: string,
  limit: number = 20
) {
  let query = supabase
    .from('match_score_history')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit)

  if (jobRole) {
    query = query.eq('job_role', jobRole)
  }

  const { data, error } = await supabase
    .from('match_score_history')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching match score history:', error)
    return []
  }

  return data || []
}

/**
 * Get latest match score for each role
 */
export async function getLatestMatchScores(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('match_score_history')
    .select('job_role, match_score, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })

  if (error) {
    console.error('Error fetching latest match scores:', error)
    return {}
  }

  // Group by role and take the most recent
  const latestByRole: Record<string, { score: number; recordedAt: string }> = {}

  for (const record of data || []) {
    if (!latestByRole[record.job_role]) {
      latestByRole[record.job_role] = {
        score: record.match_score,
        recordedAt: record.recorded_at
      }
    }
  }

  return latestByRole
}

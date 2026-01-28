import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'
import { calculateMatchScoreForRole } from '@/lib/utils/match-score'
import { recordMatchScoresForRoles } from '@/lib/supabase/queries/match-score-history'

type SkillRow = Database['public']['Tables']['user_skills']['Row']
type SkillInsert = Database['public']['Tables']['user_skills']['Insert']

type SkillInput = Omit<SkillInsert, 'user_id'>

type Proficiency = SkillInsert['proficiency']

const proficiencyLevels: Proficiency[] = ['Beginner', 'Intermediate', 'Advanced']

function normalizeSkillInput(body: Record<string, unknown> | null): SkillInput | null {
  if (!body) return null

  const skill_name = typeof body.skill_name === 'string' ? body.skill_name.trim() : ''
  if (!skill_name) return null

  const proficiency = typeof body.proficiency === 'string' && proficiencyLevels.includes(body.proficiency as Proficiency)
    ? (body.proficiency as Proficiency)
    : 'Intermediate'

  return {
    skill_name,
    proficiency,
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('skill_name', { ascending: true })

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<SkillRow[]>(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const input = normalizeSkillInput(body)

  if (!input) {
    return jsonError('Invalid skill payload', 400, 'validation')
  }

  const payload: SkillInsert = {
    user_id: userData.user.id,
    skill_name: input.skill_name,
    proficiency: input.proficiency,
  }

  const { data, error } = await supabase
    .from('user_skills')
    .insert(payload)
    .select()
    .single()

  if (error) {
    const status = error.code === '23505' ? 409 : 500
    return jsonError(error.message, status, error.code)
  }

  // Record match score history for top roles
  try {
    const topRoles = ['Software Engineer', 'Frontend Developer', 'Backend Developer']
    const roleScores = await Promise.all(
      topRoles.map(async (role) => {
        const result = await calculateMatchScoreForRole(supabase, userData.user.id, role)
        return { role, score: result.matchScore }
      })
    )

    await recordMatchScoresForRoles(
      supabase,
      userData.user.id,
      roleScores,
      [input.skill_name]
    )
  } catch (historyError) {
    // Log error but don't fail the request
    console.error('Failed to record match score history:', historyError)
  }

  return jsonSuccess<SkillRow>(data)
}

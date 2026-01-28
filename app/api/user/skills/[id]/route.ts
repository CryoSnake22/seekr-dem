import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'
import { calculateMatchScoreForRole } from '@/lib/utils/match-score'
import { recordMatchScoresForRoles } from '@/lib/supabase/queries/match-score-history'

type SkillRow = Database['public']['Tables']['user_skills']['Row']
type SkillUpdate = Database['public']['Tables']['user_skills']['Update']

type Proficiency = Database['public']['Tables']['user_skills']['Row']['proficiency']

const proficiencyLevels: Proficiency[] = ['Beginner', 'Intermediate', 'Advanced']

function normalizeSkillUpdate(body: Record<string, unknown> | null): SkillUpdate | null {
  if (!body) return null

  const updates: SkillUpdate = {}

  if (typeof body.skill_name === 'string') {
    const skill_name = body.skill_name.trim()
    if (!skill_name) return null
    updates.skill_name = skill_name
  }

  if (typeof body.proficiency === 'string') {
    const proficiency = body.proficiency as Proficiency
    if (!proficiencyLevels.includes(proficiency)) return null
    updates.proficiency = proficiency
  }

  if (Object.keys(updates).length === 0) return null
  return updates
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { id } = await params
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const updates = normalizeSkillUpdate(body)

  if (!updates) {
    return jsonError('Invalid skill payload', 400, 'validation')
  }

  const { data, error } = await supabase
    .from('user_skills')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userData.user.id)
    .select()
    .single()

  if (error) {
    const status = error.code === '23505' ? 409 : 500
    return jsonError(error.message, status, error.code)
  }

  // Record match score history for top roles after update
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
      roleScores
    )
  } catch (historyError) {
    console.error('Failed to record match score history:', historyError)
  }

  return jsonSuccess<SkillRow>(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { id } = await params
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id)

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  // Record match score history for top roles after deletion
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
      roleScores
    )
  } catch (historyError) {
    console.error('Failed to record match score history:', historyError)
  }

  return jsonSuccess({ id })
}

import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const updates = normalizeSkillUpdate(body)

  if (!updates) {
    return jsonError('Invalid skill payload', 400, 'validation')
  }

  const { data, error } = await supabase
    .from('user_skills')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', userData.user.id)
    .select()
    .single()

  if (error) {
    const status = error.code === '23505' ? 409 : 500
    return jsonError(error.message, status, error.code)
  }

  return jsonSuccess<SkillRow>(data)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userData.user.id)

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess({ id: params.id })
}

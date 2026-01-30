import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type ExperienceRow = Database['public']['Tables']['experience']['Row']
type ExperienceUpdate = Database['public']['Tables']['experience']['Update']

function normalizeStringArray(input: unknown) {
  if (Array.isArray(input)) {
    const values = input.filter((value) => typeof value === 'string').map((value) => value.trim()).filter(Boolean)
    return values.length ? values : null
  }

  if (typeof input === 'string') {
    const values = input
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
    return values.length ? values : null
  }

  return null
}

function normalizeExperienceUpdate(body: Record<string, unknown> | null): ExperienceUpdate | null {
  if (!body) return null

  const updates: ExperienceUpdate = {}

  if (typeof body.company === 'string') {
    const company = body.company.trim()
    if (!company) return null
    updates.company = company
  }

  if (typeof body.role === 'string') {
    const role = body.role.trim()
    if (!role) return null
    updates.role = role
  }

  if (typeof body.start_date === 'string') {
    updates.start_date = body.start_date
  }

  if (typeof body.end_date === 'string' || body.end_date === null) {
    updates.end_date = typeof body.end_date === 'string' ? body.end_date : null
  }

  if (typeof body.description === 'string' || body.description === null) {
    updates.description = typeof body.description === 'string' ? body.description.trim() : null
  }

  if (body.technologies !== undefined) {
    updates.technologies = normalizeStringArray(body.technologies)
  }

  if (Object.keys(updates).length === 0) return null
  return updates
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const updates = normalizeExperienceUpdate(body)

  if (!updates) {
    return jsonError('Invalid experience payload', 400, 'validation')
  }

  const { data, error } = await supabase
    .from('experience')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userData.user.id)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<ExperienceRow>(data)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id)

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess({ id })
}

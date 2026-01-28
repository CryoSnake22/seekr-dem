import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

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

function normalizeProjectUpdate(body: Record<string, unknown> | null): ProjectUpdate | null {
  if (!body) return null

  const updates: ProjectUpdate = {}

  if (typeof body.title === 'string') {
    const title = body.title.trim()
    if (!title) return null
    updates.title = title
  }

  if (typeof body.description === 'string' || body.description === null) {
    updates.description = typeof body.description === 'string' ? body.description.trim() : null
  }

  if (body.technologies !== undefined) {
    updates.technologies = normalizeStringArray(body.technologies)
  }

  if (typeof body.github_url === 'string' || body.github_url === null) {
    updates.github_url = typeof body.github_url === 'string' ? body.github_url.trim() : null
  }

  if (typeof body.demo_url === 'string' || body.demo_url === null) {
    updates.demo_url = typeof body.demo_url === 'string' ? body.demo_url.trim() : null
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
  const updates = normalizeProjectUpdate(body)

  if (!updates) {
    return jsonError('Invalid project payload', 400, 'validation')
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', userData.user.id)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<ProjectRow>(data)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userData.user.id)

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess({ id: params.id })
}

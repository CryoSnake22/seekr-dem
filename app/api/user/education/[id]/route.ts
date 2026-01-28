import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type EducationRow = Database['public']['Tables']['education']['Row']
type EducationUpdate = Database['public']['Tables']['education']['Update']

function normalizeEducationUpdate(body: Record<string, unknown> | null): EducationUpdate | null {
  if (!body) return null

  const updates: EducationUpdate = {}

  if (typeof body.degree === 'string') {
    const degree = body.degree.trim()
    if (!degree) return null
    updates.degree = degree
  }

  if (typeof body.major === 'string') {
    const major = body.major.trim()
    if (!major) return null
    updates.major = major
  }

  if (typeof body.university === 'string') {
    const university = body.university.trim()
    if (!university) return null
    updates.university = university
  }

  if (typeof body.graduation_date === 'string' || body.graduation_date === null) {
    updates.graduation_date = typeof body.graduation_date === 'string' ? body.graduation_date : null
  }

  if (typeof body.gpa === 'number' || typeof body.gpa === 'string' || body.gpa === null) {
    const gpaValue = typeof body.gpa === 'number' ? body.gpa : typeof body.gpa === 'string' ? Number(body.gpa) : null
    updates.gpa = Number.isFinite(gpaValue) ? gpaValue : null
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
  const updates = normalizeEducationUpdate(body)

  if (!updates) {
    return jsonError('Invalid education payload', 400, 'validation')
  }

  const { data, error } = await supabase
    .from('education')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', userData.user.id)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<EducationRow>(data)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userData.user.id)

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess({ id: params.id })
}

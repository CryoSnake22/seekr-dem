import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type EducationRow = Database['public']['Tables']['education']['Row']
type EducationInsert = Database['public']['Tables']['education']['Insert']

type EducationInput = Omit<EducationInsert, 'user_id'>

function normalizeEducationInput(body: Record<string, unknown> | null): EducationInput | null {
  if (!body) return null

  const degree = typeof body.degree === 'string' ? body.degree.trim() : ''
  const major = typeof body.major === 'string' ? body.major.trim() : ''
  const university = typeof body.university === 'string' ? body.university.trim() : ''

  if (!degree || !major || !university) return null

  const graduation_date = typeof body.graduation_date === 'string' ? body.graduation_date : null
  const gpaValue = typeof body.gpa === 'number' ? body.gpa : typeof body.gpa === 'string' ? Number(body.gpa) : null
  const gpa = Number.isFinite(gpaValue) ? gpaValue : null

  return {
    degree,
    major,
    university,
    graduation_date,
    gpa,
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('graduation_date', { ascending: false })

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<EducationRow[]>(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const input = normalizeEducationInput(body)

  if (!input) {
    return jsonError('Invalid education payload', 400, 'validation')
  }

  const payload: EducationInsert = {
    user_id: userData.user.id,
    degree: input.degree,
    major: input.major,
    university: input.university,
    graduation_date: input.graduation_date ?? null,
    gpa: input.gpa ?? null,
  }

  const { data, error } = await supabase
    .from('education')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<EducationRow>(data)
}

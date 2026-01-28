import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type ExperienceRow = Database['public']['Tables']['experience']['Row']
type ExperienceInsert = Database['public']['Tables']['experience']['Insert']

type ExperienceInput = Omit<ExperienceInsert, 'user_id'>

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

function normalizeExperienceInput(body: Record<string, unknown> | null): ExperienceInput | null {
  if (!body) return null

  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const role = typeof body.role === 'string' ? body.role.trim() : ''
  const start_date = typeof body.start_date === 'string' ? body.start_date : ''

  if (!company || !role || !start_date) return null

  const end_date = typeof body.end_date === 'string' ? body.end_date : null
  const description = typeof body.description === 'string' ? body.description.trim() : null
  const technologies = normalizeStringArray(body.technologies)

  return {
    company,
    role,
    start_date,
    end_date,
    description,
    technologies,
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('start_date', { ascending: false })

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<ExperienceRow[]>(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const input = normalizeExperienceInput(body)

  if (!input) {
    return jsonError('Invalid experience payload', 400, 'validation')
  }

  const payload: ExperienceInsert = {
    user_id: userData.user.id,
    company: input.company,
    role: input.role,
    start_date: input.start_date,
    end_date: input.end_date ?? null,
    description: input.description ?? null,
    technologies: input.technologies ?? null,
  }

  const { data, error } = await supabase
    .from('experience')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<ExperienceRow>(data)
}

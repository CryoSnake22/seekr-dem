import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

type ProjectInput = Omit<ProjectInsert, 'user_id'>

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

function normalizeProjectInput(body: Record<string, unknown> | null): ProjectInput | null {
  if (!body) return null

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (!title) return null

  const description = typeof body.description === 'string' ? body.description.trim() : null
  const technologies = normalizeStringArray(body.technologies)
  const github_url = typeof body.github_url === 'string' ? body.github_url.trim() : null
  const demo_url = typeof body.demo_url === 'string' ? body.demo_url.trim() : null

  return {
    title,
    description,
    technologies,
    github_url,
    demo_url,
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<ProjectRow[]>(data || [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const input = normalizeProjectInput(body)

  if (!input) {
    return jsonError('Invalid project payload', 400, 'validation')
  }

  const payload: ProjectInsert = {
    user_id: userData.user.id,
    title: input.title,
    description: input.description ?? null,
    technologies: input.technologies ?? null,
    github_url: input.github_url ?? null,
    demo_url: input.demo_url ?? null,
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<ProjectRow>(data)
}

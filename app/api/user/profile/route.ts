import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type UserRow = Database['public']['Tables']['users']['Row']

type ProfileUpdate = {
  full_name?: string | null
}

export async function GET() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userData.user.id)
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<UserRow>(data)
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || !('full_name' in body)) {
    return jsonError('Invalid profile payload', 400, 'validation')
  }

  const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : null

  const updates: ProfileUpdate = {
    full_name: fullName && fullName.length > 0 ? fullName : null,
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userData.user.id)
    .select()
    .single()

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  return jsonSuccess<UserRow>(data)
}

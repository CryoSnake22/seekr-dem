import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import { backendClient } from '@/lib/api/backend-client'
import type { TrackSkillGapRequest, SkillGapHistoryEntry } from '@/lib/types/backend'

/**
 * POST /api/backend/skills-gap/track
 *
 * Proxy route for tracking skills gap history.
 * Calls the backend /api/v1/skills-gap/track endpoint.
 */
export async function POST(request: NextRequest) {
  // Authenticate user
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  // Get JWT token for backend
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    return jsonError('No session token', 401, 'auth')
  }

  // Parse request body
  let body: TrackSkillGapRequest

  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400, 'validation')
  }

  // Validate required fields
  if (!body.job_role || typeof body.match_score !== 'number') {
    return jsonError('Missing required fields: job_role, match_score', 400, 'validation')
  }

  // Call backend
  const response = await backendClient.post<SkillGapHistoryEntry>(
    '/api/v1/skills-gap/track',
    body,
    token
  )

  if (response.error) {
    return jsonError(
      response.error.message,
      response.error.code?.startsWith('HTTP_')
        ? parseInt(response.error.code.replace('HTTP_', ''))
        : 500
    )
  }

  return jsonSuccess(response.data)
}

/**
 * GET /api/backend/skills-gap/track?role=Software Engineer&limit=10
 *
 * Get skills gap history for a specific role.
 */
export async function GET(request: NextRequest) {
  // Authenticate user
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  // Get JWT token for backend
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    return jsonError('No session token', 401, 'auth')
  }

  // Get query params
  const role = request.nextUrl.searchParams.get('role')
  const limit = request.nextUrl.searchParams.get('limit') || '10'

  // Build query string
  const queryParams = new URLSearchParams()
  if (role) queryParams.set('role', role)
  queryParams.set('limit', limit)

  // Call backend
  const response = await backendClient.get<SkillGapHistoryEntry[]>(
    `/api/v1/skills-gap/history?${queryParams.toString()}`,
    token
  )

  if (response.error) {
    return jsonError(
      response.error.message,
      response.error.code?.startsWith('HTTP_')
        ? parseInt(response.error.code.replace('HTTP_', ''))
        : 500
    )
  }

  return jsonSuccess(response.data)
}

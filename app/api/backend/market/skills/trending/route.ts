import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import { backendClient } from '@/lib/api/backend-client'
import type { TrendingSkillsResponse } from '@/lib/types/backend'

/**
 * GET /api/backend/market/skills/trending?limit=20
 *
 * Proxy route for fetching trending skills.
 * Calls the backend /api/v1/market/skills/trending endpoint.
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
  const limit = request.nextUrl.searchParams.get('limit') || '20'

  // Call backend
  const response = await backendClient.get<TrendingSkillsResponse>(
    `/api/v1/market/skills/trending?limit=${limit}`,
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

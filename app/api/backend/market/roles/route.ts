import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import { backendClient } from '@/lib/api/backend-client'
import type { AvailableRolesResponse } from '@/lib/types/backend'

/**
 * GET /api/backend/market/roles
 *
 * Proxy route for fetching available job roles in the market data.
 * Calls the backend /api/v1/market/roles endpoint.
 */
export async function GET() {
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

  // Call backend
  const response = await backendClient.get<AvailableRolesResponse>(
    '/api/v1/market/roles',
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

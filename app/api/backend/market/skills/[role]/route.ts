import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import { backendClient } from '@/lib/api/backend-client'
import type { RoleSkillsResponse } from '@/lib/types/backend'

/**
 * GET /api/backend/market/skills/[role]
 *
 * Proxy route for fetching market skills for a specific role.
 * Calls the backend /api/v1/market/skills/{role} endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
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

  // Get role from params
  const { role } = await params

  if (!role) {
    return jsonError('Missing role parameter', 400, 'validation')
  }

  // Decode the role (URL encoded)
  const decodedRole = decodeURIComponent(role)

  // Call backend
  const response = await backendClient.get<RoleSkillsResponse>(
    `/api/v1/market/skills/${encodeURIComponent(decodedRole)}`,
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

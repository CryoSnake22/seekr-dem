import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import { backendClient } from '@/lib/api/backend-client'
import type { GitHubSyncResponse } from '@/lib/types/backend'

/**
 * POST /api/backend/github/sync
 *
 * Proxy route for syncing GitHub repositories.
 * Calls the backend /api/v1/github/sync endpoint.
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

  // Parse request body (optional settings)
  let body = {
    analyze_skills: true,
    create_projects: true
  }

  try {
    const requestBody = await request.json()
    body = { ...body, ...requestBody }
  } catch {
    // Use defaults if no body provided
  }

  // Call backend with extended timeout (sync can take a while)
  const response = await backendClient.post<GitHubSyncResponse>(
    '/api/v1/github/sync',
    body,
    token,
    { timeout: 60000 } // 60 seconds for sync operation
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

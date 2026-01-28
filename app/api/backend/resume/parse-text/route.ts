import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import { backendClient } from '@/lib/api/backend-client'
import type { ParsedResume } from '@/lib/types/backend'

/**
 * POST /api/backend/resume/parse-text
 *
 * Proxy route for parsing resume text.
 * Calls the backend /api/v1/resume/parse-text endpoint.
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
  let body: { resume_text: string }

  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid JSON body', 400, 'validation')
  }

  if (!body.resume_text) {
    return jsonError('Missing resume_text field', 400, 'validation')
  }

  // Call backend
  const response = await backendClient.post<ParsedResume>(
    '/api/v1/resume/parse-text',
    body,
    token,
    { timeout: 60000 } // 60 seconds for AI parsing
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

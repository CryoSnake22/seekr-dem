import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonSuccess, jsonError } from '@/lib/api/responses'
import type { ResumeParseResponse } from '@/lib/types/backend'

/**
 * POST /api/backend/resume/upload
 *
 * Proxy route for uploading and parsing resume files.
 * Calls the backend /api/v1/resume/upload endpoint.
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

  // Get form data
  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return jsonError('Invalid form data', 400, 'validation')
  }

  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return jsonError('Missing or invalid file', 400, 'validation')
  }

  // Forward to backend
  const backendFormData = new FormData()
  backendFormData.append('file', file)

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/resume/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: backendFormData,
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }))
      return jsonError(
        error.detail || 'Resume upload failed',
        response.status
      )
    }

    const data: ResumeParseResponse = await response.json()
    return jsonSuccess(data)
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Resume upload failed',
      500
    )
  }
}

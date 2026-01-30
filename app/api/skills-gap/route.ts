import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateMatchScoreForRole } from '@/lib/utils/match-score'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get roles from query params
    const { searchParams } = new URL(request.url)
    const rolesParam = searchParams.get('roles')

    const roles = rolesParam
      ? rolesParam.split(',').map(r => r.trim())
      : ['Software Engineer', 'Frontend Developer', 'Backend Developer']

    // Calculate match scores for all roles in parallel
    const results = await Promise.all(
      roles.map(async (role) => {
        const result = await calculateMatchScoreForRole(
          supabase,
          session.user.id,
          role
        )
        return {
          jobRole: role,
          ...result
        }
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error calculating skills gap:', error)
    return NextResponse.json(
      { error: 'Failed to calculate skills gap' },
      { status: 500 }
    )
  }
}

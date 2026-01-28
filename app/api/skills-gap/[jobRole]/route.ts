import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { calculateMatchScoreForRole } from '@/lib/utils/match-score'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobRole: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobRole = decodeURIComponent(params.jobRole)

    // Calculate match score for the specified role
    const result = await calculateMatchScoreForRole(
      supabase,
      session.user.id,
      jobRole
    )

    return NextResponse.json({
      jobRole,
      ...result
    })
  } catch (error) {
    console.error('Error calculating skills gap:', error)
    return NextResponse.json(
      { error: 'Failed to calculate skills gap' },
      { status: 500 }
    )
  }
}

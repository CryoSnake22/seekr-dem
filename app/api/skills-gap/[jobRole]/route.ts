import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateMatchScoreForRole } from '@/lib/utils/match-score'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobRole: string }> }
) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobRole: jobRoleParam } = await params
    const jobRole = decodeURIComponent(jobRoleParam)

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

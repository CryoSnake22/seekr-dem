import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MarketIntelligenceDashboard } from '@/components/market/MarketIntelligenceDashboard'
import {
  JobRolesResponse,
  MarketSkillsResponse,
  TrendingSkillsResponse,
} from '@/lib/types/market'

async function getMarketData(accessToken: string) {
  const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'

  try {
    // Fetch available roles
    const rolesResponse = await fetch(`${apiUrl}/api/v1/market/roles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    })

    if (!rolesResponse.ok) {
      throw new Error('Failed to fetch roles')
    }

    const rolesData: JobRolesResponse = await rolesResponse.json()

    // Default to first role or Software Engineer
    const defaultRole = rolesData.roles.find(r => r.job_role === 'Software Engineer')?.job_role
      || rolesData.roles[0]?.job_role
      || 'Software Engineer'

    // Fetch skills for default role and trending skills in parallel
    const [skillsResponse, trendingResponse] = await Promise.all([
      fetch(`${apiUrl}/api/v1/market/skills/${encodeURIComponent(defaultRole)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
      fetch(`${apiUrl}/api/v1/market/skills/trending?timeframe=30d&limit=20`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
    ])

    if (!skillsResponse.ok) {
      throw new Error('Failed to fetch skills')
    }

    if (!trendingResponse.ok) {
      throw new Error('Failed to fetch trending skills')
    }

    const skillsData: MarketSkillsResponse = await skillsResponse.json()
    const trendingData: TrendingSkillsResponse = await trendingResponse.json()

    return {
      roles: rolesData.roles,
      skills: skillsData,
      trending: trendingData,
    }
  } catch (error) {
    console.error('Error fetching market data:', error)
    throw error
  }
}

export default async function MarketPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const marketData = await getMarketData(session.access_token)

    return (
      <MarketIntelligenceDashboard
        initialRoles={marketData.roles}
        initialSkillsData={marketData.skills}
        initialTrendingSkills={marketData.trending}
      />
    )
  } catch (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Intelligence</h1>
          <p className="text-neutral-400">Real-time job market data and trends</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load market data</p>
            <p className="text-sm text-neutral-500">
              {error instanceof Error ? error.message : 'An error occurred while fetching market data'}
            </p>
            <p className="text-xs text-neutral-600 mt-4">
              Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

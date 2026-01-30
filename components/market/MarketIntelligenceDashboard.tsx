'use client'

import { useState, useEffect } from 'react'
import { MarketOverviewCards } from './MarketOverviewCards'
import { RoleFilterDropdown } from './RoleFilterDropdown'
import { SkillFrequencyChart } from './SkillFrequencyChart'
import { TrendingSkillsPanel } from './TrendingSkillsPanel'
import {
  JobRoleMarket,
  MarketSkillsResponse,
  TrendingSkillsResponse,
  MarketSkill,
  TrendingSkill,
} from '@/lib/types/market'
import { createClient } from '@/lib/supabase/client'

interface MarketIntelligenceDashboardProps {
  initialRoles: JobRoleMarket[]
  initialSkillsData: MarketSkillsResponse
  initialTrendingSkills: TrendingSkillsResponse
}

export function MarketIntelligenceDashboard({
  initialRoles,
  initialSkillsData,
  initialTrendingSkills,
}: MarketIntelligenceDashboardProps) {
  const [selectedRole, setSelectedRole] = useState(
    initialSkillsData.job_role || initialRoles[0]?.job_role || ''
  )
  const [skillsData, setSkillsData] = useState<MarketSkillsResponse>(initialSkillsData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch skills data when role changes
  useEffect(() => {
    if (!selectedRole || selectedRole === initialSkillsData.job_role) return

    const fetchSkillsForRole = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          throw new Error('Not authenticated')
        }

        // Use backend API URL - default to localhost:8000 for development
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

        const response = await fetch(
          `${apiUrl}/api/v1/market/skills/${encodeURIComponent(selectedRole)}`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.statusText}`)
        }

        const data: MarketSkillsResponse = await response.json()
        setSkillsData(data)
      } catch (err) {
        console.error('Error fetching skills:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch skills')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkillsForRole()
  }, [selectedRole, initialSkillsData.job_role])

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Intelligence</h1>
          <p className="text-neutral-400">
            Real-time job market data and skill frequency analysis
          </p>
        </div>
        <RoleFilterDropdown
          roles={initialRoles}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Overview Cards */}
      <MarketOverviewCards
        skills={skillsData.skills}
        lastUpdated={skillsData.last_updated}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Frequency Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-neutral-500">Loading skills data...</div>
              </div>
            ) : error ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <div className="text-red-400">{error}</div>
                <button
                  onClick={() => handleRoleChange(selectedRole)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <SkillFrequencyChart skills={skillsData.skills} maxSkills={20} />
            )}
          </div>
        </div>

        {/* Trending Skills Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <TrendingSkillsPanel trendingSkills={initialTrendingSkills.trending_skills} />
        </div>
      </div>

      {/* Data Freshness Warning */}
      {skillsData.last_updated && (
        <DataFreshnessWarning lastUpdated={skillsData.last_updated} />
      )}
    </div>
  )
}

// Helper component for data freshness warning
function DataFreshnessWarning({ lastUpdated }: { lastUpdated: string }) {
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysAgo <= 7) return null

  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-orange-400 mt-0.5">⚠️</div>
        <div>
          <p className="text-sm font-medium text-orange-400">
            Data may be outdated
          </p>
          <p className="text-xs text-orange-300/80 mt-1">
            Market data was last updated {daysAgo} days ago. Skills frequencies may have changed.
          </p>
        </div>
      </div>
    </div>
  )
}

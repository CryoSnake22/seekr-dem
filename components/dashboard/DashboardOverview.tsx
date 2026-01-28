'use client'

import { useMemo, useState } from 'react'
import { MatchScoreCard } from '@/components/dashboard/MatchScoreCard'
import { AIAdvisorCard } from '@/components/dashboard/AIAdvisorCard'
import { SkillsGapList } from '@/components/dashboard/SkillsGapList'
import { RecommendedProjects } from '@/components/dashboard/RecommendedProjects'
import { MarketTrends } from '@/components/dashboard/MarketTrends'
import MatchScoreChart from '@/components/dashboard/MatchScoreChart'

type RoleStat = {
  role: string
  coverage: number
}

type GapItem = {
  name: string
  priority: 'High' | 'Medium' | 'Low'
  frequency: string
}

type Recommendation = {
  title: string
  description: string
  boostLabel: string
  tags: string[]
}

type DashboardOverviewProps = {
  roleStats: RoleStat[]
  historyByRole: Record<string, number[]>
  gapsByRole: Record<string, GapItem[]>
  trends: { name: string; value: string; priority: 'High' | 'Medium' | 'Low' }[]
  recommendationsByRole: Record<string, Recommendation[]>
}

export default function DashboardOverview({
  roleStats,
  historyByRole,
  gapsByRole,
  trends,
  recommendationsByRole,
}: DashboardOverviewProps) {
  const roles = useMemo(() => roleStats.map((entry) => entry.role), [roleStats])
  const [selectedRole, setSelectedRole] = useState(roles[0] ?? 'All')

  const selectedCoverage = roleStats.find((entry) => entry.role === selectedRole)?.coverage ?? 0
  const scores = historyByRole[selectedRole] || []
  const deltaLabel = scores[0] !== undefined && scores[1] !== undefined
    ? `${scores[0] >= scores[1] ? '+' : ''}${(scores[0] - scores[1]).toFixed(1)}% since last score`
    : 'No recent history'

  const gaps = selectedRole === 'All'
    ? roles.flatMap((role) => gapsByRole[role] || [])
    : gapsByRole[selectedRole] || []

  const missingSkills = gaps.map((gap) => gap.name).slice(0, 2)

  const recommendations = selectedRole === 'All'
    ? roles.flatMap((role) => recommendationsByRole[role] || [])
    : recommendationsByRole[selectedRole] || []

  const roleLabel = selectedRole === 'All' ? (roleStats[0]?.role || 'Software Engineer') : selectedRole
  const scoreLabel = selectedRole === 'All' ? (roleStats[0]?.coverage ?? 0) : selectedCoverage

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <MatchScoreCard roleLabel={roleLabel} score={scoreLabel} deltaLabel={deltaLabel} />
        <AIAdvisorCard missingSkills={missingSkills} />
      </div>

      <MatchScoreChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkillsGapList
          roles={roles}
          gapsByRole={gapsByRole}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
        <MarketTrends trends={trends} />
      </div>

      <div className="lg:col-span-2">
        <RecommendedProjects recommendations={recommendations} />
      </div>
    </div>
  )
}

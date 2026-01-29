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

type RoleDetail = {
  role: string
  coverage: number
  userSkillCount?: number
  totalMarketSkills?: number
}

type DashboardOverviewProps = {
  roleStats: RoleStat[]
  roleDetails?: RoleDetail[] // Detailed role info from backend
  historyByRole: Record<string, number[]>
  gapsByRole: Record<string, GapItem[]>
  trends: { name: string; value: string; priority: 'High' | 'Medium' | 'Low' }[]
  recommendationsByRole: Record<string, Recommendation[]>
}

export default function DashboardOverview({
  roleStats,
  roleDetails = [],
  historyByRole,
  gapsByRole,
  trends,
  recommendationsByRole,
}: DashboardOverviewProps) {
  const roles = useMemo(() => roleStats.map((entry) => entry.role), [roleStats])
  const [selectedRole, setSelectedRole] = useState(roles[0] ?? 'All')

  // Calculate average match score when "All" is selected
  const averageScore = useMemo(() => {
    if (selectedRole === 'All' && roleStats.length > 0) {
      const sum = roleStats.reduce((acc, stat) => acc + stat.coverage, 0)
      return Math.round((sum / roleStats.length) * 10) / 10 // Round to 1 decimal
    }
    return 0
  }, [selectedRole, roleStats])

  const selectedCoverage = selectedRole === 'All' 
    ? averageScore
    : roleStats.find((entry) => entry.role === selectedRole)?.coverage ?? 0

  // Get current score from history or use calculated score
  // For "All", calculate average across all roles for each history point
  const scores = useMemo(() => {
    if (selectedRole === 'All') {
      // Get all unique dates across all roles
      const allDates = new Set<string>()
      Object.values(historyByRole).forEach(scores => {
        // We need dates, but we only have scores - use index as proxy
        // Actually, we need to reconstruct dates from history
        // For now, let's use the scores array length as a proxy
        // This is a limitation - we'd need dates in historyByRole to do this properly
      })
      // For now, calculate average of latest scores across all roles
      const latestScores = Object.values(historyByRole)
        .map(roleScores => roleScores[0])
        .filter(score => score !== undefined) as number[]
      
      if (latestScores.length > 0) {
        const avg = latestScores.reduce((a, b) => a + b, 0) / latestScores.length
        const previousAvg = Object.values(historyByRole)
          .map(roleScores => roleScores[1])
          .filter(score => score !== undefined) as number[]
        const prevAvg = previousAvg.length > 0 
          ? previousAvg.reduce((a, b) => a + b, 0) / previousAvg.length
          : undefined
        
        return prevAvg !== undefined ? [avg, prevAvg] : [avg]
      }
      return []
    } else {
      return historyByRole[selectedRole] || []
    }
  }, [selectedRole, historyByRole])

  const currentScore = scores[0] ?? selectedCoverage
  const previousScore = scores[1]
  const deltaLabel = currentScore !== undefined && previousScore !== undefined
    ? `${currentScore >= previousScore ? '+' : ''}${(currentScore - previousScore).toFixed(1)}% since last score`
    : 'No recent history'

  const gaps = selectedRole === 'All'
    ? roles.flatMap((role) => gapsByRole[role] || [])
    : gapsByRole[selectedRole] || []

  const missingSkills = gaps.map((gap) => gap.name).slice(0, 2)

  const recommendations = selectedRole === 'All'
    ? roles.flatMap((role) => recommendationsByRole[role] || [])
    : recommendationsByRole[selectedRole] || []

  // Get relevant skills count (user skills that match market data for selected role)
  const relevantSkillsCount = useMemo(() => {
    if (selectedRole === 'All') {
      // For "All", calculate average relevant skills across all roles
      if (roleDetails.length === 0) return 0
      const sum = roleDetails.reduce((acc, detail) => acc + (detail.userSkillCount || 0), 0)
      return Math.round(sum / roleDetails.length)
    } else {
      const detail = roleDetails.find(d => d.role === selectedRole)
      return detail?.userSkillCount || 0
    }
  }, [selectedRole, roleDetails])

  const roleLabel = selectedRole === 'All' ? 'All Roles' : selectedRole
  const scoreLabel = selectedCoverage
  const isAverage = selectedRole === 'All'

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <MatchScoreCard 
          roleLabel={roleLabel} 
          score={scoreLabel} 
          deltaLabel={deltaLabel}
          isAverage={isAverage}
        />
        <AIAdvisorCard missingSkills={missingSkills} />
      </div>

      <MatchScoreChart 
        roles={roles} 
        selectedRole={selectedRole} 
        onRoleChange={setSelectedRole}
        currentScore={currentScore}
        relevantSkillsCount={relevantSkillsCount}
        isAverage={isAverage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkillsGapList
          roles={roles}
          gapsByRole={gapsByRole}
          selectedRole={selectedRole}
        />
        <MarketTrends trends={trends} />
      </div>

      <div className="lg:col-span-2">
        <RecommendedProjects recommendations={recommendations} />
      </div>
    </div>
  )
}

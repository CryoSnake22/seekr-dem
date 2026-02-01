'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { MatchScoreCard } from '@/components/dashboard/MatchScoreCard'
import { useSelectedRoles } from '@/hooks/useSelectedRoles'

// Lazy load chart (above fold, but heavy)
const MatchScoreChart = dynamic(
  () => import('@/components/dashboard/MatchScoreChart'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] rounded-2xl border border-white/10 bg-[#0A0A0A] flex items-center justify-center text-neutral-500 text-sm">
        Loading chart…
      </div>
    ),
  }
)

// Lazy load below-fold components
const AIAdvisorCard = dynamic(
  () => import('@/components/dashboard/AIAdvisorCard').then(mod => ({ default: mod.AIAdvisorCard })),
  {
    loading: () => (
      <div className="h-[200px] rounded-2xl border border-white/10 bg-[#0A0A0A] animate-pulse" />
    ),
  }
)

const SkillsGapList = dynamic(
  () => import('@/components/dashboard/SkillsGapList').then(mod => ({ default: mod.SkillsGapList })),
  {
    loading: () => (
      <div className="h-[300px] rounded-2xl border border-white/10 bg-[#0A0A0A] animate-pulse" />
    ),
  }
)

const MarketTrends = dynamic(
  () => import('@/components/dashboard/MarketTrends').then(mod => ({ default: mod.MarketTrends })),
  {
    loading: () => (
      <div className="h-[300px] rounded-2xl border border-white/10 bg-[#0A0A0A] animate-pulse" />
    ),
  }
)

const RecommendedProjects = dynamic(
  () => import('@/components/dashboard/RecommendedProjects').then(mod => ({ default: mod.RecommendedProjects })),
  {
    loading: () => (
      <div className="h-[400px] rounded-2xl border border-white/10 bg-[#0A0A0A] animate-pulse" />
    ),
  }
)

// Only load dialog when needed
const RoleManagementDialog = dynamic(
  () => import('@/components/dashboard/RoleManagementDialog').then(mod => ({ default: mod.RoleManagementDialog })),
  {
    ssr: false,
  }
)

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
  historyByRole: Record<string, Array<{ date: string; score: number }>>
  gapsByRole: Record<string, GapItem[]>
  trends: { name: string; value: string; priority: 'High' | 'Medium' | 'Low' }[]
  marketDataLastUpdated?: Date | null
  recommendationsByRole: Record<string, Recommendation[]>
  currentMatchScore?: number
  skillsCount?: number
  projectsCount?: number
  daysActive?: number
}

export default function DashboardOverview({
  roleStats,
  roleDetails = [],
  historyByRole,
  gapsByRole,
  trends,
  marketDataLastUpdated,
  recommendationsByRole,
  currentMatchScore,
  skillsCount,
  projectsCount,
  daysActive,
}: DashboardOverviewProps) {
  const roles = useMemo(() => roleStats.map((entry) => entry.role), [roleStats])
  const [selectedRole, setSelectedRole] = useState(roles[0] ?? 'All')
  const [manageRolesOpen, setManageRolesOpen] = useState(false)
  const { saveRoles, isSaving, error: saveError } = useSelectedRoles()

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
      // Calculate average of latest scores across all roles
      const latestScores = Object.values(historyByRole)
        .map(roleScores => roleScores.length > 0 ? roleScores[roleScores.length - 1].score : undefined)
        .filter(score => score !== undefined) as number[]

      if (latestScores.length > 0) {
        const avg = latestScores.reduce((a, b) => a + b, 0) / latestScores.length
        const previousScores = Object.values(historyByRole)
          .map(roleScores => roleScores.length > 1 ? roleScores[roleScores.length - 2].score : undefined)
          .filter(score => score !== undefined) as number[]
        const prevAvg = previousScores.length > 0
          ? previousScores.reduce((a, b) => a + b, 0) / previousScores.length
          : undefined

        return prevAvg !== undefined ? [avg, prevAvg] : [avg]
      }
      return []
    } else {
      const roleHistory = historyByRole[selectedRole] || []
      if (roleHistory.length === 0) return []
      const latest = roleHistory[roleHistory.length - 1].score
      const previous = roleHistory.length > 1 ? roleHistory[roleHistory.length - 2].score : undefined
      return previous !== undefined ? [latest, previous] : [latest]
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
        roleStats={roleStats}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        onManageRoles={() => setManageRolesOpen(true)}
        currentScore={currentScore}
        relevantSkillsCount={relevantSkillsCount}
        isAverage={isAverage}
        historyData={{
          currentMatchScore: currentMatchScore || 0,
          history: historyByRole,
          skillsCount: skillsCount || 0,
          projectsCount: projectsCount || 0,
          daysActive: daysActive || 0,
        }}
      />

      {manageRolesOpen && (
        <RoleManagementDialog
          open={manageRolesOpen}
          onOpenChange={setManageRolesOpen}
          trackedRoles={roles}
          onSave={saveRoles}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkillsGapList
          roles={roles}
          gapsByRole={gapsByRole}
          selectedRole={selectedRole}
        />
        <MarketTrends trends={trends} lastUpdated={marketDataLastUpdated} />
      </div>

      <div className="lg:col-span-2">
        <RecommendedProjects recommendations={recommendations} />
      </div>
    </div>
  )
}

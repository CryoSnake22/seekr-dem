'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { RoleSelector } from '@/components/dashboard/RoleSelector'

interface HistoryPoint {
  date: string
  score: number
}

interface ProgressData {
  currentMatchScore: number
  history: Record<string, HistoryPoint[]>
  skillsCount: number
  projectsCount: number
  daysActive: number
}

type RoleStat = { role: string; coverage: number }

type MatchScoreChartProps = {
  roles: string[]
  roleStats?: RoleStat[]
  selectedRole: string
  onRoleChange: (role: string) => void
  onManageRoles?: () => void
  currentScore?: number
  relevantSkillsCount?: number
  isAverage?: boolean
}

const ROLE_COLORS: Record<string, string> = {
  'Software Engineer': '#8B5CF6',
  'Frontend Developer': '#10B981',
  'Backend Developer': '#F59E0B',
  'Full Stack Developer': '#EC4899',
  'DevOps Engineer': '#3B82F6',
  'Data Engineer': '#EF4444',
  'Mobile Developer': '#14B8A6',
}

const FALLBACK_PALETTE = ['#6366F1', '#A855F7', '#14B8A6', '#F97316', '#E11D48', '#0EA5E9', '#84CC16', '#EC4899']

function getRoleColor(role: string, index: number): string {
  return ROLE_COLORS[role] ?? FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]
}

const MILESTONES = [
  { value: 60, label: '60% - Entry Level', color: '#6B7280' },
  { value: 75, label: '75% - Competitive', color: '#10B981' },
  { value: 85, label: '85% - Strong', color: '#F59E0B' },
  { value: 95, label: '95% - Excellent', color: '#8B5CF6' },
]

export default function MatchScoreChart({ 
  roles, 
  roleStats = [],
  selectedRole, 
  onRoleChange,
  onManageRoles,
  currentScore,
  relevantSkillsCount,
  isAverage = false
}: MatchScoreChartProps) {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch('/api/progress', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Failed to fetch progress data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load progress')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-400">Loading progress data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-400">{error || 'No progress data available'}</p>
        </div>
      </div>
    )
  }

  // Merge all role histories into a single dataset (latest score per date)
  const roleSeries = Object.entries(data.history).reduce<Record<string, Map<string, number>>>(
    (acc, [role, points]) => {
      const byDate = new Map<string, number>()
      points.forEach((point) => {
        byDate.set(point.date, point.score)
      })
      acc[role] = byDate
      return acc
    },
    {}
  )

  // Use same role set as parent so "All" average matches card
  const visibleRoles = selectedRole === 'All' ? roles : [selectedRole]
  const coverageByRole = Object.fromEntries(roleStats.map((s) => [s.role, s.coverage]))

  // Find the earliest date across visible roles that have history
  const allDates = new Set<string>()
  visibleRoles.forEach((role) => {
    const points = roleSeries[role]
    if (points) points.forEach((_value, date) => allDates.add(date))
  })

  // For roles with no history, add today so we have one point (keeps "All" in sync with card)
  const today = new Date().toISOString().slice(0, 10)
  visibleRoles.forEach((role) => {
    if (!roleSeries[role] || roleSeries[role].size === 0) allDates.add(today)
  })

  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  const earliestDate = sortedDates[0]
  const baselineDate = earliestDate
    ? (() => {
        const d = new Date(earliestDate)
        d.setDate(d.getDate() - 1)
        return d.toISOString().slice(0, 10)
      })()
    : null

  const chartDataMap = new Map<string, Record<string, string | number>>()

  if (baselineDate) {
    const baselinePoint: Record<string, string | number> = { date: baselineDate }
    visibleRoles.forEach((role) => {
      baselinePoint[role] = 0
    })
    chartDataMap.set(baselineDate, baselinePoint)
  }

  sortedDates.forEach((date) => {
    const dataPoint: Record<string, string | number> = { date }
    visibleRoles.forEach((role) => {
      const score = roleSeries[role]?.get(date)
      const hasHistory = roleSeries[role] && roleSeries[role].size > 0
      if (score !== undefined) {
        dataPoint[role] = score
      } else if (date === today && coverageByRole[role] !== undefined) {
        dataPoint[role] = coverageByRole[role]
      } else if (!hasHistory) {
        // Roles with no history: give a value at every date so their line renders (0 until today, then coverage)
        const coverage = coverageByRole[role]
        dataPoint[role] = date >= today && coverage !== undefined ? coverage : 0
      }
    })
    chartDataMap.set(date, dataPoint)
  })

  // Convert to array and sort by date
  const chartData = Array.from(chartDataMap.values()).sort(
    (a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime()
  )

  if (chartData.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Match Score Progress</h2>
          <p className="text-sm text-neutral-400">
            Your progress will appear here as you add skills and update your profile
          </p>
        </div>
        <div className="mt-6 h-64 flex items-center justify-center border border-white/5 rounded-lg">
          <p className="text-neutral-500 text-sm">No history data yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Match Score Progress</h2>
          <p className="text-sm text-neutral-400">
            Track your skill development over time
          </p>
        </div>
        {onManageRoles ? (
          <RoleSelector
            roles={roles}
            selectedRole={selectedRole}
            onRoleChange={onRoleChange}
            onManageRoles={onManageRoles}
          />
        ) : (
          <select
            value={selectedRole}
            onChange={(event) => onRoleChange(event.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white"
          >
            <option value="All">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-white/5 bg-white/5 p-4">
          <p className="text-xs text-neutral-400">{isAverage ? 'Average Score' : 'Current Score'}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {(() => {
              const raw = currentScore !== undefined ? currentScore : (data?.currentMatchScore ?? 0)
              const num = typeof raw === 'number' ? raw : Number(raw) || 0
              return `${num.toFixed(1)}%`
            })()}
          </p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-4">
          <p className="text-xs text-neutral-400">Relevant Skills</p>
          <p className="text-2xl font-bold text-white mt-1">
            {relevantSkillsCount !== undefined ? relevantSkillsCount : (data?.skillsCount ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-4">
          <p className="text-xs text-neutral-400">Projects</p>
          <p className="text-2xl font-bold text-white mt-1">{data.projectsCount}</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-4">
          <p className="text-xs text-neutral-400">Days Active</p>
          <p className="text-2xl font-bold text-white mt-1">{data.daysActive}</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => dateFormatter.format(new Date(value))}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
              label={{ value: 'Match Score (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              labelFormatter={(value) => dateFormatter.format(new Date(value))}
              formatter={(value: number, name: string) => [`${Number(value).toFixed(1)}%`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF', width: '100%', whiteSpace: 'normal' }}
              formatter={(value) => <span className="inline-block mr-4 mb-1">{value}</span>}
            />
            {MILESTONES.map((milestone) => (
              <ReferenceLine
                key={milestone.value}
                y={milestone.value}
                stroke={milestone.color}
                strokeDasharray="3 3"
                strokeOpacity={0.3}
              />
            ))}
            {visibleRoles.map((role, index) => (
              <Line
                key={role}
                type="monotone"
                dataKey={role}
                stroke={getRoleColor(role, index)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        {MILESTONES.map((milestone) => (
          <div key={milestone.value} className="flex items-center gap-2">
            <div
              className="w-3 h-0.5"
              style={{ backgroundColor: milestone.color, opacity: 0.6 }}
            />
            <span className="text-neutral-400">{milestone.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

type GapItem = {
  skill: string
  priority: 'High' | 'Medium' | 'Low'
  demand: string
}

type TopGapsSectionProps = {
  roles: string[]
  gapsByRole: Record<string, GapItem[]>
}

const priorityOrder = {
  High: 0,
  Medium: 1,
  Low: 2,
}

export default function TopGapsSection({ roles, gapsByRole }: TopGapsSectionProps) {
  const [selectedRole, setSelectedRole] = useState(roles[0] ?? 'All')
  const [showAll, setShowAll] = useState(false)

  const gapList = useMemo(() => {
    if (selectedRole === 'All') {
      const merged = roles.flatMap((role) => gapsByRole[role] || [])
      const unique = merged.reduce<GapItem[]>((acc, item) => {
        const exists = acc.some((entry) => entry.skill.toLowerCase() === item.skill.toLowerCase())
        return exists ? acc : [...acc, item]
      }, [])
      return unique.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    }

    return gapsByRole[selectedRole] || []
  }, [gapsByRole, roles, selectedRole])

  const visibleGaps = showAll ? gapList : gapList.slice(0, 4)

  return (
    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Top skill gaps</h2>
          <p className="text-sm text-neutral-400">Based on market demand for your selected roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <option value="All">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs text-neutral-400 hover:text-white"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {visibleGaps.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-6 text-sm text-neutral-400">
            No gaps detected for this role yet.
          </div>
        )}
        {visibleGaps.map((gap) => (
          <div key={gap.skill} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
            <div>
              <p className="text-white font-medium">{gap.skill}</p>
              <p className="text-xs text-neutral-500">{gap.demand}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-neutral-300">
              {gap.priority} priority
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import React, { useMemo, useState } from 'react';

type SkillGap = {
  name: string
  priority: 'High' | 'Medium' | 'Low'
  frequency: string
}

type SkillsGapListProps = {
  roles: string[]
  gapsByRole: Record<string, SkillGap[]>
  selectedRole: string
  onRoleChange: (role: string) => void
}

const priorityStyles = {
  High: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
}

const priorityOrder = {
  High: 0,
  Medium: 1,
  Low: 2,
}

export const SkillsGapList: React.FC<SkillsGapListProps> = ({ roles, gapsByRole, selectedRole, onRoleChange }) => {
  const [showAll, setShowAll] = useState(false)

  const gapList = useMemo(() => {
    if (selectedRole === 'All') {
      const merged = roles.flatMap((role) => gapsByRole[role] || [])
      const unique = merged.reduce<SkillGap[]>((acc, item) => {
        const exists = acc.some((entry) => entry.name.toLowerCase() === item.name.toLowerCase())
        return exists ? acc : [...acc, item]
      }, [])
      return unique.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    }

    return gapsByRole[selectedRole] || []
  }, [gapsByRole, roles, selectedRole])

  const visibleGaps = showAll ? gapList : gapList.slice(0, 3)

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold">Critical Skill Gaps</h3>
        <div className="flex items-center gap-3">
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
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs text-neutral-400 hover:text-white"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visibleGaps.length === 0 && (
          <div className="p-4 bg-[#0A0A0A] border border-white/5 rounded-xl text-sm text-neutral-400">
            Add skills to see your highest-impact gaps.
          </div>
        )}
        {visibleGaps.map((skill, i) => {
          const style = priorityStyles[skill.priority]
          return (
            <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-white/20 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${style.color.replace('text', 'bg')}`} />
                <div>
                  <div className="font-medium text-white group-hover:text-primary transition-colors">{skill.name}</div>
                  <div className="text-xs text-neutral-500">Appears in {skill.frequency}</div>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded text-xs font-medium border ${style.bg} ${style.border} ${style.color}`}>
                {skill.priority} Priority
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

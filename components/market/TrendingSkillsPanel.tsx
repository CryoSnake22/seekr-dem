'use client'

import { TrendingSkill } from '@/lib/types/market'
import { TrendingUp, ArrowUpRight } from '@/components/ui/Icon'

interface TrendingSkillsPanelProps {
  trendingSkills: TrendingSkill[]
  onSkillClick?: (skill: TrendingSkill) => void
}

export function TrendingSkillsPanel({
  trendingSkills,
  onSkillClick,
}: TrendingSkillsPanelProps) {
  const getPriorityBadge = (growthRate: number) => {
    if (growthRate >= 7) {
      return { label: 'High', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
    } else if (growthRate >= 4) {
      return { label: 'Medium', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' }
    } else {
      return { label: 'Low', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
    }
  }

  if (trendingSkills.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Trending Skills</h3>
        </div>
        <div className="text-center py-8 text-neutral-500">
          No trending skills data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-white">Trending Skills</h3>
      </div>

      <div className="space-y-3">
        {trendingSkills.slice(0, 10).map((skill, index) => {
          const priority = getPriorityBadge(skill.growth_rate)
          const isClickable = !!onSkillClick

          return (
            <div
              key={index}
              onClick={() => onSkillClick?.(skill)}
              className={`group p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all ${
                isClickable ? 'cursor-pointer hover:bg-white/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {skill.skill_name}
                    </span>
                    {isClickable && (
                      <ArrowUpRight className="w-3 h-3 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{skill.current_frequency.toFixed(1)}% frequency</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-emerald-400 font-mono">
                      ↑ {skill.growth_rate.toFixed(1)}%
                    </span>
                  </div>
                  {skill.trending_in_roles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {skill.trending_in_roles.slice(0, 3).map((role, roleIndex) => (
                        <span
                          key={roleIndex}
                          className="text-xs px-2 py-0.5 bg-white/5 rounded text-neutral-400 truncate max-w-[120px]"
                          title={role}
                        >
                          {role}
                        </span>
                      ))}
                      {skill.trending_in_roles.length > 3 && (
                        <span className="text-xs px-2 py-0.5 text-neutral-500">
                          +{skill.trending_in_roles.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium border ${priority.color}`}
                >
                  {priority.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {trendingSkills.length > 10 && (
        <div className="mt-4 text-center text-sm text-neutral-500">
          Showing top 10 of {trendingSkills.length} trending skills
        </div>
      )}
    </div>
  )
}

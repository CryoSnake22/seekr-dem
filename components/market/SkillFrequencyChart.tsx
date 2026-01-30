'use client'

import { useMemo } from 'react'
import { BarChart, BarChartDataPoint } from '@/components/charts/BarChart'
import { MarketSkill } from '@/lib/types/market'

interface SkillFrequencyChartProps {
  skills: MarketSkill[]
  maxSkills?: number
  onSkillClick?: (skill: MarketSkill) => void
}

export function SkillFrequencyChart({
  skills,
  maxSkills = 20,
  onSkillClick,
}: SkillFrequencyChartProps) {
  const chartData: BarChartDataPoint[] = useMemo(() => {
    return skills.slice(0, maxSkills).map(skill => ({
      label: skill.skill_name,
      value: skill.frequency_percentage,
      metadata: {
        priority_level: skill.priority_level,
        frequency_count: skill.frequency_count,
      },
    }))
  }, [skills, maxSkills])

  const handleBarClick = (point: BarChartDataPoint) => {
    if (onSkillClick) {
      const skill = skills.find(s => s.skill_name === point.label)
      if (skill) {
        onSkillClick(skill)
      }
    }
  }

  const tooltipFormatter = (point: BarChartDataPoint) => {
    const priorityLabel = point.metadata?.priority_level || 'medium'
    const count = point.metadata?.frequency_count || 0
    return `${point.label}: ${point.value.toFixed(1)}% (${count.toLocaleString()} jobs) • ${priorityLabel.toUpperCase()}`
  }

  if (skills.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-neutral-500">
        No skill data available for this role
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Top Skills by Frequency</h3>
          <p className="text-sm text-neutral-400">
            Showing top {Math.min(maxSkills, skills.length)} of {skills.length} skills
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>Critical (75%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>High (50-75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>Medium (25-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-500" />
            <span>Low (&lt;25%)</span>
          </div>
        </div>
      </div>

      <BarChart
        data={chartData}
        orientation="horizontal"
        height={Math.max(400, chartData.length * 35)}
        xAxisFormatter={(v) => `${v.toFixed(0)}%`}
        tooltipFormatter={tooltipFormatter}
        barGradient={true}
        showGrid={true}
        showValues={true}
        maxValue={100}
        onClick={onSkillClick ? handleBarClick : undefined}
      />
    </div>
  )
}

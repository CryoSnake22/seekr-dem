import { MarketSkill } from '@/lib/types/market'
import { TrendingUp, Database, CheckCircle2, BarChart3 } from '@/components/ui/Icon'

interface MarketOverviewCardsProps {
  skills: MarketSkill[]
  lastUpdated?: string | null
}

export function MarketOverviewCards({ skills, lastUpdated }: MarketOverviewCardsProps) {
  const totalSkills = skills.length
  const mostInDemandSkill = skills[0]
  const avgFrequency = skills.length > 0
    ? skills.reduce((sum, s) => sum + s.frequency_percentage, 0) / skills.length
    : 0

  const formatLastUpdated = (dateString?: string | null) => {
    if (!dateString) return 'Unknown'

    try {
      const date = new Date(dateString)
      const now = new Date()
      const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

      if (daysAgo === 0) return 'Today'
      if (daysAgo === 1) return 'Yesterday'
      if (daysAgo < 7) return `${daysAgo} days ago`

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Unknown'
    }
  }

  const cards = [
    {
      icon: Database,
      label: 'Total Skills Tracked',
      value: totalSkills.toLocaleString(),
      description: 'Across job market',
      color: 'text-blue-400',
    },
    {
      icon: CheckCircle2,
      label: 'Most In-Demand',
      value: mostInDemandSkill?.skill_name || 'N/A',
      description: mostInDemandSkill
        ? `${mostInDemandSkill.frequency_percentage.toFixed(1)}% of jobs`
        : 'No data',
      color: 'text-emerald-400',
    },
    {
      icon: TrendingUp,
      label: 'Average Frequency',
      value: `${avgFrequency.toFixed(1)}%`,
      description: 'Mean across all skills',
      color: 'text-purple-400',
    },
    {
      icon: BarChart3,
      label: 'Last Updated',
      value: formatLastUpdated(lastUpdated),
      description: 'Data freshness',
      color: 'text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-neutral-400">{card.label}</p>
              <p className="text-2xl font-bold text-white truncate" title={card.value}>
                {card.value}
              </p>
              <p className="text-xs text-neutral-500">{card.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

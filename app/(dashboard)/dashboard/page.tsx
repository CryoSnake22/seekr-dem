import { MatchScoreCard } from '@/components/dashboard/MatchScoreCard'
import { AIAdvisorCard } from '@/components/dashboard/AIAdvisorCard'
import { SkillsGapList } from '@/components/dashboard/SkillsGapList'
import { RecommendedProjects } from '@/components/dashboard/RecommendedProjects'
import { MarketTrends } from '@/components/dashboard/MarketTrends'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome / Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <MatchScoreCard />
        <AIAdvisorCard />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkillsGapList />
        <MarketTrends />
      </div>

      {/* Recommended Projects */}
      <div className="lg:col-span-2">
        <RecommendedProjects />
      </div>
    </div>
  )
}

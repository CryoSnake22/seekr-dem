import DashboardOverview from '@/components/dashboard/DashboardOverview'
import { createClient } from '@/lib/supabase/server'
import { calculateMatchScore, getMissingSkills, type MarketSkill, type UserSkill } from '@/lib/utils/match-score'

type MarketSkillWithRole = {
  job_role: string
  skill_name: string
  priority_level: 'High' | 'Medium' | 'Low' | null
  frequency_percentage: number
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return (
      <div className="space-y-8">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Please sign in to view your dashboard.
        </div>
      </div>
    )
  }

  const userId = userData.user.id

  const [skillsRes, marketRes, historyRes, trendsRes] = await Promise.all([
    supabase.from('user_skills').select('skill_name, proficiency').eq('user_id', userId),
    supabase
      .from('skills_market_data')
      .select('job_role, skill_name, priority_level, frequency_percentage')
      .order('frequency_percentage', { ascending: false })
      .limit(200),
    supabase
      .from('match_score_history')
      .select('job_role, match_score, recorded_at')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(20),
    supabase
      .from('skills_market_data')
      .select('skill_name, priority_level, frequency_percentage')
      .order('frequency_percentage', { ascending: false })
      .limit(4),
  ])

  const userSkills: UserSkill[] = (skillsRes.data || []).map(skill => ({
    name: skill.skill_name,
    proficiency_level: skill.proficiency || undefined
  }))
  const marketSkills = (marketRes.data || []) as MarketSkillWithRole[]

  const roleMap = marketSkills.reduce<Record<string, MarketSkill[]>>((acc, item) => {
    const marketSkill: MarketSkill = {
      skill_name: item.skill_name,
      frequency_percentage: item.frequency_percentage
    }
    if (!acc[item.job_role]) {
      return { ...acc, [item.job_role]: [marketSkill] }
    }
    return { ...acc, [item.job_role]: [...acc[item.job_role], marketSkill] }
  }, {})

  const roleStats = Object.entries(roleMap)
    .map(([role, skills]) => {
      const coverage = calculateMatchScore(userSkills, skills)
      return { role, coverage }
    })
    .sort((a, b) => b.coverage - a.coverage)

  const historyByRole = (historyRes.data || []).reduce<Record<string, number[]>>((acc, record) => {
    const nextScores = acc[record.job_role] ? [...acc[record.job_role], record.match_score] : [record.match_score]
    return { ...acc, [record.job_role]: nextScores }
  }, {})

  const gapsByRole = roleStats.reduce<Record<string, { name: string; priority: 'High' | 'Medium' | 'Low'; frequency: string }[]>>(
    (acc, entry) => {
      const roleMarketSkills = roleMap[entry.role] || []
      const missing = getMissingSkills(userSkills, roleMarketSkills)

      const roleGaps = missing.map((gap) => ({
        name: gap.name,
        priority: gap.priority,
        frequency: `${gap.frequency.toFixed(0)}% of roles`,
      }))

      return { ...acc, [entry.role]: roleGaps }
    },
    {}
  )

  const recommendationsByRole = roleStats.reduce<Record<string, { title: string; description: string; boostLabel: string; tags: string[] }[]>>(
    (acc, entry) => {
      const roleGaps = gapsByRole[entry.role] || []
      const recommendations = roleGaps.slice(0, 3).map((gap) => ({
        title: `${gap.name} Showcase`,
        description: `Build a project highlighting ${gap.name} depth and real-world impact.`,
        boostLabel: gap.priority === 'High' ? '+15% Score' : gap.priority === 'Medium' ? '+8% Score' : '+4% Score',
        tags: [gap.name],
      }))
      return { ...acc, [entry.role]: recommendations }
    },
    {}
  )

  const trends = (trendsRes.data || []).map((trend) => ({
    name: trend.skill_name,
    value: `${trend.frequency_percentage.toFixed(0)}%`,
    priority: (trend.priority_level || 'Low') as 'High' | 'Medium' | 'Low',
  }))

  return (
    <DashboardOverview
      roleStats={roleStats}
      historyByRole={historyByRole}
      gapsByRole={gapsByRole}
      trends={trends}
      recommendationsByRole={recommendationsByRole}
    />
  )
}

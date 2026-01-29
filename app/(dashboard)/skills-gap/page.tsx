import { createClient } from '@/lib/supabase/server'
import TopGapsSection from '@/components/skills-gap/TopGapsSection'

type RoleStats = {
  title: string
  coverage: number
  delta: string
}

type Gap = {
  skill: string
  priority: 'High' | 'Medium' | 'Low'
  demand: string
}

export default async function SkillsGapPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills Gap Analysis</h1>
          <p className="text-neutral-400">Identify missing skills for your target role</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Please sign in to view your skills gap.
        </div>
      </div>
    )
  }

  const userId = userData.user.id

  // Get backend URL from environment
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
  
  // Get session token for backend API
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills Gap Analysis</h1>
          <p className="text-neutral-400">Identify missing skills for your target role</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Unable to authenticate. Please sign in again.
        </div>
      </div>
    )
  }

  // Fetch skills gap analysis directly from backend API
  const skillsGapRes = await fetch(
    `${backendUrl}/api/v1/skills-gap?roles=${encodeURIComponent("Software Engineer,Frontend Developer,Backend Developer,Full Stack Developer,DevOps Engineer,Data Engineer,Mobile Developer")}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  ).then(async (res) => {
    if (!res.ok) {
      console.error('Backend API error:', res.status, await res.text())
      return null
    }
    return res.json()
  })

  // Get top 3 roles by match score
  let roleStatsList: Array<{ title: string; coverage: number }> = []
  let gapsByRole: Record<string, Gap[]> = {}

  if (skillsGapRes && skillsGapRes.results) {
    roleStatsList = skillsGapRes.results
      .map((result: any) => ({
        title: result.job_role,
        coverage: result.match_score,
      }))
      .sort((a, b) => b.coverage - a.coverage)
      .slice(0, 3)

    // Build gapsByRole from backend response
    skillsGapRes.results.forEach((result: any) => {
      gapsByRole[result.job_role] = (result.missing_skills || []).map((skill: any) => ({
        skill: skill.skill_name,
        priority: skill.priority as 'High' | 'Medium' | 'Low',
        demand: `${skill.frequency_percentage.toFixed(0)}% of roles`,
      }))
    })
  }

  const roles = roleStatsList.map((role) => role.title)

  // Fetch history for delta calculation
  const historyRes = roles.length
    ? await supabase
        .from('match_score_history')
        .select('job_role, match_score, recorded_at')
        .eq('user_id', userId)
        .in('job_role', roles)
        .order('recorded_at', { ascending: false })
    : { data: [] }

  const historyMap = (historyRes.data || []).reduce<Record<string, number[]>>((acc, record) => {
    const nextScores = acc[record.job_role] ? [...acc[record.job_role], record.match_score] : [record.match_score]
    return { ...acc, [record.job_role]: nextScores }
  }, {})

  const targetRoles: RoleStats[] = roleStatsList.map((role) => {
    const scores = historyMap[role.title] || []
    const latest = scores[0]
    const previous = scores[1]
    const delta = latest !== undefined && previous !== undefined
      ? `${latest >= previous ? '+' : ''}${(latest - previous).toFixed(1)}% since last score`
      : 'No recent history'

    return { ...role, delta }
  })

  const gaps = gapsByRole[roles[0]] || []
  const primaryGap = gaps[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skills Gap Analysis</h1>
        <p className="text-neutral-400">Identify missing skills for your target role</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {targetRoles.length === 0 && (
          <div className="lg:col-span-3 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-sm text-neutral-400">
            Add skills to see role coverage and market gaps.
          </div>
        )}
        {targetRoles.map((role) => (
          <div key={role.title} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-neutral-400">Target role</p>
            <h2 className="text-lg font-semibold text-white mt-2">{role.title}</h2>
            <div className="mt-4">
              <p className="text-3xl font-bold text-primary">{role.coverage}%</p>
              <p className="text-xs text-emerald-300 mt-1">{role.delta}</p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/5">
              <div className="h-2 rounded-full bg-gradient-to-r from-primary to-emerald-500" style={{ width: `${role.coverage}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TopGapsSection roles={roles} gapsByRole={gapsByRole} />

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Next best move</h2>
            <p className="text-sm text-neutral-400">Suggested based on current gaps.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <p className="text-sm text-neutral-400">Focus area</p>
            <p className="text-lg font-semibold text-white mt-1">{primaryGap?.skill || 'Add skills to get suggestions'}</p>
            <p className="text-xs text-neutral-500 mt-2">
              {primaryGap
                ? `Build projects that demonstrate ${primaryGap.skill} at a ${primaryGap.priority.toLowerCase()} priority.`
                : 'Complete your profile to unlock next steps.'}
            </p>
          </div>
          <button className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200">
            Generate project plan
          </button>
        </div>
      </div>
    </div>
  )
}

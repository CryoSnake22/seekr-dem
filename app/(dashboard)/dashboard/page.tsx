import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <div className="space-y-8">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Please sign in to view your dashboard.
        </div>
      </div>
    );
  }

  // Get backend URL from environment
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";

  // Get session token for backend API
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    return (
      <div className="space-y-8">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Unable to authenticate. Please sign in again.
        </div>
      </div>
    );
  }

  const defaultRoles =
    "Software Engineer,Frontend Developer,Backend Developer,Full Stack Developer,DevOps Engineer,Data Engineer,Mobile Developer";

  // User's tracked roles from DB (used for skills-gap and dashboard)
  const { data: trackedRows } = await supabase
    .from("user_tracked_roles")
    .select("job_role")
    .eq("user_id", userData.user.id)
    .order("job_role");
  const trackedList = trackedRows ?? [];
  const rolesParam =
    trackedList.length > 0
      ? trackedList.map((r) => r.job_role).join(",")
      : defaultRoles;

  // Fetch data from backend API and Supabase
  const [skillsGapRes, historyRes, trendsRes, skillsCountRes, projectsCountRes] = await Promise.all([
    // Get skills gap analysis for user's tracked roles
    fetch(
      `${backendUrl}/api/v1/skills-gap?roles=${encodeURIComponent(rolesParam)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
      },
    ).then(async (res) => {
      if (!res.ok) {
        console.error("Backend API error:", res.status, await res.text());
        return null;
      }
      return res.json();
    }),
    // Fetch history from Supabase (for chart)
    supabase
      .from("match_score_history")
      .select("job_role, match_score, recorded_at")
      .eq("user_id", userData.user.id)
      .order("recorded_at", { ascending: true }),
    // Fetch trending skills for display
    supabase
      .from("skills_market_data")
      .select("skill_name, priority_level, frequency_percentage")
      .order("frequency_percentage", { ascending: false })
      .limit(4),
    // Fetch user skills count
    supabase
      .from("user_skills")
      .select("id", { count: "exact" })
      .eq("user_id", userData.user.id),
    // Fetch projects count
    supabase
      .from("projects")
      .select("id", { count: "exact" })
      .eq("user_id", userData.user.id),
  ]);

  // Handle backend API response
  let roleStats: Array<{ role: string; coverage: number }> = [];
  let roleDetails: Array<{
    role: string;
    coverage: number;
    userSkillCount: number;
    totalMarketSkills: number;
  }> = [];
  let gapsByRole: Record<
    string,
    { name: string; priority: "High" | "Medium" | "Low"; frequency: string }[]
  > = {};

  if (skillsGapRes && skillsGapRes.results) {
    // Transform backend response to match DashboardOverview props
    roleStats = skillsGapRes.results
      .map((result: any) => ({
        role: result.job_role,
        coverage: result.match_score,
      }))
      .sort((a: { coverage: number }, b: { coverage: number }) => b.coverage - a.coverage);

    // Build roleDetails with user skill counts (relevant skills)
    roleDetails = skillsGapRes.results.map((result: any) => ({
      role: result.job_role,
      coverage: result.match_score,
      userSkillCount: result.user_skill_count || 0,
      totalMarketSkills: result.total_market_skills || 0,
    }));

    // Build gapsByRole from backend response
    skillsGapRes.results.forEach((result: any) => {
      gapsByRole[result.job_role] = (result.missing_skills || []).map(
        (skill: any) => ({
          name: skill.skill_name,
          priority: skill.priority as "High" | "Medium" | "Low",
          frequency: `${skill.frequency_percentage.toFixed(0)}% of roles`,
        }),
      );
    });
  } else {
    // Fallback: if backend is unavailable, show empty state
    console.warn("Backend API unavailable, showing empty dashboard");
  }

  // Format history data for chart (like /api/progress endpoint)
  const historyByRole = (historyRes.data || []).reduce<
    Record<string, Array<{ date: string; score: number }>>
  >((acc, record) => {
    const recordedAt = new Date(record.recorded_at);
    const dateKey = recordedAt.toISOString().slice(0, 10);
    const score = Number(record.match_score);
    if (!acc[record.job_role]) {
      acc[record.job_role] = [];
    }
    acc[record.job_role].push({
      date: dateKey,
      score,
    });
    return acc;
  }, {});

  // Calculate days active (from first recorded activity)
  const firstActivity =
    historyRes.data && historyRes.data.length > 0
      ? new Date(historyRes.data[0].recorded_at)
      : new Date();
  const daysActive = Math.floor(
    (Date.now() - firstActivity.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Get current match score (highest among all roles)
  const latestScores: Record<string, number> = {};
  for (const role in historyByRole) {
    const scores = historyByRole[role];
    if (scores.length > 0) {
      latestScores[role] = scores[scores.length - 1].score;
    }
  }
  const currentMatchScore =
    Object.values(latestScores).length > 0
      ? Math.max(...Object.values(latestScores))
      : 0;

  // Get counts
  const skillsCount = skillsCountRes.count || 0;
  const projectsCount = projectsCountRes.count || 0;

  // Build recommendations from gaps
  const recommendationsByRole = roleStats.reduce<
    Record<
      string,
      {
        title: string;
        description: string;
        boostLabel: string;
        tags: string[];
      }[]
    >
  >((acc, entry) => {
    const roleGaps = gapsByRole[entry.role] || [];
    const recommendations = roleGaps.slice(0, 3).map((gap) => ({
      title: `${gap.name} Showcase`,
      description: `Build a project highlighting ${gap.name} depth and real-world impact.`,
      boostLabel:
        gap.priority === "High"
          ? "+15% Score"
          : gap.priority === "Medium"
            ? "+8% Score"
            : "+4% Score",
      tags: [gap.name],
    }));
    return { ...acc, [entry.role]: recommendations };
  }, {});

  // Process trends
  const trends = (trendsRes.data || []).map((trend) => ({
    name: trend.skill_name,
    value: `${trend.frequency_percentage.toFixed(0)}%`,
    priority: (trend.priority_level || "Low") as "High" | "Medium" | "Low",
  }));

  return (
    <DashboardOverview
      roleStats={roleStats}
      roleDetails={roleDetails}
      historyByRole={historyByRole}
      gapsByRole={gapsByRole}
      trends={trends}
      recommendationsByRole={recommendationsByRole}
      currentMatchScore={currentMatchScore}
      skillsCount={skillsCount}
      projectsCount={projectsCount}
      daysActive={daysActive}
    />
  );
}

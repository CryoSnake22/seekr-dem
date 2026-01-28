import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch match score history
    const { data: historyData, error: historyError } = await supabase
      .from("match_score_history")
      .select("job_role, match_score, recorded_at")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: true });

    if (historyError) {
      console.error("Error fetching history:", historyError);
      return NextResponse.json(
        { error: "Failed to fetch progress data" },
        { status: 500 },
      );
    }

    // Get user stats
    const [skillsResult, projectsResult] = await Promise.all([
      supabase
        .from("user_skills")
        .select("id", { count: "exact" })
        .eq("user_id", user.id),
      supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("user_id", user.id),
    ]);

    // Calculate days active (from first recorded activity)
    const firstActivity =
      historyData && historyData.length > 0
        ? new Date(historyData[0].recorded_at)
        : new Date();
    const daysActive = Math.floor(
      (Date.now() - firstActivity.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Format history data by role
    const historyByRole = (historyData || []).reduce<
      Record<string, Array<{ date: string; score: number }>>
    >((acc, record) => {
      if (!acc[record.job_role]) {
        acc[record.job_role] = [];
      }
      acc[record.job_role].push({
        date: new Date(record.recorded_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: record.match_score,
      });
      return acc;
    }, {});

    // Get current match score (most recent for each role)
    const latestScores: Record<string, number> = {};
    for (const role in historyByRole) {
      const scores = historyByRole[role];
      if (scores.length > 0) {
        latestScores[role] = scores[scores.length - 1].score;
      }
    }

    // Get highest current match score
    const currentMatchScore =
      Object.values(latestScores).length > 0
        ? Math.max(...Object.values(latestScores))
        : 0;

    return NextResponse.json({
      currentMatchScore,
      history: historyByRole,
      skillsCount: skillsResult.count || 0,
      projectsCount: projectsResult.count || 0,
      daysActive,
    });
  } catch (error) {
    console.error("Error in progress API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

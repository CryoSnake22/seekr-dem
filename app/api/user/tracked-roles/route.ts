import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { jsonSuccess, jsonError } from "@/lib/api/responses";

/**
 * GET /api/user/tracked-roles
 * Returns the list of job roles the user has chosen to track (from user_tracked_roles).
 */
export async function GET() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return jsonError("Unauthorized", 401, "auth");
  }

  const { data, error } = await supabase
    .from("user_tracked_roles")
    .select("job_role")
    .eq("user_id", userData.user.id)
    .order("job_role");

  if (error) {
    return jsonError(error.message, 500, "db");
  }

  const roles = (data ?? []).map((row) => row.job_role);
  return jsonSuccess({ job_roles: roles });
}

/**
 * PUT /api/user/tracked-roles
 * Replaces the user's tracked roles. Body: { job_roles: string[] }
 */
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return jsonError("Unauthorized", 401, "auth");
  }

  let body: { job_roles?: string[] };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400, "validation");
  }

  const jobRoles = Array.isArray(body.job_roles) ? body.job_roles : [];
  const normalized = jobRoles.map((r) => String(r).trim()).filter(Boolean);

  // Replace: delete all existing, then insert new
  const { error: deleteError } = await supabase
    .from("user_tracked_roles")
    .delete()
    .eq("user_id", userData.user.id);

  if (deleteError) {
    console.error("[tracked-roles] DELETE error:", deleteError);
    return jsonError(
      deleteError.message,
      500,
      deleteError.code ?? "db"
    );
  }

  if (normalized.length > 0) {
    const rows = normalized.map((job_role) => ({
      user_id: userData.user!.id,
      job_role,
    }));
    const { error: insertError } = await supabase
      .from("user_tracked_roles")
      .insert(rows);
    if (insertError) {
      console.error("[tracked-roles] INSERT error:", insertError);
      return jsonError(
        insertError.message,
        500,
        insertError.code ?? "db"
      );
    }
  }

  return jsonSuccess({ job_roles: normalized });
}

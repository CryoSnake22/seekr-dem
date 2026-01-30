import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Store GitHub OAuth token for a user
 * This endpoint should be called after GitHub OAuth completes
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { access_token, token_type, scope } = body;

    if (!access_token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 },
      );
    }

    // Store the GitHub token
    const { error: tokenError } = await supabase
      .from("user_github_tokens")
      .upsert({
        user_id: user.id,
        access_token,
        token_type: token_type || "bearer",
        scope: scope || "",
        updated_at: new Date().toISOString(),
      });

    if (tokenError) {
      console.error("Error storing GitHub token:", tokenError);
      return NextResponse.json(
        { error: "Failed to store GitHub token" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "GitHub account connected successfully",
      connected: true,
    });
  } catch (error) {
    console.error("Error connecting GitHub:", error);
    return NextResponse.json(
      { error: "Failed to connect GitHub account" },
      { status: 500 },
    );
  }
}

/**
 * Check if user has connected GitHub
 */
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

    // Check if token exists
    const { data: tokenData } = await supabase
      .from("user_github_tokens")
      .select("created_at, updated_at")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      connected: !!tokenData,
      connectedAt: tokenData?.created_at,
      lastUpdated: tokenData?.updated_at,
    });
  } catch (error) {
    console.error("Error checking GitHub connection:", error);
    return NextResponse.json(
      { error: "Failed to check GitHub connection" },
      { status: 500 },
    );
  }
}

/**
 * Disconnect GitHub account
 */
export async function DELETE() {
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

    // Delete the token
    const { error: deleteError } = await supabase
      .from("user_github_tokens")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting GitHub token:", deleteError);
      return NextResponse.json(
        { error: "Failed to disconnect GitHub account" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "GitHub account disconnected successfully",
      connected: false,
    });
  } catch (error) {
    console.error("Error disconnecting GitHub:", error);
    return NextResponse.json(
      { error: "Failed to disconnect GitHub account" },
      { status: 500 },
    );
  }
}

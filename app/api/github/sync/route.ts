import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  fetchUserRepositories,
  fetchRepositoryLanguages,
  analyzeRepositoryLanguages,
  mergeSkills,
  type DetectedSkill,
} from '@/lib/utils/github-analyzer'
import { addProjectSkills } from '@/lib/supabase/queries/project-skills'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get GitHub access token
    const { data: tokenData } = await supabase
      .from('user_github_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (!tokenData?.access_token) {
      return NextResponse.json(
        { error: 'GitHub account not connected' },
        { status: 400 }
      )
    }

    const accessToken = tokenData.access_token

    // Fetch user's repositories from GitHub
    const repos = await fetchUserRepositories(accessToken)

    if (repos.length === 0) {
      return NextResponse.json({
        message: 'No repositories found',
        synced: 0,
        skillsDetected: 0,
      })
    }

    // Process each repository
    const allDetectedSkills: DetectedSkill[] = []
    const syncedRepos: any[] = []

    for (const repo of repos) {
      // Fetch language statistics
      const languages = await fetchRepositoryLanguages(
        repo.languages_url,
        accessToken
      )

      // Store repository data
      const { data: repoData, error: repoError } = await supabase
        .from('github_repositories')
        .upsert(
          {
            user_id: user.id,
            repo_name: repo.name,
            repo_url: repo.html_url,
            description: repo.description,
            languages: languages,
            stars: repo.stargazers_count,
            last_commit_date: repo.pushed_at,
            analyzed_at: new Date().toISOString(),
            included_in_profile: true,
          },
          { onConflict: 'user_id,repo_url' }
        )
        .select()
        .single()

      if (repoError) {
        console.error('Error storing repository:', repoError)
        continue
      }

      syncedRepos.push(repoData)

      // Analyze languages and detect skills
      // Estimate commits (we'd need additional API calls for exact count)
      const estimatedCommits = Math.floor(
        (Date.now() - new Date(repo.pushed_at).getTime()) /
          (1000 * 60 * 60 * 24 * 7)
      ) // Rough estimate based on age

      const detectedSkills = await analyzeRepositoryLanguages(
        languages,
        1,
        Math.max(estimatedCommits, 5),
        repo.stargazers_count
      )

      allDetectedSkills.push(...detectedSkills)

      // Create a project from this repo
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .upsert(
          {
            user_id: user.id,
            title: repo.name,
            description: repo.description,
            github_url: repo.html_url,
            github_synced: true,
            github_last_synced: new Date().toISOString(),
            technologies: Object.keys(languages),
          },
          { onConflict: 'user_id,github_url' }
        )
        .select()
        .single()

      if (!projectError && projectData && detectedSkills.length > 0) {
        // Add detected skills to the project
        try {
          await addProjectSkills(
            supabase,
            projectData.id,
            detectedSkills.map((skill) => ({
              skill_name: skill.skill_name,
              proficiency_level: skill.proficiency_level,
              usage_context: skill.usage_context,
            }))
          )
        } catch (skillError) {
          console.error('Error adding project skills:', skillError)
        }
      }
    }

    // Merge and deduplicate skills
    const uniqueSkills = mergeSkills(allDetectedSkills)

    // Update user_skills with detected skills (only add new ones)
    let newSkillsAdded = 0
    for (const skill of uniqueSkills) {
      if (skill.confidence < 0.5) continue // Skip low-confidence skills

      const { error: skillError } = await supabase
        .from('user_skills')
        .upsert(
          {
            user_id: user.id,
            skill_name: skill.skill_name,
            proficiency_level: skill.proficiency_level,
          },
          { onConflict: 'user_id,skill_name', ignoreDuplicates: true }
        )

      if (!skillError) {
        newSkillsAdded++
      }
    }

    return NextResponse.json({
      message: 'GitHub sync completed successfully',
      synced: syncedRepos.length,
      skillsDetected: uniqueSkills.length,
      newSkillsAdded,
      repositories: syncedRepos.map((r) => ({
        name: r.repo_name,
        url: r.repo_url,
        languages: r.languages,
      })),
    })
  } catch (error) {
    console.error('Error syncing GitHub:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to sync GitHub repositories',
      },
      { status: 500 }
    )
  }
}

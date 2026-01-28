import { SupabaseClient } from '@supabase/supabase-js'

export interface ProjectSkill {
  id?: string
  project_id: string
  skill_name: string
  proficiency_level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  usage_context?: string
  created_at?: string
}

/**
 * Get all skills for a project
 */
export async function getProjectSkills(
  supabase: SupabaseClient,
  projectId: string
): Promise<ProjectSkill[]> {
  const { data, error } = await supabase
    .from('project_skills')
    .select('*')
    .eq('project_id', projectId)
    .order('skill_name', { ascending: true })

  if (error) {
    console.error('Error fetching project skills:', error)
    return []
  }

  return data || []
}

/**
 * Add skills to a project
 */
export async function addProjectSkills(
  supabase: SupabaseClient,
  projectId: string,
  skills: Omit<ProjectSkill, 'id' | 'project_id' | 'created_at'>[]
): Promise<ProjectSkill[]> {
  const records = skills.map(skill => ({
    project_id: projectId,
    skill_name: skill.skill_name,
    proficiency_level: skill.proficiency_level,
    usage_context: skill.usage_context
  }))

  const { data, error } = await supabase
    .from('project_skills')
    .insert(records)
    .select()

  if (error) {
    console.error('Error adding project skills:', error)
    throw error
  }

  return data || []
}

/**
 * Update project skills (replaces all existing skills)
 */
export async function updateProjectSkills(
  supabase: SupabaseClient,
  projectId: string,
  skills: Omit<ProjectSkill, 'id' | 'project_id' | 'created_at'>[]
): Promise<ProjectSkill[]> {
  // Delete existing skills
  const { error: deleteError } = await supabase
    .from('project_skills')
    .delete()
    .eq('project_id', projectId)

  if (deleteError) {
    console.error('Error deleting project skills:', deleteError)
    throw deleteError
  }

  // Insert new skills
  if (skills.length === 0) {
    return []
  }

  return addProjectSkills(supabase, projectId, skills)
}

/**
 * Delete a specific project skill
 */
export async function deleteProjectSkill(
  supabase: SupabaseClient,
  skillId: string
): Promise<void> {
  const { error } = await supabase
    .from('project_skills')
    .delete()
    .eq('id', skillId)

  if (error) {
    console.error('Error deleting project skill:', error)
    throw error
  }
}

/**
 * Get all projects with their skills for a user
 */
export async function getProjectsWithSkills(
  supabase: SupabaseClient,
  userId: string
) {
  // First get all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
    return []
  }

  // Then get skills for each project
  const projectsWithSkills = await Promise.all(
    (projects || []).map(async (project) => {
      const skills = await getProjectSkills(supabase, project.id)
      return {
        ...project,
        project_skills: skills
      }
    })
  )

  return projectsWithSkills
}

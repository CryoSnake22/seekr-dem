import { createClient } from '../server'
import type { Database } from '@/types/database'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ProjectInput = Omit<ProjectInsert, 'user_id'>

export async function listProjects(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as ProjectRow[]
}

export async function createProject(userId: string, input: ProjectInput) {
  const supabase = await createClient()
  const payload: ProjectInsert = {
    user_id: userId,
    title: input.title,
    description: input.description ?? null,
    technologies: input.technologies ?? null,
    github_url: input.github_url ?? null,
    demo_url: input.demo_url ?? null,
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data as ProjectRow
}

export async function updateProject(userId: string, id: string, updates: ProjectUpdate) {
  const supabase = await createClient()
  const payload: ProjectUpdate = {
    title: updates.title,
    description: updates.description ?? null,
    technologies: updates.technologies ?? null,
    github_url: updates.github_url ?? null,
    demo_url: updates.demo_url ?? null,
  }

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as ProjectRow
}

export async function deleteProject(userId: string, id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  return { id }
}

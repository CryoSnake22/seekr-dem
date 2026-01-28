import { createClient } from '../server'
import type { Database } from '@/types/database'

type ExperienceRow = Database['public']['Tables']['experience']['Row']
type ExperienceInsert = Database['public']['Tables']['experience']['Insert']
type ExperienceUpdate = Database['public']['Tables']['experience']['Update']

export type ExperienceInput = Omit<ExperienceInsert, 'user_id'>

export async function listExperience(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return (data || []) as ExperienceRow[]
}

export async function createExperience(userId: string, input: ExperienceInput) {
  const supabase = await createClient()
  const payload: ExperienceInsert = {
    user_id: userId,
    company: input.company,
    role: input.role,
    start_date: input.start_date,
    end_date: input.end_date ?? null,
    description: input.description ?? null,
    technologies: input.technologies ?? null,
  }

  const { data, error } = await supabase
    .from('experience')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data as ExperienceRow
}

export async function updateExperience(userId: string, id: string, updates: ExperienceUpdate) {
  const supabase = await createClient()
  const payload: ExperienceUpdate = {
    company: updates.company,
    role: updates.role,
    start_date: updates.start_date,
    end_date: updates.end_date ?? null,
    description: updates.description ?? null,
    technologies: updates.technologies ?? null,
  }

  const { data, error } = await supabase
    .from('experience')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as ExperienceRow
}

export async function deleteExperience(userId: string, id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  return { id }
}

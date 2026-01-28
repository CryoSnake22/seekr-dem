import { createClient } from '../server'
import type { Database } from '@/types/database'

type SkillRow = Database['public']['Tables']['user_skills']['Row']
type SkillInsert = Database['public']['Tables']['user_skills']['Insert']
type SkillUpdate = Database['public']['Tables']['user_skills']['Update']

type SkillInput = Omit<SkillInsert, 'user_id'>

export async function listSkills(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId)
    .order('skill_name', { ascending: true })

  if (error) throw error
  return (data || []) as SkillRow[]
}

export async function createSkill(userId: string, input: SkillInput) {
  const supabase = await createClient()
  const payload: SkillInsert = {
    user_id: userId,
    skill_name: input.skill_name,
    proficiency: input.proficiency,
  }

  const { data, error } = await supabase
    .from('user_skills')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data as SkillRow
}

export async function updateSkill(userId: string, id: string, updates: SkillUpdate) {
  const supabase = await createClient()
  const payload: SkillUpdate = {
    skill_name: updates.skill_name,
    proficiency: updates.proficiency,
  }

  const { data, error } = await supabase
    .from('user_skills')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as SkillRow
}

export async function deleteSkill(userId: string, id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  return { id }
}

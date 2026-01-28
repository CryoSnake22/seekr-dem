import { createClient } from '../server'
import type { Database } from '@/types/database'

type EducationRow = Database['public']['Tables']['education']['Row']
type EducationInsert = Database['public']['Tables']['education']['Insert']
type EducationUpdate = Database['public']['Tables']['education']['Update']

export type EducationInput = Omit<EducationInsert, 'user_id'>

export async function listEducation(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', userId)
    .order('graduation_date', { ascending: false })

  if (error) throw error
  return (data || []) as EducationRow[]
}

export async function createEducation(userId: string, input: EducationInput) {
  const supabase = await createClient()
  const payload: EducationInsert = {
    user_id: userId,
    degree: input.degree,
    major: input.major,
    university: input.university,
    graduation_date: input.graduation_date ?? null,
    gpa: input.gpa ?? null,
  }

  const { data, error } = await supabase
    .from('education')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data as EducationRow
}

export async function updateEducation(userId: string, id: string, updates: EducationUpdate) {
  const supabase = await createClient()
  const payload: EducationUpdate = {
    degree: updates.degree,
    major: updates.major,
    university: updates.university,
    graduation_date: updates.graduation_date ?? null,
    gpa: updates.gpa ?? null,
  }

  const { data, error } = await supabase
    .from('education')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as EducationRow
}

export async function deleteEducation(userId: string, id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
  return { id }
}

import { createClient } from '../server'

export async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: {
  full_name?: string
  subscription_status?: 'free' | 'pro'
  subscription_expires_at?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getFullProfile(userId: string) {
  const supabase = await createClient()

  const [user, education, experience, skills, projects] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('education').select('*').eq('user_id', userId),
    supabase.from('experience').select('*').eq('user_id', userId),
    supabase.from('user_skills').select('*').eq('user_id', userId),
    supabase.from('projects').select('*').eq('user_id', userId),
  ])

  return {
    user: user.data,
    education: education.data || [],
    experience: experience.data || [],
    skills: skills.data || [],
    projects: projects.data || [],
  }
}

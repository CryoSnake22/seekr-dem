import { createClient } from '@/lib/supabase/server'
import EducationSection from '@/components/profile/EducationSection'
import ExperienceSection from '@/components/profile/ExperienceSection'
import SkillsSection from '@/components/profile/SkillsSection'
import ProjectsSection from '@/components/profile/ProjectsSection'
import GitHubConnect from '@/components/profile/GitHubConnect'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Golden Resume</h1>
          <p className="text-neutral-400">Build your professional profile</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Please sign in to manage your profile.
        </div>
      </div>
    )
  }

  const userId = userData.user.id

  const [educationRes, experienceRes, skillsRes, projectsRes] = await Promise.all([
    supabase.from('education').select('*').eq('user_id', userId).order('graduation_date', { ascending: false }),
    supabase.from('experience').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
    supabase.from('user_skills').select('*').eq('user_id', userId).order('skill_name', { ascending: true }),
    supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Golden Resume</h1>
        <p className="text-neutral-400">Build your professional profile</p>
      </div>

      <GitHubConnect />

      <EducationSection initialEducation={educationRes.data || []} />
      <ExperienceSection initialExperience={experienceRes.data || []} />
      <SkillsSection initialSkills={skillsRes.data || []} />
      <ProjectsSection initialProjects={projectsRes.data || []} />
    </div>
  )
}

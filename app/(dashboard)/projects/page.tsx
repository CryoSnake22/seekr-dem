import { createClient } from '@/lib/supabase/server'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Project Advisor</h1>
          <p className="text-neutral-400">Get personalized project recommendations</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Please sign in to view project recommendations.
        </div>
      </div>
    )
  }

  const userId = userData.user.id

  const [projectsRes, chatRes] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
    supabase
      .from('ai_chat_messages')
      .select('message, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const projects = projectsRes.data || []
  const lastPrompt = chatRes.data?.message || 'No prompts yet. Ask the AI for a tailored project idea.'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Project Advisor</h1>
        <p className="text-neutral-400">Get personalized project recommendations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Your projects</h2>
            <p className="text-sm text-neutral-400">Projects you can expand into stronger proof points.</p>
          </div>
          <div className="space-y-4">
            {projects.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-neutral-400">
                No projects yet. Add projects in your Golden Resume to see recommendations here.
              </div>
            )}
            {projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-sm text-neutral-400">{project.description || 'Add a short summary to highlight impact.'}</p>
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
                      {project.technologies.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="rounded-full border border-white/10 px-2 py-1">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="rounded-lg border border-white/10 px-4 py-2 text-xs text-neutral-200 hover:bg-white/10">
                    View plan
                  </button>
                  <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200">
                    Enhance with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-white">AI Advisor</h2>
            <p className="text-sm text-neutral-400">Describe your goals to get a custom spec.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
            <p className="text-xs text-neutral-500">Most recent prompt</p>
            <p className="text-sm text-neutral-300">“{lastPrompt}”</p>
          </div>
          <div className="space-y-3">
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={4}
              placeholder="Ask for a project idea based on your gaps..."
            />
            <button className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200">
              Generate project brief
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

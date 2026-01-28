import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AIChat } from '@/components/ai/AIChat'

export const metadata = {
  title: 'AI Career Advisor | Seekr',
  description: 'Get personalized career advice from your AI advisor'
}

export default async function AIChatPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get access token
  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token || ''

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Advisor</p>
        <h1 className="text-3xl font-semibold">AI Career Advisor</h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Get personalized advice on skills, career paths, interview prep, and professional development.
        </p>
      </div>

      <AIChat accessToken={accessToken} />

      {/* Usage info */}
      <div className="text-xs text-neutral-500 text-center">
        <p>
          This AI advisor has access to your profile and can provide personalized recommendations.
        </p>
      </div>
    </div>
  )
}

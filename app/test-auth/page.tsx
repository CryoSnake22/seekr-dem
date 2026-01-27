import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TestAuthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>

        <div className="glass-card rounded-2xl p-8 border border-white/10 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">✅ User is authenticated!</h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-neutral-400">User ID:</div>
              <div className="font-mono text-sm bg-white/5 p-2 rounded">{user.id}</div>
            </div>

            <div>
              <div className="text-sm text-neutral-400">Email:</div>
              <div className="font-mono text-sm bg-white/5 p-2 rounded">{user.email}</div>
            </div>

            <div>
              <div className="text-sm text-neutral-400">Full Name:</div>
              <div className="font-mono text-sm bg-white/5 p-2 rounded">
                {user.user_metadata?.full_name || 'Not set'}
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-400">Email Confirmed:</div>
              <div className="font-mono text-sm bg-white/5 p-2 rounded">
                {user.email_confirmed_at ? '✅ Yes' : '❌ No'}
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-400">Created At:</div>
              <div className="font-mono text-sm bg-white/5 p-2 rounded">
                {new Date(user.created_at!).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-400">Last Sign In:</div>
              <div className="font-mono text-sm bg-white/5 p-2 rounded">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </a>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

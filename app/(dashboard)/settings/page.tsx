import { createClient } from '@/lib/supabase/server'
import ProfilePreferences from '@/components/settings/ProfilePreferences'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-neutral-400">Manage your account and preferences</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center text-neutral-400">
          Please sign in to manage your settings.
        </div>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, subscription_status, subscription_expires_at')
    .eq('id', userData.user.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-400">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Profile preferences</h2>
              <p className="text-sm text-neutral-400">How your profile appears in recommendations.</p>
            </div>
            <ProfilePreferences
              initialFullName={profile?.full_name ?? ''}
              email={userData.user.email ?? ''}
            />
          </section>

          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <p className="text-sm text-neutral-400">Choose how we keep you updated.</p>
            </div>
            <div className="space-y-3">
              {['Weekly progress recap', 'New skill trends', 'AI project suggestions'].map((item) => (
                <label key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-sm text-neutral-300">{item}</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-transparent" defaultChecked />
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Plan</h2>
              <p className="text-sm text-neutral-400">Your current subscription.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <p className="text-sm text-neutral-400">Status</p>
              <p className="text-lg font-semibold text-white">
                {profile?.subscription_status === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </p>
              <p className="text-xs text-neutral-500">
                {profile?.subscription_expires_at
                  ? `Renews on ${new Date(profile.subscription_expires_at).toLocaleDateString()}`
                  : 'Upgrade to unlock AI insights.'}
              </p>
            </div>
            <button className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200">
              Upgrade plan
            </button>
          </section>

          <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Security</h2>
              <p className="text-sm text-neutral-400">Control access to your account.</p>
            </div>
            <button className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-sm text-neutral-200 hover:bg-white/10">
              Reset password
            </button>
            <button className="w-full rounded-lg border border-red-500/20 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10">
              Sign out of all devices
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

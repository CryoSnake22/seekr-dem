'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  if (!user) return null

  const initials = user.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0].toUpperCase() || 'U'

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:block text-right">
        <div className="text-sm font-medium text-white">
          {user.user_metadata?.full_name || 'User'}
        </div>
        <div className="text-xs text-neutral-500">{user.email}</div>
      </div>
      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
        {initials}
      </div>
    </div>
  )
}

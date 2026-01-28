'use client'

import { useState } from 'react'

type ProfilePreferencesProps = {
  initialFullName: string
  email: string
}

export default function ProfilePreferences({ initialFullName, email }: ProfilePreferencesProps) {
  const [fullName, setFullName] = useState(initialFullName)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setStatus('saving')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim() || null }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result?.error?.message || 'Unable to save profile changes.')
        setStatus('error')
        return
      }

      setStatus('saved')
    } catch (err) {
      setError('Unexpected error saving profile.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Display name</label>
          <input
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value)
              setStatus('idle')
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Jordan Lee"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
          <input
            value={email}
            disabled
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200"
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving...' : 'Save changes'}
        </button>
        <span className="text-xs text-neutral-500">
          {status === 'saved' && 'Saved.'}
          {status === 'error' && (error || 'Something went wrong.')}
        </span>
      </div>
    </form>
  )
}

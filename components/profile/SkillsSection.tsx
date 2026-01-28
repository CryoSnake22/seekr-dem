'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Database } from '@/types/database'

type SkillRow = Database['public']['Tables']['user_skills']['Row']

type Suggestion = {
  skill_name: string
  frequency_percentage?: number
  priority_level?: string
}

function sortSkills(items: SkillRow[]) {
  return [...items].sort((a, b) => a.skill_name.localeCompare(b.skill_name))
}

export default function SkillsSection({ initialSkills }: { initialSkills: SkillRow[] }) {
  const [items, setItems] = useState<SkillRow[]>(sortSkills(initialSkills))
  const [skillName, setSkillName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const normalizedSkillName = useMemo(() => skillName.trim(), [skillName])

  useEffect(() => {
    if (!normalizedSkillName) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/skills/suggestions?query=${encodeURIComponent(normalizedSkillName)}`, {
          signal: controller.signal,
        })
        const result = await response.json()
        if (!response.ok) {
          setSuggestions([])
          return
        }
        setSuggestions(result.data || [])
      } catch (err) {
        if (!controller.signal.aborted) {
          setSuggestions([])
        }
      }
    }, 250)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [normalizedSkillName])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!normalizedSkillName) {
      setError('Skill name is required.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(editingId ? `/api/user/skills/${editingId}` : '/api/user/skills', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name: normalizedSkillName }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result?.error?.message || 'Unable to save skill.')
        setLoading(false)
        return
      }

      setItems((prev) => {
        const nextItems = editingId
          ? prev.map((item) => (item.id === result.data.id ? result.data : item))
          : [...prev, result.data]
        return sortSkills(nextItems)
      })
      setSkillName('')
      setEditingId(null)
      setSuggestions([])
    } catch (err) {
      setError('Unexpected error saving skill.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/user/skills/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok) {
        setError(result?.error?.message || 'Unable to delete skill.')
        setLoading(false)
        return
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError('Unexpected error deleting skill.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: SkillRow) {
    setEditingId(item.id)
    setSkillName(item.skill_name)
  }

  function cancelEdit() {
    setEditingId(null)
    setSkillName('')
  }

  return (
    <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Skills</h2>
        <p className="text-sm text-neutral-400">Track the skills you want matched against the market.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-6 text-sm text-neutral-400">
            No skills added yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5">
                <span className="text-sm text-neutral-200">{item.skill_name}</span>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-300 hover:text-red-200"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Skill name</label>
          <input
            value={skillName}
            onChange={(event) => setSkillName(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="TypeScript"
            required
          />
          {suggestions.length > 0 && (
            <div className="mt-2 rounded-lg border border-white/10 bg-black/70 p-2">
              <p className="px-2 py-1 text-xs text-neutral-500">Suggested from market data</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.skill_name}
                    type="button"
                    onClick={() => setSkillName(suggestion.skill_name)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10"
                  >
                    {suggestion.skill_name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingId ? 'Update skill' : 'Add skill'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-neutral-200 hover:bg-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

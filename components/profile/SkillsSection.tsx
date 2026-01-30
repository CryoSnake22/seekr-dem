'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Database } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Plus } from '@/components/ui/Icon'

type SkillRow = Database['public']['Tables']['user_skills']['Row']

type Suggestion = {
  skill_name: string
  frequency_percentage?: number
  priority_level?: string
}

function sortSkills(items: SkillRow[]) {
  return [...items].sort((a, b) => a.skill_name.localeCompare(b.skill_name))
}

function getProficiencyColor(proficiency: string | null) {
  switch (proficiency) {
    case 'Beginner':
      return 'bg-red-500/20 border-red-500/30 text-red-300'
    case 'Intermediate':
      return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
    case 'Advanced':
      return 'bg-green-500/20 border-green-500/30 text-green-300'
    case 'Expert':
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
    default:
      return 'bg-neutral-500/20 border-neutral-500/30 text-neutral-300'
  }
}

export default function SkillsSection({ initialSkills }: { initialSkills: SkillRow[] }) {
  const [items, setItems] = useState<SkillRow[]>(sortSkills(initialSkills))
  const [skillName, setSkillName] = useState('')
  const [proficiency, setProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

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
        body: JSON.stringify({ skill_name: normalizedSkillName, proficiency }),
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
      setProficiency('Intermediate')
      setEditingId(null)
      setSuggestions([])
      setShowForm(false)
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
    setProficiency(item.proficiency || 'Intermediate')
    setShowForm(true)
  }

  function cancelEdit() {
    setEditingId(null)
    setSkillName('')
    setProficiency('Intermediate')
    setShowForm(false)
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
                {item.proficiency && (
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getProficiencyColor(item.proficiency)}`}>
                    {item.proficiency}
                  </span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(item)}
                  className="h-auto py-0 px-2 text-xs text-neutral-400 hover:text-white"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  className="h-auto py-0 px-2 text-xs text-red-300 hover:text-red-200"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
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

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Proficiency level</label>
            <select
              value={proficiency}
              onChange={(event) => setProficiency(event.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-neutral-200">
              {editingId ? 'Update Skill' : 'Add Skill'}
            </Button>
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}

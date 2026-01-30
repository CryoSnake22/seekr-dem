'use client'

import { useState } from 'react'
import type { Database } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Plus } from '@/components/ui/Icon'

type ExperienceRow = Database['public']['Tables']['experience']['Row']

type ExperienceFormState = {
  company: string
  role: string
  start_date: string
  end_date: string
  description: string
  technologies: string
}

const emptyForm: ExperienceFormState = {
  company: '',
  role: '',
  start_date: '',
  end_date: '',
  description: '',
  technologies: '',
}

function sortExperience(items: ExperienceRow[]) {
  return [...items].sort((a, b) => b.start_date.localeCompare(a.start_date))
}

function formatTechnologies(technologies: string[] | null) {
  return technologies?.join(', ') ?? ''
}

export default function ExperienceSection({ initialExperience }: { initialExperience: ExperienceRow[] }) {
  const [items, setItems] = useState<ExperienceRow[]>(sortExperience(initialExperience))
  const [form, setForm] = useState<ExperienceFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      start_date: form.start_date,
      end_date: form.end_date || null,
      description: form.description.trim() || null,
      technologies: form.technologies,
    }

    if (!payload.company || !payload.role || !payload.start_date) {
      setError('Company, role, and start date are required.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(editingId ? `/api/user/experience/${editingId}` : '/api/user/experience', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result?.error?.message || 'Unable to save experience entry.')
        setLoading(false)
        return
      }

      setItems((prev) => {
        const nextItems = editingId
          ? prev.map((item) => (item.id === result.data.id ? result.data : item))
          : [...prev, result.data]
        return sortExperience(nextItems)
      })
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError('Unexpected error saving experience entry.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/user/experience/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok) {
        setError(result?.error?.message || 'Unable to delete experience entry.')
        setLoading(false)
        return
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError('Unexpected error deleting experience entry.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: ExperienceRow) {
    setEditingId(item.id)
    setForm({
      company: item.company ?? '',
      role: item.role ?? '',
      start_date: item.start_date ?? '',
      end_date: item.end_date ?? '',
      description: item.description ?? '',
      technologies: formatTechnologies(item.technologies),
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)
  }

  return (
    <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Experience</h2>
        <p className="text-sm text-neutral-400">Highlight your most relevant roles.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-6 text-sm text-neutral-400">
            No experience entries yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-white font-medium">{item.role}</p>
                  <p className="text-sm text-neutral-400">{item.company}</p>
                  <p className="text-xs text-neutral-500">
                    {item.start_date} {item.end_date ? `— ${item.end_date}` : '— Present'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                    className="text-red-300 border-red-500/20 hover:bg-red-500/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {item.description && (
                <p className="mt-3 text-sm text-neutral-300">{item.description}</p>
              )}
              {item.technologies && item.technologies.length > 0 && (
                <p className="mt-2 text-xs text-neutral-500">Tech: {item.technologies.join(', ')}</p>
              )}
            </div>
          ))
        )}
      </div>

      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
            <input
              value={form.company}
              onChange={(event) => setForm({ ...form, company: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Acme Inc."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Role</label>
            <input
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Frontend Engineer"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(event) => setForm({ ...form, start_date: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(event) => setForm({ ...form, end_date: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
            placeholder="Describe your impact and responsibilities."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Technologies (comma-separated)</label>
          <input
            value={form.technologies}
            onChange={(event) => setForm({ ...form, technologies: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="React, Next.js, Supabase"
          />
        </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-neutral-200">
              {editingId ? 'Update Experience' : 'Add Experience'}
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

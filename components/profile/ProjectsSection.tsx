'use client'

import { useState } from 'react'
import type { Database } from '@/types/database'

type ProjectRow = Database['public']['Tables']['projects']['Row']

type ProjectFormState = {
  title: string
  description: string
  technologies: string
  github_url: string
  demo_url: string
}

const emptyForm: ProjectFormState = {
  title: '',
  description: '',
  technologies: '',
  github_url: '',
  demo_url: '',
}

function sortProjects(items: ProjectRow[]) {
  return [...items].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

function formatTechnologies(technologies: string[] | null) {
  return technologies?.join(', ') ?? ''
}

export default function ProjectsSection({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const [items, setItems] = useState<ProjectRow[]>(sortProjects(initialProjects))
  const [form, setForm] = useState<ProjectFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      technologies: form.technologies,
      github_url: form.github_url.trim() || null,
      demo_url: form.demo_url.trim() || null,
    }

    if (!payload.title) {
      setError('Project title is required.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(editingId ? `/api/user/projects/${editingId}` : '/api/user/projects', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result?.error?.message || 'Unable to save project.')
        setLoading(false)
        return
      }

      setItems((prev) => {
        const nextItems = editingId
          ? prev.map((item) => (item.id === result.data.id ? result.data : item))
          : [...prev, result.data]
        return sortProjects(nextItems)
      })
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError('Unexpected error saving project.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/user/projects/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok) {
        setError(result?.error?.message || 'Unable to delete project.')
        setLoading(false)
        return
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError('Unexpected error deleting project.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: ProjectRow) {
    setEditingId(item.id)
    setForm({
      title: item.title ?? '',
      description: item.description ?? '',
      technologies: formatTechnologies(item.technologies),
      github_url: item.github_url ?? '',
      demo_url: item.demo_url ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <p className="text-sm text-neutral-400">Showcase projects that prove your skills.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-6 text-sm text-neutral-400">
            No projects added yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  {item.description && <p className="text-sm text-neutral-400 mt-1">{item.description}</p>}
                  {item.technologies && item.technologies.length > 0 && (
                    <p className="mt-2 text-xs text-neutral-500">Tech: {item.technologies.join(', ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {(item.github_url || item.demo_url) && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {item.github_url && (
                    <a className="text-primary hover:text-primary/80" href={item.github_url} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {item.demo_url && (
                    <a className="text-primary hover:text-primary/80" href={item.demo_url} target="_blank" rel="noreferrer">
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Project title</label>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="AI Resume Analyzer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
            placeholder="Explain the problem and the impact you delivered."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Technologies (comma-separated)</label>
          <input
            value={form.technologies}
            onChange={(event) => setForm({ ...form, technologies: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Next.js, Supabase, OpenAI"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">GitHub URL</label>
            <input
              value={form.github_url}
              onChange={(event) => setForm({ ...form, github_url: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://github.com/username/project"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Live demo URL</label>
            <input
              value={form.demo_url}
              onChange={(event) => setForm({ ...form, demo_url: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://project.com"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingId ? 'Update project' : 'Add project'}
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

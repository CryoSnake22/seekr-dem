'use client'

import { useState } from 'react'
import type { Database } from '@/types/database'

type EducationRow = Database['public']['Tables']['education']['Row']

type EducationFormState = {
  degree: string
  major: string
  university: string
  graduation_date: string
  gpa: string
}

const emptyForm: EducationFormState = {
  degree: '',
  major: '',
  university: '',
  graduation_date: '',
  gpa: '',
}

function sortEducation(items: EducationRow[]) {
  return [...items].sort((a, b) => {
    const aValue = a.graduation_date ?? ''
    const bValue = b.graduation_date ?? ''
    return bValue.localeCompare(aValue)
  })
}

export default function EducationSection({ initialEducation }: { initialEducation: EducationRow[] }) {
  const [items, setItems] = useState<EducationRow[]>(sortEducation(initialEducation))
  const [form, setForm] = useState<EducationFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const payload = {
      degree: form.degree.trim(),
      major: form.major.trim(),
      university: form.university.trim(),
      graduation_date: form.graduation_date || null,
      gpa: form.gpa ? Number(form.gpa) : null,
    }

    if (!payload.degree || !payload.major || !payload.university) {
      setError('Degree, major, and university are required.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(editingId ? `/api/user/education/${editingId}` : '/api/user/education', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result?.error?.message || 'Unable to save education entry.')
        setLoading(false)
        return
      }

      setItems((prev) => {
        const nextItems = editingId
          ? prev.map((item) => (item.id === result.data.id ? result.data : item))
          : [...prev, result.data]
        return sortEducation(nextItems)
      })
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError('Unexpected error saving education entry.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/user/education/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok) {
        setError(result?.error?.message || 'Unable to delete education entry.')
        setLoading(false)
        return
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError('Unexpected error deleting education entry.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item: EducationRow) {
    setEditingId(item.id)
    setForm({
      degree: item.degree ?? '',
      major: item.major ?? '',
      university: item.university ?? '',
      graduation_date: item.graduation_date ?? '',
      gpa: item.gpa !== null && item.gpa !== undefined ? String(item.gpa) : '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Education</h2>
          <p className="text-sm text-neutral-400">Add your degrees and certifications.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-6 text-sm text-neutral-400">
            No education entries yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-white font-medium">{item.degree} in {item.major}</p>
                <p className="text-sm text-neutral-400">{item.university}</p>
                <p className="text-xs text-neutral-500">
                  {item.graduation_date ? `Graduated ${item.graduation_date}` : 'Graduation date not set'}
                  {item.gpa !== null && item.gpa !== undefined ? ` • GPA ${item.gpa}` : ''}
                </p>
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
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Degree</label>
            <input
              value={form.degree}
              onChange={(event) => setForm({ ...form, degree: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="B.S."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Major</label>
            <input
              value={form.major}
              onChange={(event) => setForm({ ...form, major: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Computer Science"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-300 mb-2">University</label>
            <input
              value={form.university}
              onChange={(event) => setForm({ ...form, university: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="University of California"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Graduation Date</label>
            <input
              type="date"
              value={form.graduation_date}
              onChange={(event) => setForm({ ...form, graduation_date: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">GPA</label>
            <input
              type="number"
              step="0.01"
              value={form.gpa}
              onChange={(event) => setForm({ ...form, gpa: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="3.8"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingId ? 'Update education' : 'Add education'}
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

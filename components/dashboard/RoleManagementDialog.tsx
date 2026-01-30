'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from '@/components/ui/Icon'

const FALLBACK_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Mobile Developer',
]

type RoleManagementDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackedRoles: string[]
  onSave: (roles: string[]) => Promise<void>
  isSaving?: boolean
  saveError?: string | null
}

export function RoleManagementDialog({
  open,
  onOpenChange,
  trackedRoles,
  onSave,
  isSaving = false,
  saveError = null,
}: RoleManagementDialogProps) {
  const [draft, setDraft] = useState<string[]>([])
  const [availableRoles, setAvailableRoles] = useState<string[]>(FALLBACK_ROLES)
  const [newRoleInput, setNewRoleInput] = useState('')

  useEffect(() => {
    if (open) {
      setDraft([...trackedRoles])
    }
  }, [open, trackedRoles])

  useEffect(() => {
    if (!open) return
    fetch('/api/backend/market/roles')
      .then((res) => res.json())
      .then((json) => {
        const roles = json?.data?.roles
        if (!Array.isArray(roles) || roles.length === 0) return
        const names = roles
          .map((r: { job_role?: string; role_name?: string } | string) =>
            typeof r === 'string' ? r : (r?.job_role ?? r?.role_name)
          )
          .filter((name): name is string => Boolean(name?.trim()))
        if (names.length > 0) setAvailableRoles(names)
      })
      .catch(() => {})
  }, [open])

  const canAdd = useMemo(
    () =>
      availableRoles.filter(
        (r) => Boolean(r?.trim()) && !draft.includes(r)
      ),
    [availableRoles, draft]
  )

  const remove = (role: string) => {
    setDraft((prev) => prev.filter((r) => r !== role))
  }

  const add = (role: string) => {
    const trimmed = role?.trim()
    if (trimmed && !draft.includes(trimmed))
      setDraft((prev) => [...prev, trimmed].sort())
  }

  const addNewRole = () => {
    const trimmed = newRoleInput.trim()
    if (trimmed && !draft.includes(trimmed)) {
      setDraft((prev) => [...prev, trimmed].sort())
      setNewRoleInput('')
    }
  }

  const handleSave = async () => {
    try {
      await onSave(draft)
      onOpenChange(false)
    } catch {
      // Error surfaced by useSelectedRoles
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage tracked roles</DialogTitle>
          <DialogDescription>
            Add or remove job roles to track on your dashboard. Changes are saved to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm font-medium text-white mb-2">Tracked roles</p>
            {draft.length === 0 ? (
              <p className="text-sm text-neutral-400">No roles yet. Add one below.</p>
            ) : (
              <ul className="space-y-1.5">
                {draft.map((role, index) => (
                  <li
                    key={role ? `tracked-${role}` : `tracked-${index}`}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => remove(role)}
                      className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
                      aria-label={`Remove ${role}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-2">Add role</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewRole())}
                placeholder="e.g. Product Manager"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="New role name"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addNewRole}
                disabled={!newRoleInput.trim()}
              >
                Add
              </Button>
            </div>
            {canAdd.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2 mb-1.5">Or pick one:</p>
            )}
            {canAdd.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {canAdd.map((role, index) => (
                  <Button
                    key={role ? `add-${role}` : `add-${index}`}
                    variant="outline"
                    size="sm"
                    onClick={() => add(role)}
                    className="text-xs"
                  >
                    + {role}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {saveError && (
          <p className="text-sm text-destructive" role="alert">
            {saveError}
          </p>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Hook to persist user's tracked roles via the API.
 * Call saveRoles(roles) after add/remove in RoleManagementDialog, then router.refresh() to reload server data.
 */
export function useSelectedRoles() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveRoles = useCallback(
    async (jobRoles: string[]) => {
      setIsSaving(true)
      setError(null)
      try {
        const res = await fetch('/api/user/tracked-roles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_roles: jobRoles }),
        })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error?.message ?? 'Failed to save roles')
        }
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save roles')
        throw e
      } finally {
        setIsSaving(false)
      }
    },
    [router]
  )

  return { saveRoles, isSaving, error }
}

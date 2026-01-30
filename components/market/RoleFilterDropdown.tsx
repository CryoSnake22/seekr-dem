'use client'

import { useState } from 'react'
import { ChevronDown, Check } from '@/components/ui/Icon'
import { JobRoleMarket } from '@/lib/types/market'

interface RoleFilterDropdownProps {
  roles: JobRoleMarket[]
  selectedRole: string
  onRoleChange: (role: string) => void
}

export function RoleFilterDropdown({
  roles,
  selectedRole,
  onRoleChange,
}: RoleFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (role: string) => {
    onRoleChange(role)
    setIsOpen(false)
  }

  const selectedRoleData = roles.find(r => r.job_role === selectedRole)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg hover:border-white/20 transition-colors text-white min-w-[250px]"
      >
        <div className="flex-1 text-left">
          <div className="font-medium">{selectedRole}</div>
          {selectedRoleData && (
            <div className="text-xs text-neutral-400">
              {selectedRoleData.total_skills} skills tracked
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-full bg-[#0A0A0A] border border-white/10 rounded-lg shadow-xl z-20 max-h-[400px] overflow-y-auto">
            {roles.map((role) => {
              const isSelected = role.job_role === selectedRole
              return (
                <button
                  key={role.job_role}
                  onClick={() => handleSelect(role.job_role)}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 flex items-center justify-between ${
                    isSelected ? 'bg-white/5' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium text-white">{role.job_role}</div>
                    <div className="text-xs text-neutral-400">
                      {role.total_skills} skills tracked
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

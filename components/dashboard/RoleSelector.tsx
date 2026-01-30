'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, Settings2 } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

type RoleSelectorProps = {
  roles: string[]
  selectedRole: string
  onRoleChange: (role: string) => void
  onManageRoles: () => void
  className?: string
}

export function RoleSelector({
  roles,
  selectedRole,
  onRoleChange,
  onManageRoles,
  className,
}: RoleSelectorProps) {
  const label = selectedRole === 'All' ? 'All roles' : selectedRole

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('min-w-[10rem] justify-between text-xs', className)}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[12rem] bg-[#0A0A0A] border-white/10 text-white shadow-xl"
      >
        <DropdownMenuItem
          onSelect={() => onRoleChange('All')}
          className="flex items-center justify-between cursor-pointer hover:bg-white/10 focus:bg-white/10"
        >
          All roles
          {selectedRole === 'All' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onSelect={() => onRoleChange(role)}
            className="flex items-center justify-between cursor-pointer hover:bg-white/10 focus:bg-white/10"
          >
            {role}
            {selectedRole === role && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onSelect={onManageRoles}
          className="gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
        >
          <Settings2 className="h-4 w-4" />
          Manage roles…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import React from 'react'

export type IconName =
  | 'AlertCircle'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUpRight'
  | 'BarChart3'
  | 'Bell'
  | 'BrainCircuit'
  | 'Check'
  | 'CheckCircle2'
  | 'ChevronDown'
  | 'ChevronRight'
  | 'Circle'
  | 'Code2'
  | 'Compass'
  | 'Cpu'
  | 'Database'
  | 'FileText'
  | 'LayoutDashboard'
  | 'Lock'
  | 'LogOut'
  | 'Mail'
  | 'MessageSquare'
  | 'MoreHorizontal'
  | 'Plus'
  | 'Search'
  | 'Settings'
  | 'Settings2'
  | 'Target'
  | 'Terminal'
  | 'TrendingUp'
  | 'Upload'
  | 'User'
  | 'X'
  | 'Zap'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

const iconPaths: Record<IconName, React.ReactNode> = {
  AlertCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  ArrowLeft: (
    <>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </>
  ),
  ArrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  ArrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>
  ),
  BarChart3: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  Bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  BrainCircuit: (
    <>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </>
  ),
  Check: <path d="M20 6 9 17l-5-5" />,
  CheckCircle2: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  ChevronDown: <path d="m6 9 6 6 6-6" />,
  ChevronRight: <path d="m9 18 6-6-6-6" />,
  Circle: <circle cx="12" cy="12" r="10" />,
  Code2: (
    <>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </>
  ),
  Compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  Cpu: (
    <>
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </>
  ),
  Database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </>
  ),
  FileText: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </>
  ),
  LayoutDashboard: (
    <>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </>
  ),
  Lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  LogOut: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </>
  ),
  Mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  MessageSquare: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </>
  ),
  MoreHorizontal: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  Plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  Search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  Settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Settings2: (
    <>
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </>
  ),
  Target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  Terminal: (
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </>
  ),
  TrendingUp: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  Upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </>
  ),
  User: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  X: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  Zap: (
    <>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </>
  ),
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, className = '', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {iconPaths[name]}
      </svg>
    )
  }
)

Icon.displayName = 'Icon'

// Export individual icon components for compatibility
export const AlertCircle = (props: Omit<IconProps, 'name'>) => <Icon name="AlertCircle" {...props} />
export const ArrowLeft = (props: Omit<IconProps, 'name'>) => <Icon name="ArrowLeft" {...props} />
export const ArrowRight = (props: Omit<IconProps, 'name'>) => <Icon name="ArrowRight" {...props} />
export const ArrowUpRight = (props: Omit<IconProps, 'name'>) => <Icon name="ArrowUpRight" {...props} />
export const BarChart3 = (props: Omit<IconProps, 'name'>) => <Icon name="BarChart3" {...props} />
export const Bell = (props: Omit<IconProps, 'name'>) => <Icon name="Bell" {...props} />
export const BrainCircuit = (props: Omit<IconProps, 'name'>) => <Icon name="BrainCircuit" {...props} />
export const Check = (props: Omit<IconProps, 'name'>) => <Icon name="Check" {...props} />
export const CheckCircle2 = (props: Omit<IconProps, 'name'>) => <Icon name="CheckCircle2" {...props} />
export const ChevronDown = (props: Omit<IconProps, 'name'>) => <Icon name="ChevronDown" {...props} />
export const ChevronRight = (props: Omit<IconProps, 'name'>) => <Icon name="ChevronRight" {...props} />
export const Circle = (props: Omit<IconProps, 'name'>) => <Icon name="Circle" {...props} />
export const Code2 = (props: Omit<IconProps, 'name'>) => <Icon name="Code2" {...props} />
export const Compass = (props: Omit<IconProps, 'name'>) => <Icon name="Compass" {...props} />
export const Cpu = (props: Omit<IconProps, 'name'>) => <Icon name="Cpu" {...props} />
export const Database = (props: Omit<IconProps, 'name'>) => <Icon name="Database" {...props} />
export const FileText = (props: Omit<IconProps, 'name'>) => <Icon name="FileText" {...props} />
export const LayoutDashboard = (props: Omit<IconProps, 'name'>) => <Icon name="LayoutDashboard" {...props} />
export const Lock = (props: Omit<IconProps, 'name'>) => <Icon name="Lock" {...props} />
export const LogOut = (props: Omit<IconProps, 'name'>) => <Icon name="LogOut" {...props} />
export const Mail = (props: Omit<IconProps, 'name'>) => <Icon name="Mail" {...props} />
export const MessageSquare = (props: Omit<IconProps, 'name'>) => <Icon name="MessageSquare" {...props} />
export const MoreHorizontal = (props: Omit<IconProps, 'name'>) => <Icon name="MoreHorizontal" {...props} />
export const Plus = (props: Omit<IconProps, 'name'>) => <Icon name="Plus" {...props} />
export const Search = (props: Omit<IconProps, 'name'>) => <Icon name="Search" {...props} />
export const Settings = (props: Omit<IconProps, 'name'>) => <Icon name="Settings" {...props} />
export const Settings2 = (props: Omit<IconProps, 'name'>) => <Icon name="Settings2" {...props} />
export const Target = (props: Omit<IconProps, 'name'>) => <Icon name="Target" {...props} />
export const Terminal = (props: Omit<IconProps, 'name'>) => <Icon name="Terminal" {...props} />
export const TrendingUp = (props: Omit<IconProps, 'name'>) => <Icon name="TrendingUp" {...props} />
export const Upload = (props: Omit<IconProps, 'name'>) => <Icon name="Upload" {...props} />
export const User = (props: Omit<IconProps, 'name'>) => <Icon name="User" {...props} />
export const X = (props: Omit<IconProps, 'name'>) => <Icon name="X" {...props} />
export const Zap = (props: Omit<IconProps, 'name'>) => <Icon name="Zap" {...props} />

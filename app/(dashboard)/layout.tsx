import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.05),rgba(0,0,0,0))]">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto text-[0.95rem]">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col md:ml-[248px] min-h-screen">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>

      <MobileNav />
    </div>
  )
}

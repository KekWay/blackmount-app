'use client'

import { useState, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { GenerationWatcher } from '@/components/shared/generation-watcher'
import { KeyboardShortcuts } from '@/components/shared/keyboard-shortcuts'
import { DevPanel } from '@/components/shared/dev-panel'

const SidebarContext = createContext({ collapsed: false, setCollapsed: (_: boolean) => {} })
export const useSidebarContext = () => useContext(SidebarContext)

const HAMBURGER_ICON = '/assets/models/sidebar-icon.png'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return localStorage.getItem('sidebarCollapsed') === 'true' } catch { return false }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarW = collapsed ? 72 : 248
  const isChat = pathname.startsWith('/chat/')

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsed={collapsed} onToggle={() => {
          const next = !collapsed
          setCollapsed(next)
          try { localStorage.setItem('sidebarCollapsed', String(next)) } catch {}
        }} />

        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Desktop main area */}
        <div
          className="flex-1 h-screen relative overflow-hidden hidden md:block"
          style={{ marginLeft: sidebarW }}
        >
          <div className="w-full h-full">
            {children}
          </div>
        </div>

        {/* Mobile main area */}
        <div className="flex-1 h-screen relative overflow-hidden md:hidden">
          {!isChat && (
            <div className="shrink-0 flex items-center px-[16px] pt-[16px] pb-[8px]">
              <button
                onClick={() => setMobileOpen(true)}
                className="size-[36px] flex items-center justify-center rounded-[10px] hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <img
                  src={HAMBURGER_ICON}
                  alt=""
                  className="size-[18px] object-contain brightness-0 invert opacity-60"
                  aria-hidden="true"
                />
              </button>
            </div>
          )}

          <div className={`w-full ${isChat ? 'h-full' : 'h-[calc(100%-60px)] pb-16'} overflow-hidden`}>
            {children}
          </div>
          {!isChat && <MobileNav />}
        </div>
      </div>
      <GenerationWatcher />
      <KeyboardShortcuts />
      <DevPanel />
    </SidebarContext.Provider>
  )
}

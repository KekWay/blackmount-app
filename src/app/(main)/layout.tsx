'use client'

import { useState, createContext, useContext } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

const SidebarContext = createContext({ collapsed: false, setCollapsed: (_: boolean) => {} })
export const useSidebarContext = () => useContext(SidebarContext)

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('sidebarCollapsed') === 'true'
  })

  const sidebarW = collapsed ? 72 : 248

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsed={collapsed} onToggle={() => {
          const next = !collapsed
          setCollapsed(next)
          localStorage.setItem('sidebarCollapsed', String(next))
        }} />

        <div
          className="flex-1 flex flex-col min-h-screen transition-[margin] duration-200 hidden md:flex"
          style={{ marginLeft: sidebarW }}
        >
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-[1400px] px-[24px] lg:px-[40px] py-[24px]">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile: no margin */}
        <div className="flex-1 flex flex-col min-h-screen md:hidden">
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16">
            <div className="w-full max-w-[1400px] px-[24px] lg:px-[40px] py-[24px]">
              {children}
            </div>
          </main>
        </div>

        <MobileNav />
      </div>
    </SidebarContext.Provider>
  )
}

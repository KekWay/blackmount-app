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

        {/* Main area — matches original layout.tsx:549-561 */}
        <div
          className="flex-1 h-screen relative overflow-hidden hidden md:block"
          style={{ marginLeft: sidebarW }}
        >
          <div className="w-full h-full">
            {children}
          </div>
        </div>

        {/* Mobile: no sidebar offset */}
        <div className="flex-1 h-screen relative overflow-hidden md:hidden pb-16">
          <div className="w-full h-full">
            {children}
          </div>
        </div>

        <MobileNav />
      </div>
    </SidebarContext.Provider>
  )
}

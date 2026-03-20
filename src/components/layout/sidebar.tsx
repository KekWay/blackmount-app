'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { APP_ASSETS } from '@/lib/assets'
import { SidebarNav } from './sidebar-nav'
import { SidebarUser } from './sidebar-user'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-10 flex flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ${
        collapsed ? 'w-[72px]' : 'w-[248px]'
      } hidden md:flex`}
    >
      {/* Logo */}
      <div className={`mt-9 flex items-center ${collapsed ? 'justify-center' : 'ml-5 pr-3 gap-2'}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={APP_ASSETS.logo}
            alt="Blackmount"
            width={36}
            height={36}
            className="shrink-0"
          />
          {!collapsed && (
            <span className="font-bakbak text-base leading-[22px] text-white whitespace-nowrap">
              BLACK MOUNT
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto shrink-0 size-[26px] flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Свернуть"
          >
            <PanelLeftClose className="size-[18px] text-white/30" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute top-9 left-1/2 -translate-x-1/2 size-9 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            aria-label="Развернуть"
          >
            <PanelLeftOpen className="size-4 text-white/50" />
          </button>
        )}
      </div>

      <SidebarNav collapsed={collapsed} />
      <SidebarUser collapsed={collapsed} />
    </aside>
  )
}

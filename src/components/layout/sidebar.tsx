'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { APP_ASSETS } from '@/lib/assets'
import { SidebarNav } from './sidebar-nav'
import { SidebarUser } from './sidebar-user'

const SIDEBAR_ICON = '/assets/models/sidebar-icon.png'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [logoHovered, setLogoHovered] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-10 flex flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ${
        collapsed ? 'w-[72px]' : 'w-[248px]'
      } hidden md:flex`}
    >
      {/* Logo row */}
      {!collapsed ? (
        <div className="flex items-center mt-[36px] ml-[20px] pr-[12px] gap-[8px]">
          <Link href="/home" className="flex gap-[10px] items-center cursor-pointer flex-1 min-w-0" aria-label="Go to home page">
            <Image src={APP_ASSETS.logo} alt="Black Mount logo" width={36} height={36} className="shrink-0 object-contain" />
            <span className="font-bakbak leading-[22px] not-italic text-[16px] text-white whitespace-nowrap">BLACK MOUNT</span>
          </Link>
          <button
            onClick={onToggle}
            className="shrink-0 size-[26px] flex items-center justify-center cursor-pointer rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] transition-all"
            aria-label="Collapse sidebar"
          >
            <img alt="" src={SIDEBAR_ICON} className="size-[18px] object-contain pointer-events-none brightness-0 invert opacity-30" aria-hidden="true" />
          </button>
        </div>
      ) : (
        /* Collapsed: logo area with hover-to-reveal toggle */
        <button
          className="mt-[36px] flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          onClick={onToggle}
          aria-label="Expand sidebar"
        >
          <div className="relative size-[36px] flex items-center justify-center">
            {/* Logo fades out, toggle fades in */}
            <img
              alt="Black Mount logo"
              className="absolute inset-0 max-w-none object-contain pointer-events-none size-full transition-opacity duration-200"
              src={APP_ASSETS.logo}
              style={{ opacity: logoHovered ? 0 : 1 }}
            />
            <img
              alt=""
              className="absolute object-contain pointer-events-none transition-opacity duration-200"
              src={SIDEBAR_ICON}
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                filter: 'brightness(0) invert(1)',
                opacity: logoHovered ? 0.5 : 0,
                transform: 'scaleX(-1)',
                top: '50%',
                left: '50%',
                marginTop: -8,
                marginLeft: -8,
              }}
            />
          </div>
        </button>
      )}

      <SidebarNav collapsed={collapsed} />
      <SidebarUser collapsed={collapsed} />
    </aside>
  )
}

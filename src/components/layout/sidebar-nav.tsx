'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { NAV_ITEMS } from '@/lib/constants'
import { useGenerationStore } from '@/stores/generation'
import { useArenaGuardStore } from '@/stores/arena-guard'
import { SidebarFavorites } from './sidebar-favorites'

const ICON_MAP: Record<string, { src: string; size?: number }> = {
  Home: { src: '/assets/models/home-icon.png' },
  Clock: { src: '/assets/models/history-icon.png' },
  Image: { src: '/assets/models/prompt-icon.png' },
  BookOpen: { src: '/assets/models/knowledge-icon.png' },
  Trophy: { src: '/assets/models/rating-icon.png', size: 22 },
  Swords: { src: '/assets/models/arena-icon.png' },
}

interface NavItemProps {
  href: string
  icon: string
  label: string
  active: boolean
  collapsed: boolean
  iconSize?: number
  showBadge?: boolean
}

function NavItem({ href, icon, label, active, collapsed, iconSize = 18, showBadge }: NavItemProps) {
  const [hovered, setHovered] = useState(false)
  const arenaActive = useArenaGuardStore((s) => s.active)
  const requestNav = useArenaGuardStore((s) => s.requestNav)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (arenaActive && !active) {
      e.preventDefault()
      requestNav(href)
    }
  }, [arenaActive, active, href, requestNav])

  return (
    <Link
      href={href}
      onClick={handleClick}
      title={collapsed ? label : undefined}
      className={`group h-[45px] relative rounded-[12px] shrink-0 cursor-pointer transition-colors mb-[2px] flex items-center ${
        collapsed ? 'w-full justify-center' : 'w-[208px] pl-[16px] gap-[12px]'
      }`}
      style={{
        backgroundColor: active
          ? 'var(--app-nav-active-bg, #39375b)'
          : hovered
            ? 'var(--app-hover, rgba(136,138,229,0.08))'
            : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="relative shrink-0 size-[20px] flex items-center justify-center"
        animate={hovered && !active ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17, duration: 0.2 }}
      >
        <img
          src={icon}
          alt=""
          className="object-contain transition-opacity duration-150"
          style={{ width: iconSize, height: iconSize, filter: 'brightness(0) invert(1)', opacity: active ? 1 : 0.5 }}
        />
        {showBadge && (
          <span className="absolute -top-[3px] -right-[3px] size-[8px] rounded-full bg-red-500" />
        )}
      </motion.div>
      {!collapsed && (
        <p
          className="font-normal leading-[21px] not-italic text-[14px]"
          style={{
            color: active
              ? 'var(--app-nav-text-active, white)'
              : 'var(--app-nav-text, rgba(255,255,255,0.5))',
          }}
        >
          {label}
        </p>
      )}
    </Link>
  )
}

interface SidebarNavProps {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const pathname = usePathname()
  const hasNewGenerations = useGenerationStore((s) => s.hasNewGenerations)
  const clearNewFlag = useGenerationStore((s) => s.clearNewFlag)

  useEffect(() => {
    if (pathname.startsWith('/history') && hasNewGenerations) clearNewFlag()
  }, [pathname, hasNewGenerations, clearNewFlag])

  return (
    <nav
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden hidden-scrollbar"
      aria-label="Main navigation"
    >
      <div className={`flex flex-col gap-[4px] items-start mt-[21px] ${collapsed ? 'px-[10px] w-full' : 'ml-[20px] w-[208px]'}`}>
        {NAV_ITEMS.map((item) => {
          const entry = ICON_MAP[item.icon]
          if (!entry) return null
          const isActive =
            item.href === '/'
              ? pathname === '/' || pathname === '/home'
              : pathname.startsWith(item.href)

          return (
            <NavItem
              key={item.href}
              href={item.href}
              icon={entry.src}
              label={item.label}
              iconSize={entry.size}
              active={isActive}
              collapsed={collapsed}
              showBadge={item.href === '/history' && hasNewGenerations}
            />
          )
        })}

        <SidebarFavorites collapsed={collapsed} />
      </div>
    </nav>
  )
}

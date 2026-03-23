'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOBILE_NAV_ITEMS } from '@/lib/constants'
import { useGenerationStore } from '@/stores/generation'
import { useArenaGuardStore } from '@/stores/arena-guard'

const ICON_MAP: Record<string, string> = {
  Home: '/assets/models/home-icon.png',
  Clock: '/assets/models/history-icon.png',
  Image: '/assets/models/prompt-icon.png',
  BookOpen: '/assets/models/knowledge-icon.png',
  Trophy: '/assets/models/rating-icon.png',
  Swords: '/assets/models/arena-icon.png',
}

function MobileNavItem({ item, isActive, hasNewGenerations }: { item: typeof MOBILE_NAV_ITEMS[number]; isActive: boolean; hasNewGenerations: boolean }) {
  const icon = ICON_MAP[item.icon]
  const arenaActive = useArenaGuardStore((s) => s.active)
  const requestNav = useArenaGuardStore((s) => s.requestNav)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (arenaActive && !isActive) {
      e.preventDefault()
      requestNav(item.href)
    }
  }, [arenaActive, isActive, item.href, requestNav])

  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={handleClick}
      className="flex flex-col items-center gap-1 py-2 px-3"
    >
      <div className="relative">
        {icon && (
          <img
            src={icon}
            alt=""
            className="size-[22px] object-contain transition-opacity"
            style={{ filter: 'brightness(0) invert(1)', opacity: isActive ? 1 : 0.5 }}
          />
        )}
        {item.href === '/history' && hasNewGenerations && (
          <span className="absolute -top-[2px] -right-[2px] size-[7px] rounded-full bg-red-500" />
        )}
      </div>
      <span className={`text-[10px] leading-none ${isActive ? 'text-white font-medium' : 'text-white/40'}`}>
        {item.label}
      </span>
    </Link>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const hasNewGenerations = useGenerationStore((s) => s.hasNewGenerations)
  const clearNewFlag = useGenerationStore((s) => s.clearNewFlag)

  useEffect(() => {
    if (pathname.startsWith('/history') && hasNewGenerations) clearNewFlag()
  }, [pathname, hasNewGenerations, clearNewFlag])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex md:hidden items-center justify-around h-16 bg-sidebar border-t border-sidebar-border pb-[env(safe-area-inset-bottom)]">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/' || pathname === '/home'
            : pathname.startsWith(item.href)

        return (
          <MobileNavItem key={item.href} item={item} isActive={isActive} hasNewGenerations={hasNewGenerations} />
        )
      })}
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Clock, BarChart3, Lightbulb } from 'lucide-react'
import { MOBILE_NAV_ITEMS } from '@/lib/constants'

const ICON_MAP: Record<string, typeof Home> = {
  Home,
  MessageSquare,
  Clock,
  BarChart3,
  Lightbulb,
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex md:hidden items-center justify-around h-16 bg-sidebar border-t border-sidebar-border">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon]
        const isActive =
          item.href === '/'
            ? pathname === '/' || pathname === '/home'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2 px-3"
          >
            {Icon && (
              <Icon
                size={22}
                strokeWidth={1.8}
                className={`transition-colors ${
                  isActive ? 'text-primary' : 'text-white/40'
                }`}
              />
            )}
            <span
              className={`text-[10px] leading-none ${
                isActive ? 'text-primary font-medium' : 'text-white/40'
              }`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

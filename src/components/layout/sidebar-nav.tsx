'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Clock, Image, BookOpen, Trophy, Swords, LogIn,
} from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth'
import { SidebarPinned } from './sidebar-pinned'

const ICON_MAP: Record<string, typeof Home> = {
  Home, Clock, Image, BookOpen, Trophy, Swords,
}

interface SidebarNavProps {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return (
    <nav
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden hidden-scrollbar"
      aria-label="Main navigation"
    >
      <div className={`flex flex-col gap-1 items-start mt-[21px] ${collapsed ? 'px-[10px] w-full' : 'ml-[20px] w-[208px]'}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon]
          const isActive =
            item.href === '/'
              ? pathname === '/' || pathname === '/home'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group h-[45px] relative rounded-[12px] shrink-0 cursor-pointer transition-colors mb-[2px] flex items-center ${
                collapsed ? 'w-full justify-center' : 'w-[208px] pl-[16px] gap-[12px]'
              } ${
                isActive
                  ? 'bg-[#39375b]'
                  : 'hover:bg-[rgba(136,138,229,0.08)]'
              }`}
            >
              {Icon && (
                <div className="relative shrink-0 size-[20px] flex items-center justify-center">
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={`transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-[rgba(255,255,255,0.5)]'
                    }`}
                  />
                </div>
              )}
              {!collapsed && (
                <p
                  className="font-normal leading-[21px] not-italic text-[14px]"
                  style={{
                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {item.label}
                </p>
              )}
            </Link>
          )
        })}

        <SidebarPinned collapsed={collapsed} />

        {!isLoggedIn && (
          <Link
            href="/auth"
            title={collapsed ? 'Войти' : undefined}
            className={`group h-[45px] relative rounded-[12px] shrink-0 cursor-pointer transition-colors mb-[2px] flex items-center ${
              collapsed ? 'w-full justify-center' : 'w-[208px] pl-[16px] gap-[12px]'
            } hover:bg-[rgba(136,138,229,0.08)]`}
          >
            <div className="relative shrink-0 size-[20px] flex items-center justify-center">
              <LogIn
                size={18}
                strokeWidth={1.8}
                className="transition-colors duration-150 text-[rgba(255,255,255,0.5)]"
              />
            </div>
            {!collapsed && (
              <p className="font-normal leading-[21px] not-italic text-[14px] text-[rgba(255,255,255,0.5)]">
                Войти
              </p>
            )}
          </Link>
        )}
      </div>
    </nav>
  )
}

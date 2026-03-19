'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Home,
  MessageSquare,
  Clock,
  BarChart3,
  Lightbulb,
  BookOpen,
  Swords,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  LogIn,
} from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'
import { useBalanceStore } from '@/stores/balance'

const ICON_MAP: Record<string, typeof Home> = {
  Home,
  MessageSquare,
  Clock,
  BarChart3,
  Lightbulb,
  BookOpen,
  Swords,
  User,
}

export function Sidebar() {
  const pathname = usePathname()
  const { isLoggedIn, user } = useAuthStore()
  const balance = useBalanceStore((s) => s.balance)
  const [collapsed, setCollapsed] = useState(false)

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
            onClick={() => setCollapsed(true)}
            className="ml-auto shrink-0 size-[26px] flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Свернуть"
          >
            <PanelLeftClose className="size-[18px] text-white/30" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute top-9 left-1/2 -translate-x-1/2 size-9 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            aria-label="Развернуть"
          >
            <PanelLeftOpen className="size-4 text-white/50" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto hidden-scrollbar mt-5">
        <div className={`flex flex-col gap-1 ${collapsed ? 'px-2.5' : 'ml-5 w-[208px]'}`}>
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
                className={`group flex items-center h-[45px] rounded-xl transition-colors ${
                  collapsed ? 'justify-center' : 'pl-4 gap-3'
                } ${
                  isActive
                    ? 'bg-[#39375b]'
                    : 'hover:bg-white/[0.06]'
                }`}
              >
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                    }`}
                  />
                )}
                {!collapsed && (
                  <span
                    className={`text-sm ${
                      isActive ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom: user / login */}
      <div className={`shrink-0 pb-5 ${collapsed ? 'px-2.5' : 'ml-5 w-[208px]'}`}>
        <div className="border-t border-white/[0.06] pt-3">
          {isLoggedIn && user ? (
            <Link
              href="/profile"
              className={`flex items-center gap-3 rounded-xl py-1.5 transition-colors hover:bg-white/[0.06] ${
                collapsed ? 'justify-center px-1' : 'px-2'
              }`}
            >
              <div className="bg-[#b93d3d] rounded-full shrink-0 size-9 flex items-center justify-center">
                <span className="font-bakbak text-lg text-white leading-none">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!collapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] text-white truncate">{user.name}</span>
                  </div>
                  <Link
                    href="/profile?tab=topup"
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-1 h-7 items-center px-2 rounded-lg bg-[rgba(57,55,91,0.6)] hover:bg-[rgba(57,55,91,0.8)] transition-colors"
                  >
                    <span className="font-bakbak text-[13px] text-white leading-none">
                      {balance}
                    </span>
                    <Image
                      src={APP_ASSETS.coin}
                      alt="coins"
                      width={14}
                      height={14}
                      className="shrink-0"
                    />
                  </Link>
                </>
              )}
            </Link>
          ) : (
            <Link
              href="/auth"
              className={`flex items-center justify-center gap-2.5 rounded-xl h-10 transition-all hover:brightness-110 active:scale-[0.98] mt-2 shadow-[0_2px_12px_rgba(136,138,229,0.3)] bg-gradient-to-br from-[#888ae5] to-[#6b6dce] ${
                collapsed ? '' : 'px-3.5'
              }`}
            >
              <LogIn size={16} className="text-white shrink-0" />
              {!collapsed && (
                <span className="font-semibold text-[13px] text-white">Войти</span>
              )}
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

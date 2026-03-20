import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, MessageSquare, Clock, BarChart3, Lightbulb,
  BookOpen, Swords, User, LogIn,
} from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth'

const ICON_MAP: Record<string, typeof Home> = {
  Home, MessageSquare, Clock, BarChart3, Lightbulb, BookOpen, Swords, User,
}

interface SidebarNavProps {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return (
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
                  strokeWidth={1.5}
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                  }`}
                />
              )}
              {!collapsed && (
                <span
                  className={`font-normal leading-[21px] text-[14px] ${
                    isActive ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
        {!isLoggedIn && (
          <Link
            href="/auth"
            title={collapsed ? 'Войти' : undefined}
            className={`group flex items-center h-[45px] rounded-xl transition-colors ${
              collapsed ? 'justify-center' : 'pl-4 gap-3'
            } hover:bg-white/[0.06]`}
          >
            <LogIn
              size={20}
              strokeWidth={1.8}
              className="shrink-0 transition-colors text-white/50 group-hover:text-white/70"
            />
            {!collapsed && (
              <span className="font-normal leading-[21px] text-[14px] text-white/50">Войти</span>
            )}
          </Link>
        )}
      </div>
    </nav>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth'

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/chat/')) return 'Чат'
  const item = NAV_ITEMS.find((n) =>
    n.href === '/' ? pathname === '/' || pathname === '/home' : pathname.startsWith(n.href),
  )
  return item?.label ?? 'Blackmount'
}

export function Header() {
  const pathname = usePathname()
  const { isLoggedIn, user } = useAuthStore()
  const title = getPageTitle(pathname)

  return (
    <header className="flex items-center justify-between h-16 px-6 shrink-0">
      <h1 className="font-manrope text-lg font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          className="size-10 flex items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors"
          aria-label="Поиск"
        >
          <img src="/assets/models/search-icon.png" alt="" className="size-[18px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
        </button>

        {isLoggedIn && user ? (
          <Link
            href="/profile"
            className="bg-[#b93d3d] rounded-full size-9 flex items-center justify-center"
          >
            <span className="font-bakbak text-base text-white leading-none">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </Link>
        ) : null}
      </div>
    </header>
  )
}

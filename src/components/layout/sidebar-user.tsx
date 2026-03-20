import Link from 'next/link'
import Image from 'next/image'
import { LogIn } from 'lucide-react'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'
import { useBalanceStore } from '@/stores/balance'

interface SidebarUserProps {
  collapsed: boolean
}

export function SidebarUser({ collapsed }: SidebarUserProps) {
  const { isLoggedIn, user } = useAuthStore()
  const balance = useBalanceStore((s) => s.balance)

  return (
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
  )
}

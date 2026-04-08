'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CustomIcon } from '@/components/shared/custom-icon'
import { AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import { SidebarUserMenu } from './sidebar-user-menu'
import { SupportChoiceModal } from '@/components/features/support/support-choice-modal'

const TIER_LABELS: Record<string, string> = {
  basic: 'BASIC',
  pro: 'PRO',
  max: 'MAX',
}

interface SidebarUserProps {
  collapsed: boolean
}

export function SidebarUser({ collapsed }: SidebarUserProps) {
  const router = useRouter()
  const { isLoggedIn, user } = useAuthStore()
  const balance = useBalanceStore((s) => s.balance)
  const hasActiveSub = useSubscriptionStore((s) => s.hasActiveSubscription())
  const tier = useSubscriptionStore((s) => s.subscription.tier)
  const [menuOpen, setMenuOpen] = useState(false)
  const [supportModal, setSupportModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={menuRef} className={`shrink-0 pb-5 ${collapsed ? 'px-2.5' : 'ml-5 w-[208px]'} relative`}>
      {isLoggedIn && user && (
        <AnimatePresence>
          {menuOpen && (
            <SidebarUserMenu
              collapsed={collapsed}
              hasActiveSub={hasActiveSub}
              onClose={() => setMenuOpen(false)}
              onSupport={() => setSupportModal(true)}
            />
          )}
        </AnimatePresence>
      )}

      <div className="border-t border-white/[0.06] pt-3">
        {isLoggedIn && user ? (
          <div className="cursor-pointer" role="button" tabIndex={0} onClick={() => setMenuOpen((v) => !v)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMenuOpen((v) => !v) } }}>
            <div className={`flex items-center gap-3 rounded-xl py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.08)] ${
              collapsed ? 'justify-center px-1 pt-3' : 'px-2 pt-3'
            }`}>
              <div className="bg-[#b93d3d] rounded-full shrink-0 size-9 flex items-center justify-center">
                <span className="font-bakbak text-lg text-white leading-none">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!collapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] text-white truncate">{user.name}</span>
                    {hasActiveSub ? (
                      <div className="h-[14px] rounded-[4px] flex items-center justify-center px-[5px] shrink-0 mt-0.5 self-start" style={{ backgroundImage: 'linear-gradient(122deg, rgb(171, 135, 228) 18%, rgb(155, 33, 130) 88%)' }}>
                        <span className="font-manrope text-[8px] text-white leading-none tracking-wide font-extrabold">{TIER_LABELS[tier] || tier.toUpperCase()}</span>
                      </div>
                    ) : (
                      <div className="h-[14px] rounded-[4px] flex items-center justify-center px-[5px] shrink-0 mt-0.5 self-start bg-white/[0.08]">
                        <span className="font-extrabold text-[8px] leading-none tracking-wide text-white/40">FREE</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex gap-1 h-7 items-center px-2 rounded-lg bg-[rgba(57,55,91,0.6)] hover:bg-[rgba(57,55,91,0.8)] transition-colors cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); router.push('/profile?tab=topup') }}
                  >
                    <span className="font-bakbak text-[13px] text-white leading-none">{balance}</span>
                    <Image src={APP_ASSETS.coin} alt="coins" width={14} height={14} className="shrink-0" />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push('/auth')}
            className={`w-full flex items-center justify-center gap-2.5 rounded-xl h-10 transition-all hover:brightness-110 active:scale-[0.98] mt-2 shadow-[0_2px_12px_rgba(136,138,229,0.3)] bg-gradient-to-br from-[#888ae5] to-[#6b6dce] cursor-pointer ${
              collapsed ? '' : 'px-3.5'
            }`}
          >
            <CustomIcon src="/icons/sign_in_icon.png" size={16} className="shrink-0" />
            {!collapsed && <span className="font-semibold text-[13px] text-white">Войти</span>}
          </button>
        )}
      </div>
      <SupportChoiceModal show={supportModal} onClose={() => setSupportModal(false)} />
    </div>
  )
}

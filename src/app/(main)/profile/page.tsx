'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LogOut, Clock, Menu, X } from 'lucide-react'
import { APP_ASSETS } from '@/lib/assets'
import { motion, AnimatePresence } from 'motion/react'
import { useAuthStore } from '@/stores/auth'
import { SidebarItem, SectionLabel } from '@/components/features/profile/profile-sidebar'
import { AccountTab } from '@/components/features/profile/account-tab'
import { TopupTab } from '@/components/features/profile/topup-tab'
import { ReferralTab } from '@/components/features/profile/referral-tab'
import { HistoryTab } from '@/components/features/profile/history-tab'
import { type Tab, tabTitles, IMG_LOGO, IMG_COIN_PHOTOROOM, IMG_PROFILE_MASK } from '@/components/features/profile/profile-data'

function ProfileSidebarContent({ activeTab, setActiveTab, router, logout, onClose }: {
  activeTab: Tab
  setActiveTab: (t: Tab) => void
  router: ReturnType<typeof useRouter>
  logout: () => void
  onClose?: () => void
}) {
  const handleNav = (action: () => void) => {
    action()
    onClose?.()
  }

  return (
    <>
      <div className="flex items-center gap-[10px] px-[20px] pt-[28px] pb-[24px]">
        <div className="bg-[#b93d3d] rounded-full shrink-0 size-[28px] flex items-center justify-center">
          <p className="font-bakbak text-[13px] text-white leading-[20px]">A</p>
        </div>
        <p className="font-manrope font-medium text-[14px] text-white leading-[20px]">Artur Kazarian</p>
      </div>
      <div className="flex flex-col gap-[2px] px-[12px]">
        <SectionLabel>Настройки аккаунта</SectionLabel>
        <SidebarItem icon={<div style={{ width: 15, height: 15, backgroundColor: 'currentColor', maskImage: `url('${IMG_PROFILE_MASK}')`, WebkitMaskImage: `url('${IMG_PROFILE_MASK}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />} label="Профиль" active={activeTab === 'account'} onClick={() => handleNav(() => setActiveTab('account'))} />
        <SidebarItem icon={<img src={IMG_LOGO} alt="" className="size-[15px] object-contain brightness-0 invert transition-opacity opacity-60" />} label="Подписки" active={false} onClick={() => handleNav(() => router.push('/subscription'))} />
        <SidebarItem icon={<img src={IMG_COIN_PHOTOROOM} alt="" className={`size-[15px] object-cover transition-opacity ${activeTab === 'topup' ? 'opacity-100' : 'opacity-60'}`} />} label="Пополнить баланс" active={activeTab === 'topup'} onClick={() => handleNav(() => setActiveTab('topup'))} />
      </div>
      <div className="flex flex-col gap-[2px] px-[12px] mt-[20px]">
        <SectionLabel>Финансы</SectionLabel>
        <SidebarItem icon={<img src={APP_ASSETS.referralIcon} alt="" className={`size-[15px] object-contain brightness-0 invert transition-opacity ${activeTab === 'referral' ? 'opacity-100' : 'opacity-60'}`} />} label="Реферальная программа" active={activeTab === 'referral'} onClick={() => handleNav(() => setActiveTab('referral'))} />
        <SidebarItem icon={<Clock size={15} />} label="История операций" active={activeTab === 'history'} onClick={() => handleNav(() => setActiveTab('history'))} />
      </div>
      <div className="mt-auto px-[12px] pb-[24px]">
        <SidebarItem icon={<LogOut size={15} />} label="Выход" onClick={() => handleNav(() => { logout(); router.push('/auth') })} danger />
      </div>
    </>
  )
}

function ProfilePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const logout = useAuthStore((s) => s.logout)
  const tabParam = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState<Tab>('account')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (tabParam === 'subscription') {
      router.replace('/subscription')
      return
    }
    if (tabParam && ['account', 'topup', 'referral', 'history'].includes(tabParam)) {
      setActiveTab(tabParam as Tab)
    }
  }, [tabParam, router])

  return (
    <div className="bg-[#121118] fixed inset-0 z-50 flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-[230px] shrink-0 border-r border-[rgba(255,255,255,0.06)] flex-col h-full bg-[#181724]">
        <ProfileSidebarContent activeTab={activeTab} setActiveTab={setActiveTab} router={router} logout={logout} />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[60] w-[250px] bg-[#181724] border-r border-[rgba(255,255,255,0.06)] flex flex-col transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-[16px] right-[16px] size-[28px] flex items-center justify-center rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Закрыть меню"
        >
          <X size={18} className="text-white/50" />
        </button>
        <ProfileSidebarContent activeTab={activeTab} setActiveTab={setActiveTab} router={router} logout={logout} onClose={() => setMobileMenuOpen(false)} />
      </aside>

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#121118]">
        <div className="max-w-[720px] mx-auto px-[16px] md:px-[24px] lg:px-[48px] pt-[24px] md:pt-[32px] pb-[80px] md:pb-[48px]">
          <div className="flex items-center justify-between mb-[24px]">
            <div className="flex items-center gap-[10px]">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden size-[34px] flex items-center justify-center rounded-[10px] hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Меню профиля"
              >
                <Menu size={20} className="text-white/60" />
              </button>
              <p className="font-manrope font-semibold leading-[36px] text-[20px] md:text-[24px] text-white">
                {tabTitles[activeTab]}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-[rgba(255,255,255,0.35)] hover:text-white transition-colors cursor-pointer font-manrope font-medium text-[13px] flex items-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] rounded-[10px] px-[14px] py-[7px]"
            >
              {'\u2715'} Закрыть
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'account' && <AccountTab onNavigate={(tab) => { if (tab === 'subscription') { router.push('/subscription'); return; } setActiveTab(tab); }} />}
              {activeTab === 'topup' && <TopupTab />}
              {activeTab === 'referral' && <ReferralTab />}
              {activeTab === 'history' && <HistoryTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageContent />
    </Suspense>
  )
}

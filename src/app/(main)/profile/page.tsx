'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Users, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { SidebarItem, SectionLabel } from '@/components/features/profile/profile-sidebar'
import { AccountTab } from '@/components/features/profile/account-tab'
import { TopupTab } from '@/components/features/profile/topup-tab'
import { ReferralTab } from '@/components/features/profile/referral-tab'
import { HistoryTab } from '@/components/features/profile/history-tab'
import { type Tab, tabTitles, IMG_LOGO, IMG_COIN_PHOTOROOM, IMG_PROFILE_MASK } from '@/components/features/profile/profile-data'

export default function ProfilePage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window === 'undefined') return 'account'
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab === 'subscription') {
      return 'account'
    }
    if (tab && ['account', 'topup', 'referral', 'history'].includes(tab)) {
      return tab as Tab
    }
    return 'account'
  })

  return (
    <div className="bg-[#121118] fixed inset-0 z-50 flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[230px] shrink-0 border-r border-[rgba(255,255,255,0.06)] flex flex-col h-full bg-[#181724]">
        <div className="flex items-center gap-[10px] px-[20px] pt-[28px] pb-[24px]">
          <div className="bg-[#b93d3d] rounded-full shrink-0 size-[28px] flex items-center justify-center">
            <p className="font-bakbak text-[13px] text-white leading-[20px]">A</p>
          </div>
          <p className="font-manrope font-medium text-[14px] text-white leading-[20px]">Artur Kazarian</p>
        </div>

        <div className="px-[12px] flex flex-col gap-[2px]">
          <SectionLabel>Настройки аккаунта</SectionLabel>
          <SidebarItem icon={<div style={{ width: 15, height: 15, backgroundColor: 'currentColor', maskImage: `url('${IMG_PROFILE_MASK}')`, WebkitMaskImage: `url('${IMG_PROFILE_MASK}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />} label="Профиль" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
          <SidebarItem icon={<img src={IMG_LOGO} alt="" className="size-[15px] object-contain brightness-0 invert transition-opacity opacity-60" />} label="Подписки" active={false} onClick={() => router.push('/subscription')} />
          <SidebarItem icon={<img src={IMG_COIN_PHOTOROOM} alt="" className={`size-[15px] object-cover transition-opacity ${activeTab === 'topup' ? 'opacity-100' : 'opacity-60'}`} />} label="Пополнить баланс" active={activeTab === 'topup'} onClick={() => setActiveTab('topup')} />
        </div>

        <div className="px-[12px] mt-[20px] flex flex-col gap-[2px]">
          <SectionLabel>Финансы</SectionLabel>
          <SidebarItem icon={<Users size={15} />} label="Реферальная программа" active={activeTab === 'referral'} onClick={() => setActiveTab('referral')} />
          <SidebarItem icon={<Clock size={15} />} label="История операций" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </div>

        <div className="mt-auto px-[12px] pb-[24px]">
          <SidebarItem icon={<LogOut size={15} />} label="Выход" onClick={() => router.push('/')} danger />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#121118]">
        <div className="max-w-[720px] mx-auto px-[48px] pt-[32px] pb-[48px]">
          <div className="flex items-center justify-between mb-[24px]">
            <p className="font-manrope font-semibold leading-[36px] text-[24px] text-white">
              {tabTitles[activeTab]}
            </p>
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

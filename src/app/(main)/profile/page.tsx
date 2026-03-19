'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { ProfileHeader } from '@/components/features/profile/profile-header'
import { ProfileStats } from '@/components/features/profile/profile-stats'
import { BalanceSection } from '@/components/features/profile/balance-section'
import { SubscriptionCard } from '@/components/features/profile/subscription-card'
import { OperationHistory } from '@/components/features/profile/operation-history'
import { SettingsSection } from '@/components/features/profile/settings-section'

const TABS = [
  { key: 'account', label: 'Аккаунт' },
  { key: 'subscription', label: 'Подписка' },
  { key: 'topup', label: 'Пополнение' },
  { key: 'history', label: 'История' },
] as const

type TabKey = (typeof TABS)[number]['key']

function ProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = (searchParams.get('tab') as TabKey) || 'account'

  const handleTabChange = (tab: TabKey) => {
    router.push(`/profile?tab=${tab}`)
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <ProfileHeader />

      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && (
        <div className="flex flex-col gap-6">
          <ProfileStats />
          <SettingsSection />
        </div>
      )}

      {activeTab === 'subscription' && <SubscriptionCard />}

      {activeTab === 'topup' && <BalanceSection />}

      {activeTab === 'history' && <OperationHistory />}
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-white/40">Загрузка...</span>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}

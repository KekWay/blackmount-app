'use client'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { TierIcon } from './tier-icon'
import type { TierInfo } from './referral-data'
import { ReferralHero } from './referral-hero'
import { ReferralBalanceStats } from './referral-balance-stats'
import { ReferralEarningsChart } from './referral-earnings-chart'
import { ReferralHowItWorks } from './referral-how-it-works'
import { ReferralList } from './referral-list'
import { ReferralTierOverlay } from './referral-tier-overlay'
import { ReferralConvertOverlay } from './referral-convert-overlay'
import { ReferralWithdrawOverlay } from './referral-withdraw-overlay'

export function ReferralTab() {
  const [showConvert, setShowConvert] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showTierOverlay, setShowTierOverlay] = useState(false)
  const [activeTier] = useState(1)

  const tiers: TierInfo[] = [
    { name: 'Bronze', label: 'Бронза', rate: '10%', color: '#9d6a4f', minRefs: 0, icon: <TierIcon gradientClass="from-[#9d6a4f] to-black" size={32} /> },
    { name: 'Silver', label: 'Серебро', rate: '15%', color: '#C0C0C0', minRefs: 5, icon: <TierIcon gradientClass="from-white to-black" size={32} /> },
    { name: 'Gold', label: 'Золото', rate: '20%', color: '#FFD700', minRefs: 15, icon: <TierIcon gradientClass="from-[#fc0] to-black" size={32} /> },
    { name: 'Diamond', label: 'Алмаз', rate: '25%', color: '#1fcbed', minRefs: 50, icon: <TierIcon gradientClass="from-[#1fcbed] via-[#45848e] to-[#002c2d]" size={32} /> },
  ]

  const currentTier = tiers[activeTier]
  const nextTier = tiers[activeTier + 1]
  const tierProgress = nextTier ? Math.round((12 / nextTier.minRefs) * 100) : 100

  return (
    <>
      <div className="flex flex-col gap-[16px]">
        <ReferralHero currentTier={currentTier} nextTier={nextTier} tierProgress={tierProgress} />
        <ReferralBalanceStats onConvert={() => setShowConvert(true)} onWithdraw={() => setShowWithdraw(true)} />
        <ReferralEarningsChart />
        <ReferralHowItWorks currentTier={currentTier} />
        <ReferralList />
      </div>

      <AnimatePresence>
        {showTierOverlay && (
          <ReferralTierOverlay
            onClose={() => setShowTierOverlay(false)}
            tiers={tiers}
            activeTier={activeTier}
            currentTier={currentTier}
            nextTier={nextTier}
            tierProgress={tierProgress}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showConvert && <ReferralConvertOverlay onClose={() => setShowConvert(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showWithdraw && <ReferralWithdrawOverlay onClose={() => setShowWithdraw(false)} />}
      </AnimatePresence>
    </>
  )
}

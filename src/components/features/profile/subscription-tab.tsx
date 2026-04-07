'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'motion/react'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import type { SubscriptionTier } from '@/types'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { PaymentOverlay } from '@/components/shared/payment-overlay'
import { planFeatures, plansArr, type Plan, type Period } from './profile-data'
import { PlansComparisonTable } from './plans-comparison-table'
import { PricingInfoOverlay } from './pricing-info-overlay'
import { AllModelsOverlay } from './all-models-overlay'
import { SubscriptionPlanCard } from './subscription-plan-card'

export function SubscriptionTab() {
  const [period, setPeriod] = useState<Period>('month')
  const [showPayment, setShowPayment] = useState(false)
  const [showModelsModal, setShowModelsModal] = useState(false)
  const [payPlan, setPayPlan] = useState<Plan>('pro')
  const [showPricing, setShowPricing] = useState(false)

  const addBalance = useBalanceStore((s) => s.addBalance)
  const addOperation = useBalanceStore((s) => s.addOperation)
  const setSubscription = useSubscriptionStore((s) => s.setSubscription)

  const selectedPlanData = plansArr.find((p) => p.key === payPlan)!
  const selectedCoins = planFeatures[payPlan].coins
  const payAmount = period === 'month' ? selectedPlanData.priceMonth : selectedPlanData.priceYear

  return (
    <>
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-center justify-between">
          <div className="w-[240px]">
            <AnimatedToggle<Period>
              options={[
                { key: 'month', label: 'Месяц' },
                { key: 'year', label: 'Год', badge: '-15%' },
              ]}
              value={period}
              onChange={setPeriod}
              size="sm"
            />
          </div>
          <button onClick={() => setShowPricing(true)} className="group flex items-center gap-[6px] text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer text-[13px] font-manrope font-medium">
            <Image src="/icons/info_icon.png" alt="" width={14} height={14} className="invert opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
            <span>Цены моделей</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {plansArr.map((p) => (
            <SubscriptionPlanCard
              key={p.key}
              p={p}
              period={period}
              onBuy={() => { setPayPlan(p.key); setShowPayment(true); }}
              onShowModels={() => setShowModelsModal(true)}
            />
          ))}
        </div>

        <div className="mt-[16px]">
          <PlansComparisonTable columns={[
            { label: 'Basic', coins: planFeatures.basic.coins, color: '#a0a0b0' },
            { label: 'Pro', coins: planFeatures.pro.coins, color: '#888ae5' },
            { label: 'Max', coins: planFeatures.max.coins, color: '#d4a574' },
          ]} />
        </div>
      </div>

      <PaymentOverlay
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={payAmount}
        label={`Black Mount ${selectedPlanData.label}`}
        onSuccess={() => {
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + (period === 'month' ? 1 : 12))
          setSubscription(payPlan as SubscriptionTier, expiresAt.toISOString())
          addBalance(selectedCoins)
          addOperation('topup', `Подписка ${selectedPlanData.label}: ${selectedCoins} айкоинов`, selectedCoins)
          setShowPayment(false)
        }}
      />
      {showPricing && <PricingInfoOverlay onClose={() => setShowPricing(false)} />}
      <AnimatePresence>
        {showModelsModal && <AllModelsOverlay onClose={() => setShowModelsModal(false)} />}
      </AnimatePresence>
    </>
  )
}

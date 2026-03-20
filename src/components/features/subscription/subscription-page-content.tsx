'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { PaymentOverlay } from '@/components/shared/payment-overlay'
import { useSubscriptionStore } from '@/stores/subscription'
import { useBalanceStore } from '@/stores/balance'
import { type Plan, type Period, plansArr, planFeatures } from './subscription-data'
import { PlanCard } from './plan-card'
import { PlanComparison } from './plan-comparison'
import { ModelsOverlay } from './models-overlay'

export function SubscriptionPageContent() {
  const router = useRouter()
  const [period, setPeriod] = useState<Period>('month')
  const [showPayment, setShowPayment] = useState(false)
  const [showModelsModal, setShowModelsModal] = useState(false)
  const [payPlan, setPayPlan] = useState<Plan>('pro')

  const subscription = useSubscriptionStore((s) => s.subscription)
  const setSubscription = useSubscriptionStore((s) => s.setSubscription)
  const addBalance = useBalanceStore((s) => s.addBalance)
  const addOperation = useBalanceStore((s) => s.addOperation)

  const activePlanKey: string | null = subscription.tier !== 'free'
    ? (subscription.tier === 'ultra' ? 'max' : subscription.tier)
    : null

  const handleSelectPlan = (plan: Plan) => {
    setPayPlan(plan)
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    const plan = plansArr.find((p) => p.key === payPlan)
    if (!plan) return
    const coins = planFeatures[payPlan].coins
    const tier = payPlan === 'max' ? 'ultra' as const : payPlan === 'pro' ? 'pro' as const : 'basic' as const
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + (period === 'month' ? 1 : 12))
    setSubscription(tier, expiresAt.toISOString())
    addBalance(coins)
    addOperation('topup', `Подписка ${plan.label}: ${coins} айкоинов`, coins)
    setShowPayment(false)
  }

  const payPlanInfo = plansArr.find((p) => p.key === payPlan)
  const payPrice = payPlanInfo ? (period === 'month' ? payPlanInfo.priceMonth : payPlanInfo.priceYear) : 0

  return (
    <div className="min-h-screen bg-[#0d0c13] overflow-y-auto relative">
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[50%] bg-[#888ae5] opacity-[0.05] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#a03c8c] opacity-[0.05] blur-[150px] pointer-events-none" />

      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-[200] flex items-center gap-2.5 bg-[rgba(13,12,19,0.8)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.06)] px-4 py-2.5 rounded-[16px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.05)]"
      >
        <ArrowLeft size={18} />
        <span className="font-manrope font-bold text-[14px]">Назад</span>
      </button>

      <div className="max-w-[900px] mx-auto py-12 px-5 relative z-10 flex flex-col items-center">
        <SubscriptionHeader period={period} onPeriodChange={setPeriod} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
          {plansArr.map((p) => {
            const price = period === 'month' ? p.priceMonth : p.priceYear
            return (
              <PlanCard
                key={p.key}
                planKey={p.key}
                label={p.label}
                badge={p.badge}
                badgeBg={p.badgeBg}
                price={price}
                period={period}
                cta={p.cta}
                isActivePlan={activePlanKey === p.key}
                onSelect={() => handleSelectPlan(p.key)}
                onShowModels={() => setShowModelsModal(true)}
              />
            )
          })}
        </div>

        <PlanComparison period={period} onSelectPlan={handleSelectPlan} currentPlan={activePlanKey} />
      </div>

      {showPayment && payPlanInfo && (
        <PaymentOverlay
          open
          onClose={() => setShowPayment(false)}
          amount={payPrice}
          label={`Black Mount ${payPlanInfo.label}`}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <AnimatePresence>
        {showModelsModal && <ModelsOverlay onClose={() => setShowModelsModal(false)} />}
      </AnimatePresence>
    </div>
  )
}

function SubscriptionHeader({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  return (
    <div className="text-center mb-8 flex flex-col items-center">
      <h1 className="font-manrope font-extrabold text-[36px] text-white leading-[1.1] mb-3 tracking-tight">
        Выберите свою <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#888ae5] to-[#c4b5fd]">мощность генераций</span>
      </h1>
      <p className="font-manrope text-[14px] text-[rgba(255,255,255,0.5)] max-w-[500px] leading-relaxed mb-7">
        Откройте доступ к лучшим нейросетям мира. Одна подписка — все возможности: тексты, код, изображения и видео.
      </p>
      <div className="w-[260px]">
        <AnimatedToggle<Period>
          options={[
            { key: 'month', label: 'Месяц' },
            { key: 'year', label: 'Год', badge: '-15%' },
          ]}
          value={period}
          onChange={onPeriodChange}
          size="sm"
        />
      </div>
    </div>
  )
}

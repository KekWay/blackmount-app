'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import type { SubscriptionTier } from '@/types'
import { PaymentOverlay } from '@/components/shared/payment-overlay'
import { type Plan, type Period, plansArr, planFeatures } from './subscription-data'
import { SubscriptionPlanCard } from './subscription-plan-card'
import { PricingComparison } from './subscription-comparison'
import { AllModelsOverlay } from './subscription-models-overlay'

export function SubscriptionPageContent() {
  const router = useRouter()
  const [period, setPeriod] = useState<Period>('month')
  const [showPayment, setShowPayment] = useState(false)
  const [showModelsModal, setShowModelsModal] = useState(false)
  const [payPlan, setPayPlan] = useState<Plan>('pro')
  const addBalance = useBalanceStore((s) => s.addBalance)
  const addOperation = useBalanceStore((s) => s.addOperation)
  const setSubscription = useSubscriptionStore((s) => s.setSubscription)
  const hasActiveSub = useSubscriptionStore((s) => s.hasActiveSubscription())

  const activePlanKey: string | null = hasActiveSub
    ? (() => { try { return localStorage.getItem('active_plan_key'); } catch { return null; } })()
    : null

  const selectedPlan = plansArr.find((p) => p.key === payPlan)
  const selectedPrice = selectedPlan ? (period === 'month' ? selectedPlan.priceMonth : selectedPlan.priceYear) : 0

  return (
    <motion.div className="fixed inset-0 z-[150] bg-[#0d0c13] overflow-y-auto chat-scrollbar" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

      <button onClick={() => router.push('/profile')} className="fixed top-[20px] left-[20px] z-[200] flex items-center gap-[10px] bg-[rgba(13,12,19,0.8)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.06)] px-[16px] py-[10px] rounded-[16px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.05)]">
        <Image src="/assets/models/arrow_left_icon.png" alt="" width={14} height={14} className="brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity" /><span className="font-manrope font-bold text-[14px]">В профиль</span>
      </button>

      <div className="max-w-[900px] mx-auto py-[32px] md:py-[48px] px-[16px] md:px-[20px] relative z-10 flex flex-col items-center">
        <div className="text-center mb-[32px] flex flex-col items-center">
          <h1 className="font-manrope font-extrabold text-[24px] md:text-[36px] text-white leading-[1.1] mb-[28px] tracking-tight">
            Выберите свой план
          </h1>
          <div className="w-[260px]">
            <AnimatedToggle<Period> options={[{ key: 'month', label: 'Месяц' }, { key: 'year', label: 'Год', badge: '-15%' }]} value={period} onChange={setPeriod} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] w-full mb-[16px]">
          {plansArr.filter(p => p.key !== 'free').map((p) => (
            <SubscriptionPlanCard key={p.key} planKey={p.key as Plan} label={p.label} priceMonth={p.priceMonth} priceYear={p.priceYear} badge={p.badge} cta={p.cta} period={period} isActive={activePlanKey === p.key} onSelect={() => { setPayPlan(p.key as Plan); setShowPayment(true) }} />
          ))}
        </div>

        <PricingComparison period={period} onSelectPlan={(p) => { setPayPlan(p); setShowPayment(true) }} currentPlan={activePlanKey} />
      </div>

      {showPayment && selectedPlan && (
        <PaymentOverlay open={true} onClose={() => setShowPayment(false)} amount={selectedPrice} label={`Black Mount ${selectedPlan.label}`} onSuccess={() => {
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + (period === 'month' ? 1 : 12))
          setSubscription(payPlan as SubscriptionTier, expiresAt.toISOString())
          try { localStorage.setItem('active_plan_key', payPlan) } catch {}
          const coins = planFeatures[payPlan].coins
          addBalance(coins)
          addOperation('topup', `Подписка ${selectedPlan.label}: ${coins} айкоинов`, coins)
          setShowPayment(false)
        }} />
      )}

      <AnimatePresence>
        {showModelsModal && <AllModelsOverlay onClose={() => setShowModelsModal(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}

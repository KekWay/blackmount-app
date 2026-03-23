'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
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
    <motion.div className="fixed inset-0 z-[150] bg-[#0d0c13] overflow-y-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[50%] bg-[#888ae5] opacity-[0.05] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#a03c8c] opacity-[0.05] blur-[150px] pointer-events-none" />

      <button onClick={() => router.push('/profile')} className="fixed top-[20px] left-[20px] z-[200] flex items-center gap-[10px] bg-[rgba(13,12,19,0.8)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.06)] px-[16px] py-[10px] rounded-[16px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.05)]">
        <ArrowLeft size={18} /><span className="font-manrope font-bold text-[14px]">В профиль</span>
      </button>

      <div className="max-w-[900px] mx-auto py-[32px] md:py-[48px] px-[16px] md:px-[20px] relative z-10 flex flex-col items-center">
        <div className="text-center mb-[32px] flex flex-col items-center">
          <h1 className="font-manrope font-extrabold text-[24px] md:text-[36px] text-white leading-[1.1] mb-[12px] tracking-tight">
            Выберите свою <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#888ae5] to-[#c4b5fd]">мощность генераций</span>
          </h1>
          <p className="font-manrope text-[14px] text-[rgba(255,255,255,0.5)] max-w-[500px] leading-relaxed mb-[28px]">Откройте доступ к лучшим нейросетям мира. Одна подписка — все возможности: тексты, код, изображения и видео.</p>
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
          setSubscription(payPlan === 'max' ? 'ultra' : 'pro', expiresAt.toISOString())
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

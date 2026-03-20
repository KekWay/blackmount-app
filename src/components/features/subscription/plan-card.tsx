'use client'

import Image from 'next/image'
import { Check, Crown, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type Plan, type Period, planFeatures, featureIconMap, COIN_IMG, MODEL_LOGOS } from './subscription-data'
import { PlanCardFeatures } from './plan-card-features'

interface PlanCardProps {
  planKey: Plan
  label: string
  badge: string | null
  badgeBg: string
  price: number
  period: Period
  cta: string
  isActivePlan: boolean
  onSelect: () => void
  onShowModels: () => void
}

export function PlanCard({ planKey, label, badge, badgeBg, price, period, cta, isActivePlan, onSelect, onShowModels }: PlanCardProps) {
  const isPro = planKey === 'pro'
  const pf = planFeatures[planKey]
  const p = { priceMonth: planKey === 'basic' ? 499 : planKey === 'pro' ? 999 : 1799 }

  return (
    <div className={`rounded-[20px] p-[24px] flex flex-col transition-all duration-500 relative group ${
      isPro
        ? 'bg-[#181726] border-2 border-[#888ae5]/40 shadow-[0_24px_80px_rgba(136,138,229,0.15)] transform scale-[1.02] z-10'
        : 'bg-[#14131c] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.02)]'
    }`}>
      {isPro && (
        <>
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#888ae5]/15 blur-[50px] pointer-events-none rounded-full" />
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#888ae5] to-transparent opacity-80" />
        </>
      )}

      <div className="flex items-start justify-between mb-[16px] relative z-10">
        <span className={`font-manrope font-black text-[20px] ${isPro ? 'text-white' : 'text-[rgba(255,255,255,0.9)]'}`}>{label}</span>
        {badge && (
          <div
            className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[9px] font-manrope font-extrabold uppercase tracking-widest ${isPro ? 'text-white shadow-[0_0_12px_rgba(255,210,49,0.2)]' : 'bg-white/10 text-white'}`}
            style={isPro ? { backgroundImage: badgeBg } : undefined}
          >
            {isPro && <Crown size={10} strokeWidth={2.5} />}
            {badge}
          </div>
        )}
      </div>

      <div className="flex items-end gap-[4px] mb-[4px] relative z-10 h-[40px]">
        <AnimatePresence mode="wait">
          <motion.span key={`${planKey}-${period}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="font-manrope font-black text-[32px] text-white leading-none">
            {price.toLocaleString('ru-RU')}{'\u20BD'}
          </motion.span>
        </AnimatePresence>
        <span className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.4)] mb-[4px]">/ мес</span>
      </div>
      <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] mb-[20px] relative z-10 h-[16px]">
        {period === 'year' ? `Вы экономите ${(p.priceMonth * 12 - price * 12).toLocaleString('ru-RU')}\u20BD в год` : 'Оплата ежемесячно'}
      </p>

      {isActivePlan ? (
        <div className="w-full py-[12px] rounded-[12px] font-manrope font-bold text-[14px] relative z-10 mb-[24px] flex items-center justify-center gap-[8px] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.08)]">
          <Check size={16} />Текущая подписка
        </div>
      ) : (
        <button onClick={onSelect} className={`w-full py-[12px] rounded-[12px] font-manrope font-bold text-[14px] transition-all cursor-pointer relative z-10 mb-[24px] flex items-center justify-center gap-[8px] ${
          isPro ? 'bg-[#888ae5] text-white hover:bg-[#9a9cf0] hover:scale-[1.02] shadow-[0_8px_20px_rgba(136,138,229,0.3)]' : 'bg-[#39375b] text-white hover:bg-[#464470] hover:scale-[1.02]'
        }`}>{cta}</button>
      )}

      <div className="flex items-center justify-center gap-[6px] mb-[20px] relative z-10 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] px-[14px] py-[12px] rounded-[12px]">
        <p className="font-manrope font-black text-[18px] text-white flex items-center gap-[6px]">
          {pf.coins.toLocaleString('ru-RU')}
          <span className="text-[14px] text-[rgba(255,255,255,0.5)] font-medium">айкоинов</span>
        </p>
        <Image src={COIN_IMG} alt="" width={24} height={24} className="shrink-0 drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]" />
      </div>

      <PlanCardFeatures pf={pf} isPro={isPro} onShowModels={onShowModels} />
    </div>
  )
}

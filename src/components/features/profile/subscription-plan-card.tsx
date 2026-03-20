'use client'

import { Crown, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { planFeatures, featureIconMap, IMG_COIN, IMG_BULLET_ICON, IMG_CHATGPT_COLOR, IMG_CLAUDE_COLOR, IMG_GEMINI_COLOR, IMG_FLUX_COLOR, type Plan, type Period } from './profile-data'
import { plansArr } from './profile-data'

export function SubscriptionPlanCard({ p, period, onBuy, onShowModels }: {
  p: typeof plansArr[number]
  period: Period
  onBuy: () => void
  onShowModels: () => void
}) {
  const pf = planFeatures[p.key]
  const price = period === 'month' ? p.priceMonth : p.priceYear
  const yearTotal = period === 'month' ? p.yearTotalMonth : p.yearTotalYear
  const isPro = p.key === 'pro'

  return (
    <div
      className={`rounded-[20px] p-[24px] flex flex-col transition-all duration-300 relative overflow-hidden group ${
        isPro
          ? 'bg-[#1d1c29] shadow-[0_4px_32px_rgba(136,138,229,0.15)] ring-1 ring-[#888ae5]/30'
          : 'bg-[#181722] hover:bg-[rgba(255,255,255,0.02)]'
      }`}
    >
      {isPro && <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#888ae5]/10 blur-[50px] pointer-events-none rounded-full" />}
      <PlanHeader label={p.label} badge={p.badge} isPro={isPro} />
      <PlanPrice price={price} yearTotal={yearTotal} period={period} planKey={p.key} />
      <button
        onClick={onBuy}
        className={`w-full py-[12px] rounded-[12px] font-manrope font-bold leading-[21px] text-[14px] transition-all cursor-pointer relative z-10 mb-[24px] ${
          isPro
            ? 'bg-[#888ae5] text-white hover:bg-[#9a9cf0] shadow-[0_4px_16px_rgba(136,138,229,0.2)] hover:shadow-[0_6px_20px_rgba(136,138,229,0.3)]'
            : 'bg-[#39375b] text-white hover:bg-[#474571] shadow-[0_4px_16px_rgba(57,55,91,0.2)] hover:shadow-[0_6px_20px_rgba(57,55,91,0.3)]'
        }`}
      >
        {p.cta}
      </button>
      <div className="flex items-center gap-[8px] mb-[16px] relative z-10 bg-[rgba(141,0,0,0.03)] border border-[rgba(248,196,6,0.1)] px-[12px] py-[8px] rounded-[10px]">
        <div className="relative shrink-0 size-[18px]">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
        </div>
        <p className="bg-clip-text bg-gradient-to-r from-[#e4c02f] from-[30%] via-[#c79100] via-[56%] to-[#da9319] to-[92%] font-manrope font-extrabold text-[13px] text-transparent leading-[18px] whitespace-nowrap">
          {pf.coins.toLocaleString('ru-RU')} айкоинов / мес
        </p>
      </div>
      <PlanFeaturesList features={pf} onShowModels={onShowModels} />
    </div>
  )
}

function PlanHeader({ label, badge, isPro }: { label: string; badge: string | null; isPro: boolean }) {
  return (
    <div className="flex items-start justify-between mb-[16px] relative z-10">
      <div className="flex flex-col gap-[6px]">
        <span className="font-manrope font-bold text-[20px] text-white leading-none">{label}</span>
      </div>
      {badge && (
        <div
          className={`flex items-center gap-[4px] px-[10px] py-[4px] rounded-[6px] text-[10px] leading-[15px] font-manrope font-extrabold uppercase tracking-[0.5px] ${isPro ? 'text-white shadow-[0_0_12px_rgba(255,210,49,0.3)]' : 'bg-white/10 text-white'}`}
          style={isPro ? { backgroundImage: 'linear-gradient(106.083deg, rgb(255, 210, 49) 4.51%, rgb(192, 150, 0) 54.14%, rgb(238, 161, 16) 86.39%)' } : undefined}
        >
          {isPro && <Crown size={12} strokeWidth={2.5} />}
          {badge}
        </div>
      )}
    </div>
  )
}

function PlanPrice({ price, yearTotal, period, planKey }: { price: number; yearTotal: number; period: Period; planKey: string }) {
  return (
    <>
      <div className="flex items-baseline gap-[6px] mb-[4px] relative z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${planKey}-${period}`}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
            className="font-manrope font-black text-[32px] text-white leading-none"
          >
            {price.toLocaleString('ru-RU')}{'\u20BD'}
          </motion.span>
        </AnimatePresence>
        <span className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.4)]">/ мес</span>
      </div>
      <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] mb-[24px] relative z-10">
        {yearTotal.toLocaleString('ru-RU')}{'\u20BD'} в год при оплате {period === 'month' ? 'за месяц' : 'сразу за год'}
      </p>
    </>
  )
}

function PlanFeaturesList({ features, onShowModels }: { features: typeof planFeatures['basic']; onShowModels: () => void }) {
  return (
    <div className="flex flex-col gap-[14px] flex-1 relative z-10">
      {features.limits.map((lim, i) => (
        <div key={`lim-${i}`} className="flex items-start gap-[10px]">
          <div className="mt-[2px] shrink-0 size-[14px] relative">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full opacity-60" src={IMG_BULLET_ICON} />
          </div>
          <span className="font-manrope text-[13px] text-[rgba(255,255,255,0.6)] leading-[18px]">{lim}</span>
        </div>
      ))}
      <div className="w-full h-px bg-[rgba(255,255,255,0.04)] my-[4px]" />
      {features.features.map((feat, i) => {
        const isAllModels = feat.text === 'Доступ ко всем моделям'
        const isAccent = feat.text.includes('Бесплатно') || isAllModels
        return (
          <div key={`feat-${i}`} className={`flex flex-col gap-[8px] ${isAllModels ? 'bg-[#888ae5]/10 p-[12px] rounded-[10px] border border-[#888ae5]/20 -mx-[12px] relative overflow-hidden' : ''}`}>
            {isAllModels && <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-[#888ae5]/5 to-transparent pointer-events-none" />}
            <div className="flex items-start gap-[10px] relative z-10">
              <div className="mt-[1px] shrink-0 size-[16px] relative">
                <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={featureIconMap[feat.icon]} />
              </div>
              <span className={`font-manrope text-[13px] leading-[18px] ${isAllModels ? 'text-white font-bold' : isAccent ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.6)]'}`}>
                {feat.text}
                {feat.bold && <span className={isAccent ? 'text-[#888ae5] font-bold' : 'text-white font-medium'}>{feat.bold}</span>}
              </span>
            </div>
            {isAllModels && (
              <div className="flex items-center gap-[4px] pl-[26px] relative z-10 mt-[2px]">
                <div className="flex -space-x-[6px]">
                  {[IMG_CHATGPT_COLOR, IMG_CLAUDE_COLOR, IMG_GEMINI_COLOR, IMG_FLUX_COLOR].map((logo, idx) => (
                    <div key={idx} className="w-[24px] h-[24px] rounded-full bg-[#252336] border border-[#888ae5]/25 p-[3px] flex items-center justify-center relative z-10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      <img src={logo} alt="Model" className="w-full h-full object-contain" style={(idx === 0 || idx === 3) ? { filter: 'brightness(0) invert(1)' } : undefined} />
                    </div>
                  ))}
                </div>
                <button onClick={(e) => { e.stopPropagation(); onShowModels(); }} className="ml-[4px] size-[24px] rounded-full flex items-center justify-center bg-[#888ae5]/15 hover:bg-[#888ae5]/30 transition-colors cursor-pointer border border-[#888ae5]/25" title="Смотреть все модели">
                  <Info size={13} className="text-[#888ae5]" />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

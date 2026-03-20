'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Check, Crown } from 'lucide-react'
import { type Plan, type Period, planFeatures, featureIconMap, modelLogos, imgCoin } from './subscription-data'

interface PlanCardProps {
  planKey: Plan
  label: string
  priceMonth: number
  priceYear: number
  badge: string | null
  cta: string
  period: Period
  isActive: boolean
  onSelect: () => void
}

export function SubscriptionPlanCard({ planKey, label, priceMonth, priceYear, badge, cta, period, isActive, onSelect }: PlanCardProps) {
  const pf = planFeatures[planKey]
  const price = period === 'month' ? priceMonth : priceYear
  const isPro = planKey === 'pro'

  return (
    <div className={`rounded-[20px] p-[24px] flex flex-col transition-all duration-500 relative group ${isPro ? 'bg-[#181726] border-2 border-[#888ae5]/40 shadow-[0_24px_80px_rgba(136,138,229,0.15)] transform scale-[1.02] z-10' : 'bg-[#14131c] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.02)]'}`}>
      {isPro && (<><div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#888ae5]/15 blur-[50px] pointer-events-none rounded-full" /><div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#888ae5] to-transparent opacity-80" /></>)}

      <div className="flex items-start justify-between mb-[16px] relative z-10">
        <span className={`font-manrope font-black text-[20px] ${isPro ? 'text-white' : 'text-[rgba(255,255,255,0.9)]'}`}>{label}</span>
        {badge && (
          <div className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[9px] font-manrope font-extrabold uppercase tracking-widest ${isPro ? 'text-white shadow-[0_0_12px_rgba(255,210,49,0.2)]' : 'bg-white/10 text-white'}`} style={isPro ? { backgroundImage: 'linear-gradient(106.083deg, rgb(255, 210, 49) 4.51%, rgb(192, 150, 0) 54.14%, rgb(238, 161, 16) 86.39%)' } : undefined}>
            {isPro && <Crown size={10} strokeWidth={2.5} />}{badge}
          </div>
        )}
      </div>

      <div className="flex items-end gap-[4px] mb-[4px] relative z-10 h-[40px]">
        <AnimatePresence mode="wait">
          <motion.span key={`${planKey}-${period}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="font-manrope font-black text-[32px] text-white leading-[1]">
            {price.toLocaleString('ru-RU')}₽
          </motion.span>
        </AnimatePresence>
        <span className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.4)] mb-[4px]">/ мес</span>
      </div>
      <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] mb-[20px] relative z-10 h-[16px]">
        {period === 'year' ? `Вы экономите ${(priceMonth * 12 - priceYear * 12).toLocaleString('ru-RU')}₽ в год` : 'Оплата ежемесячно'}
      </p>

      {isActive ? (
        <div className="w-full py-[12px] rounded-[12px] font-manrope font-bold text-[14px] relative z-10 mb-[24px] flex items-center justify-center gap-[8px] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.08)]"><Check size={16} />Текущая подписка</div>
      ) : (
        <button onClick={onSelect} className={`w-full py-[12px] rounded-[12px] font-manrope font-bold text-[14px] transition-all cursor-pointer relative z-10 mb-[24px] flex items-center justify-center gap-[8px] ${isPro ? 'bg-[#888ae5] text-white hover:bg-[#9a9cf0] hover:scale-[1.02] shadow-[0_8px_20px_rgba(136,138,229,0.3)]' : 'bg-[#39375b] text-white hover:bg-[#464470] hover:scale-[1.02]'}`}>{cta}</button>
      )}

      <div className="flex items-center justify-center gap-[6px] mb-[20px] relative z-10 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] px-[14px] py-[12px] rounded-[12px]">
        <p className="font-manrope font-black text-[18px] text-white flex items-center gap-[6px]">{pf.coins.toLocaleString('ru-RU')}<span className="text-[14px] text-[rgba(255,255,255,0.5)] font-medium">айкоинов</span></p>
        <div className="relative shrink-0 size-[24px]"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]" src={imgCoin} /></div>
      </div>

      <div className="flex flex-col gap-[12px] flex-1 relative z-10">
        {pf.limits.map((lim, i) => (
          <div key={`lim-${i}`} className="flex items-center gap-[8px]">
            <div className="shrink-0 size-[16px] rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center"><Check size={10} className={isPro ? 'text-[#888ae5]' : 'text-[rgba(255,255,255,0.5)]'} /></div>
            <span className={`font-manrope text-[13px] ${isPro ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.7)]'}`}>{lim}</span>
          </div>
        ))}
        <div className="w-full h-px bg-[rgba(255,255,255,0.06)] my-[4px]" />
        {pf.features.map((feat, i) => {
          const isAllModels = feat.text === 'Доступ ко всем моделям'
          const isAccent = feat.text.includes('Бесплатно') || isAllModels
          return (
            <div key={`feat-${i}`} className={`flex flex-col gap-[8px] ${isAllModels ? 'bg-[#888ae5]/10 p-[10px] rounded-[10px] border border-[#888ae5]/20 -mx-[10px] relative overflow-hidden' : ''}`}>
              {isAllModels && <div className="absolute right-0 top-0 bottom-0 w-[80px] bg-gradient-to-l from-[#888ae5]/10 to-transparent pointer-events-none" />}
              <div className="flex items-start gap-[8px] relative z-10">
                <div className="mt-[2px] shrink-0 size-[16px] relative"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={featureIconMap[feat.icon]} /></div>
                <span className={`font-manrope text-[12px] leading-[18px] ${isAllModels ? 'text-white font-bold' : isAccent ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'}`}>
                  {feat.text}{feat.bold && <span className={isAccent ? 'text-[#888ae5] font-bold' : 'text-white font-bold'}>{feat.bold}</span>}
                </span>
              </div>
              {isAllModels && (
                <div className="flex items-center gap-[6px] pl-[24px] relative z-10 mt-[2px]">
                  <div className="flex -space-x-[4px]">
                    {modelLogos.map((logo, idx) => (
                      <div key={idx} className="w-[20px] h-[20px] rounded-full bg-[#252336] border border-[#888ae5]/30 p-[3px] flex items-center justify-center relative z-10 shadow-[0_4px_8px_rgba(0,0,0,0.4)]" style={{ zIndex: 10 - idx }}>
                        <img src={logo} alt="" className="w-full h-full object-contain" style={(idx === 0 || idx === 3) ? { filter: 'brightness(0) invert(1)' } : undefined} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

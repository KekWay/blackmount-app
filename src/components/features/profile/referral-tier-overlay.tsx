'use client'

import { X } from 'lucide-react'
import { motion } from 'motion/react'
import type { TierInfo } from './referral-data'
import { TierRing } from './tier-ring'

export function ReferralTierOverlay({ onClose, tiers, activeTier, currentTier, nextTier, tierProgress }: {
  onClose: () => void
  tiers: TierInfo[]
  activeTier: number
  currentTier: TierInfo
  nextTier: TierInfo | undefined
  tierProgress: number
}) {
  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-sm p-[16px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#181722] rounded-[24px] w-[520px] max-w-full max-h-[90vh] overflow-y-auto chat-scrollbar border border-[#888ae5]/20 shadow-[0_12px_48px_rgba(0,0,0,0.4)]" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <div className="px-[24px] sm:px-[32px] py-[24px] sm:py-[32px]">
          <div className="flex items-center justify-between mb-[24px]">
            <p className="font-manrope font-bold text-[22px] text-white">Система уровней</p>
            <button onClick={onClose} className="text-[rgba(255,255,255,0.4)] hover:text-white bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer"><X size={18} /></button>
          </div>

          <TierCurrentHighlight currentTier={currentTier} nextTier={nextTier} tierProgress={tierProgress} />

          <p className="font-manrope font-bold text-[14px] text-[rgba(255,255,255,0.5)] mb-[16px]">Все уровни</p>
          <div className="flex flex-col gap-[10px]">
            {tiers.map((t, i) => (
              <div key={i} className="rounded-[16px] px-[20px] py-[14px] flex items-center justify-between border transition-all" style={{ background: i === activeTier ? `${t.color}15` : 'rgba(255,255,255,0.02)', borderColor: i === activeTier ? `${t.color}44` : 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center justify-center size-[36px]">{t.icon}</div>
                  <div>
                    <div className="flex items-center gap-[8px]">
                      <p className="font-manrope font-bold text-[15px]" style={{ color: i <= activeTier ? 'white' : 'rgba(255,255,255,0.4)' }}>{t.label}</p>
                      {i === activeTier && <span className="font-manrope font-bold text-[9px] px-[6px] py-[2px] rounded-[4px] bg-[rgba(107,192,133,0.15)] text-[#6bc085] uppercase tracking-wider">Текущий</span>}
                    </div>
                    <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.4)] mt-[2px]">{t.minRefs === 0 ? 'Стартовый уровень' : `от ${t.minRefs} рефералов`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-manrope font-black text-[22px]" style={{ color: t.color }}>{t.rate}</p>
                  <p className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mt-[2px]">комиссия</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[24px] rounded-[16px] bg-[#121118]/50 border border-[#888ae5]/10 px-[20px] py-[16px]">
            <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)] leading-[18px]">
              Уровень определяется количеством активных рефералов. Процент начисляется автоматически с каждой покупки пакета айкоинов или оформления подписки вашими рефералами. Повышение уровня происходит мгновенно.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TierCurrentHighlight({ currentTier, nextTier, tierProgress }: { currentTier: TierInfo; nextTier: TierInfo | undefined; tierProgress: number }) {
  return (
    <div className="rounded-[16px] px-[24px] py-[20px] mb-[24px] border relative overflow-hidden" style={{ borderColor: `${currentTier.color}40`, background: `linear-gradient(135deg, ${currentTier.color}15, transparent)` }}>
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 80% 20%, ${currentTier.color}, transparent 70%)` }} />
      <div className="relative z-[1] flex items-center gap-[20px]">
        <div className="relative shrink-0 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
          <TierRing progress={tierProgress} color={currentTier.color} size={84} strokeWidth={5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-manrope font-black text-[24px]" style={{ color: currentTier.color, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{currentTier.rate}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-[10px] mb-[6px]">
            <div className="size-[24px] flex items-center justify-center drop-shadow-sm">{currentTier.icon}</div>
            <p className="font-manrope font-bold text-[18px] text-white">Ваш уровень: {currentTier.label}</p>
          </div>
          <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.6)] leading-[18px]">
            Вы получаете {currentTier.rate} с каждой покупки пакетов айкоинов и подписок, совершённых вашими рефералами.
          </p>
          {nextTier && (
            <div className="flex items-center gap-[10px] mt-[12px]">
              <div className="flex-1 h-[6px] bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden inset-shadow-sm">
                <motion.div className="h-full rounded-full relative" style={{ background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})` }} initial={{ width: 0 }} animate={{ width: `${tierProgress}%` }} transition={{ duration: 1 }}>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -skew-x-12 w-[20px] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <span className="font-manrope font-bold text-[11px] shrink-0" style={{ color: nextTier.color }}>12/{nextTier.minRefs} до {nextTier.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

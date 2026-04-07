'use client'

import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  TrendingUp, TrendingDown, ChevronDown,
} from 'lucide-react'
import { APP_ASSETS } from '@/lib/assets'
import type { LeaderboardModel } from '@/data/leaderboard'
import { ScoreRing } from './score-ring'
import { ScalesIcon } from './scales-icon'
import { RatingModelIcon } from './rating-model-icon'
import { ModelCardExpanded } from './model-card-expanded'

const imgMedal1 = '/assets/models/medal-1.png'
const imgMedal2 = '/assets/models/medal-2.png'
const imgMedal3 = '/assets/models/medal-3.png'

export interface ModelCardProps {
  item: LeaderboardModel
  rank: number
  expanded: boolean
  onToggle: () => void
  delay: number
  balance: number
  onlyAffordable: boolean
  isComparing: boolean
  onToggleCompare: () => void
  onOpenChat: (item: LeaderboardModel) => void
}

export const RatingModelCard = forwardRef<HTMLDivElement, ModelCardProps>(
  function RatingModelCard({ item, rank, expanded, onToggle, delay, balance, onlyAffordable, isComparing, onToggleCompare, onOpenChat }, ref) {
    const isTop3 = rank <= 3
    const medals = ['', '#FFD700', '#C0C0C0', '#CD7F32']
    const medalColor = isTop3 ? medals[rank] : undefined

    return (
      <motion.div ref={ref} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay, duration: 0.35, type: 'spring', bounce: 0.2 }}>
        <div
          className={`relative rounded-[16px] overflow-hidden transition-all duration-300 cursor-pointer group ${expanded ? "bg-[rgba(255,255,255,0.06)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/10" : isComparing ? "bg-[rgba(136,138,229,0.08)] ring-1 ring-[#888ae5]/50" : "bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:-translate-y-[2px] hover:shadow-lg"} ${onlyAffordable && item.price > balance ? "opacity-50 grayscale-[0.5]" : ""}`}
          onClick={onToggle}
        >
          {isTop3 && !expanded && (
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: `linear-gradient(to bottom, ${medalColor}, transparent)` }} />
          )}
          <ModelCardCompact item={item} rank={rank} isTop3={isTop3} medalColor={medalColor} expanded={expanded} isComparing={isComparing} onToggleCompare={onToggleCompare} />
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                <ModelCardExpanded item={item} onOpenChat={onOpenChat} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  },
)

function ModelCardCompact({ item, rank, isTop3, medalColor, expanded, isComparing, onToggleCompare }: {
  item: LeaderboardModel; rank: number; isTop3: boolean; medalColor: string | undefined; expanded: boolean; isComparing: boolean; onToggleCompare: () => void
}) {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-[12px] px-[16px] py-[12px]">
      <div className="flex items-center gap-[12px] w-full md:w-auto md:min-w-[240px]">
        <div className="w-[30px] shrink-0 flex items-center justify-center">
          {isTop3 ? (
            <div className="size-[30px] rounded-[8px] flex items-center justify-center shadow-lg" style={{ backgroundColor: `${medalColor}15`, border: `1px solid ${medalColor}30` }}>
              {rank === 1 && <div className="w-[16px] h-[16px]" style={{ backgroundColor: medalColor, maskImage: `url('${imgMedal1}')`, WebkitMaskImage: `url('${imgMedal1}')`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />}
              {rank === 2 && <div className="w-[16px] h-[16px]" style={{ backgroundColor: medalColor, maskImage: `url('${imgMedal2}')`, WebkitMaskImage: `url('${imgMedal2}')`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />}
              {rank === 3 && <div className="w-[16px] h-[16px]" style={{ backgroundColor: medalColor, maskImage: `url('${imgMedal3}')`, WebkitMaskImage: `url('${imgMedal3}')`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />}
            </div>
          ) : (
            <span className="text-[16px] text-[rgba(255,255,255,0.2)] font-black">{rank}</span>
          )}
        </div>
        <div className="flex items-center gap-[10px]">
          <RatingModelIcon item={item} size={36} />
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-white truncate flex items-center gap-1.5">
              {item.name}
              {item.trend > 0 && <span className="flex items-center text-[#4ade80] text-[9px] bg-[#4ade80]/10 px-1 py-[1px] rounded"><TrendingUp size={8} className="mr-[2px]" />{item.trend}%</span>}
              {item.trend < 0 && <span className="flex items-center text-[#ef4444] text-[9px] bg-[#ef4444]/10 px-1 py-[1px] rounded"><TrendingDown size={8} className="mr-[2px]" />{item.trend}%</span>}
            </span>
            <span className="text-[11px] text-[rgba(255,255,255,0.4)] font-medium mt-[1px]">
              {item.category === 'text' ? 'Текст & Код' : item.category === 'image' ? 'Генерация фото' : 'Генерация видео'}
            </span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-[6px] ml-[8px] pl-[12px] border-l border-[rgba(255,255,255,0.06)]">
          <img src="/icons/users_icon.png" alt="" width={13} height={13} className="[filter:brightness(0)_saturate(100%)_invert(55%)_sepia(50%)_saturate(600%)_hue-rotate(210deg)]" />
          <span className="text-[12px] text-[#888ae5] font-bold">{item.usagePercent}%</span>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center gap-[16px] px-[16px] border-l border-r border-[rgba(255,255,255,0.04)]" />
      <div className="flex items-center gap-[16px] ml-auto w-full md:w-auto justify-between md:justify-end mt-3 md:mt-0">
        <div className="flex items-center gap-[12px]">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[2px]">Оценка</span>
            <ScoreRing score={item.score} size={34} strokeWidth={3} />
          </div>
          <div className="flex flex-col items-end bg-[rgba(255,255,255,0.03)] px-[8px] py-[4px] rounded-[8px]">
            <span className="text-[9px] font-bold text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[2px]">Цена</span>
            <div className="flex items-center gap-[4px]">
              <span className="text-[13px] text-white font-bold">{item.price}</span>
              <img alt="" src={APP_ASSETS.coin} className="size-[12px]" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[6px]">
          <button onClick={(e) => { e.stopPropagation(); onToggleCompare() }} className={`px-[12px] py-[8px] rounded-[7px] transition-all flex items-center justify-center ${isComparing ? "bg-[#39375b] text-white shadow-[0_0_16px_rgba(136,138,229,0.3)]" : "bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"}`}>
            <ScalesIcon size={12} />
          </button>
          <div className={`w-[32px] h-[32px] rounded-[7px] flex items-center justify-center transition-all ${expanded ? "bg-[#888ae5] text-white shadow-[0_2px_8px_rgba(136,138,229,0.3)]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] group-hover:bg-[rgba(255,255,255,0.1)] group-hover:text-white"}`}>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={16} /></motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

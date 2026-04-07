'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'
import { ScoreRing } from './score-ring'
import { APP_ASSETS } from '@/lib/assets'
import { SPOTLIGHTS, leaderboardData } from '@/data/leaderboard'
import type { LeaderboardModel } from '@/data/leaderboard'

interface SpotlightCardsProps {
  onNavigate: (item: LeaderboardModel) => void
}

export function SpotlightCards({ onNavigate }: SpotlightCardsProps) {
  const spotlightsRef = useRef<HTMLDivElement>(null)
  const scrollSpotlights = (dir: 'left' | 'right') => {
    if (!spotlightsRef.current) return
    spotlightsRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' })
  }

  return (
    <motion.div className="mb-[32px] relative" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="flex items-center justify-between mb-[12px]">
        <p className="text-[12px] text-[rgba(255,255,255,0.3)] font-manrope uppercase tracking-wider font-bold">Лучшие в категориях</p>
        <div className="flex items-center gap-[6px]">
          <button onClick={() => scrollSpotlights('left')} className="size-[28px] rounded-[8px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <CustomIcon src="/icons/litle_arrow_left.png" size={14} className="opacity-50" />
          </button>
          <button onClick={() => scrollSpotlights('right')} className="size-[28px] rounded-[8px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <CustomIcon src="/icons/litle_arrow_right.png" size={14} className="opacity-50" />
          </button>
        </div>
      </div>
      <div ref={spotlightsRef} className="flex gap-[12px] overflow-x-auto snap-x pb-4 chat-scrollbar [scrollbar-width:none]">
        {SPOTLIGHTS.map((spot) => (
          <SpotlightCard key={spot.title} spot={spot} onNavigate={onNavigate} />
        ))}
      </div>
    </motion.div>
  )
}

function SpotlightCard({ spot, onNavigate }: { spot: typeof SPOTLIGHTS[number]; onNavigate: (item: LeaderboardModel) => void }) {
  return (
    <motion.div
      className="snap-start shrink-0 w-[220px] h-[170px] rounded-[16px] bg-[rgba(255,255,255,0.02)] ring-1 ring-[rgba(255,255,255,0.02)] hover:ring-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={() => {
        const modelData = leaderboardData.find(m => m.name === spot.model)
        if (modelData) onNavigate(modelData)
      }}
    >
      <div className="absolute top-[-32px] left-[50%] -translate-x-1/2 w-[100px] h-[100px] rounded-full blur-[40px] pointer-events-none transition-opacity group-hover:opacity-40 opacity-20" style={{ backgroundColor: spot.color }} />
      <div className="absolute left-[-10px] top-[30px] pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]" style={{ width: 90, height: 90 }}>
        <div className="w-full h-full opacity-[0.25] group-hover:opacity-[0.5] transition-opacity duration-500" style={{
          background: "linear-gradient(135deg, #FFD700 0%, #FFC247 30%, #FFFACD 50%, #FFD700 70%, #DAA520 100%)",
          maskImage: `url('${spot.iconImg}')`, WebkitMaskImage: `url('${spot.iconImg}')`,
          maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center', WebkitMaskPosition: 'center',
        }} />
      </div>
      <div className="relative z-10 flex flex-col h-full p-[16px]">
        <p className="text-[14px] text-white font-extrabold ml-[72px] mt-[4px]">{spot.model}</p>
        <div className="ml-[82px] mt-[8px]">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.5px] bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, rgba(200,200,210,0.9) 0%, rgba(160,160,175,0.7) 100%)" }}>
            {spot.title}
          </p>
        </div>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col gap-[1px] ml-[82px]">
            <p className="text-[9px] text-[rgba(255,255,255,0.3)] font-medium">{spot.metric}</p>
            <p className="text-[16px] text-white font-extrabold flex items-center gap-[3px]">{spot.metricValue}{'showCoin' in spot && spot.showCoin && <Image src={APP_ASSETS.coin} alt="айкоин" width={14} height={14} className="shrink-0" />}</p>
          </div>
          <ScoreRing score={spot.score} size={30} strokeWidth={3} color={spot.color} />
        </div>
      </div>
    </motion.div>
  )
}

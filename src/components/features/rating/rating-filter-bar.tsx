'use client'

import { motion } from 'motion/react'
import { ScalesIcon } from './scales-icon'
import { APP_ASSETS } from '@/lib/assets'
import {
  leaderboardData,
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  type CategoryFilter,
  type SortKey,
} from '@/data/leaderboard'

interface RatingFilterBarProps {
  category: CategoryFilter
  setCategory: (c: CategoryFilter) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onlyAffordable: boolean
  setOnlyAffordable: (v: boolean) => void
  sortKey: SortKey
  sortDir: 'desc' | 'asc'
  handleSort: (key: SortKey) => void
  compareIds: string[]
  setCompareIds: (ids: string[]) => void
  setShowCompare: (v: boolean) => void
  setVisibleCount: (fn: (v: number) => number) => void
}

export function RatingFilterBar({
  category, setCategory, searchQuery, setSearchQuery,
  onlyAffordable, setOnlyAffordable, sortKey, sortDir, handleSort,
  compareIds, setCompareIds, setShowCompare, setVisibleCount,
}: RatingFilterBarProps) {
  return (
    <motion.div className="sticky top-[10px] z-30 bg-[#121118]/80 backdrop-blur-[20px] p-[10px] rounded-[16px] border border-[rgba(255,255,255,0.06)] shadow-[0_4px_24px_rgba(0,0,0,0.3)] mb-[20px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="flex items-center gap-[10px] flex-wrap">
        <div className="flex items-center gap-[3px] bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[3px]">
          {CATEGORY_OPTIONS.map((cat) => {
            const count = cat.key === 'all' ? leaderboardData.length : leaderboardData.filter((m) => m.category === cat.key).length
            return (
              <button key={cat.key} onClick={() => { setCategory(cat.key); setVisibleCount(() => 12) }} className={`relative flex items-center gap-[5px] px-[12px] py-[6px] rounded-[7px] text-[10px] font-manrope font-semibold text-center whitespace-nowrap transition-all cursor-pointer ${category === cat.key ? "bg-[#39375b] text-white" : "bg-transparent text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.03)]"}`}>
                <span className="relative z-[1]">{cat.label}</span>
                {category === cat.key && <span className="relative z-[1] opacity-60 ml-[2px]">{count}</span>}
              </button>
            )
          })}
        </div>
        <div className="relative flex-1 min-w-[160px] max-w-[240px]">
          <img src="/assets/models/search-icon.png" alt="" className="absolute left-[10px] top-1/2 -translate-y-1/2 size-[18px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Искать модель..." className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[10px] pl-[30px] pr-[10px] py-[7px] text-[12px] text-white placeholder-[rgba(255,255,255,0.3)] outline-none focus:border-[#888ae5]/50 focus:bg-[rgba(255,255,255,0.06)] transition-all" />
        </div>
        <button onClick={() => setOnlyAffordable(!onlyAffordable)} className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[7px] text-[10px] font-manrope font-semibold text-center whitespace-nowrap transition-all cursor-pointer ${onlyAffordable ? "bg-[#39375b] text-white" : "bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"}`}>
          <img alt="" src={APP_ASSETS.coin} className="size-[12px]" /> Доступные
        </button>
        <div className="ml-auto flex items-center gap-2">
          {compareIds.length > 0 && (
            <button onClick={() => setCompareIds([])} className="text-[11px] font-semibold text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">Сбросить</button>
          )}
          <motion.button
            onClick={() => compareIds.length >= 2 ? setShowCompare(true) : null}
            className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[7px] text-[10px] font-manrope font-semibold text-center whitespace-nowrap transition-all cursor-pointer ${compareIds.length >= 2 ? "bg-[#39375b] text-white shadow-[0_0_16px_rgba(136,138,229,0.3)]" : "bg-[rgba(136,138,229,0.05)] text-[rgba(136,138,229,0.4)]"}`}
            animate={compareIds.length >= 2 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ScalesIcon size={12} />
            Сравнить
            {compareIds.length > 0 && (
              <span className={`text-[9px] px-[4px] py-[1px] rounded-[4px] ml-[2px] ${compareIds.length >= 2 ? "bg-white/20 text-white" : "bg-[#888ae5]/20 text-[#888ae5]"}`}>{compareIds.length}/4</span>
            )}
          </motion.button>
        </div>
      </div>
      <div className="flex items-center gap-[6px] mt-[10px] pt-[10px] border-t border-[rgba(255,255,255,0.06)] overflow-x-auto [scrollbar-width:none]">
        <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase font-bold tracking-wider mr-1">Сортировка:</span>
        {SORT_OPTIONS.map((opt) => (
          <button key={opt.key} onClick={() => handleSort(opt.key)} className={`flex items-center gap-[4px] px-[12px] py-[6px] rounded-[7px] text-[10px] font-manrope font-semibold text-center whitespace-nowrap transition-all cursor-pointer ${sortKey === opt.key ? "bg-[#39375b] text-white" : "bg-transparent text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]"}`}>
            {opt.label}
            {sortKey === opt.key && <span className="ml-[2px] leading-none">{sortDir === "desc" ? "\u2193" : "\u2191"}</span>}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

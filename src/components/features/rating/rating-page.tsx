'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, Search } from 'lucide-react'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore, LOCKED_VERSION_IDS } from '@/stores/subscription'
import { SubscriptionGateModal } from '@/components/shared/subscription-gate'
import {
  leaderboardData,
  RATING_LOCKED_MAP,
  type LeaderboardModel,
  type CategoryFilter,
  type SortKey,
} from '@/data/leaderboard'
import { SpotlightCards } from './spotlight-cards'
import { RatingFilterBar } from './rating-filter-bar'
import { CompareOverlay } from './compare-overlay'
import { RatingModelCard } from './rating-model-card'

function isRatingModelLocked(leaderboardId: string, hasActive: boolean): boolean {
  if (hasActive) return false
  const mapped = RATING_LOCKED_MAP[leaderboardId]
  if (mapped && LOCKED_VERSION_IDS.has(mapped)) return true
  return false
}

export function RatingPage() {
  const router = useRouter()
  const balance = useBalanceStore((s) => s.balance)
  const hasActive = useSubscriptionStore((s) => s.hasActiveSubscription())

  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('usagePercent')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(12)
  const [onlyAffordable, setOnlyAffordable] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [gateModelName, setGateModelName] = useState('')

  const handleRatingNavigate = (item: LeaderboardModel) => {
    if (isRatingModelLocked(item.id, hasActive)) {
      setGateModelName(item.name)
      setGateOpen(true)
      return
    }
    const chatModelId = item.aiModelRef || item.id
    router.push(`/chat/${chatModelId}`)
  }

  const filtered = useMemo(() => {
    let list = [...leaderboardData]
    if (category !== 'all') list = list.filter((m) => m.category === category)
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); list = list.filter((m) => m.name.toLowerCase().includes(q)) }
    if (onlyAffordable) list = list.filter((m) => m.price <= balance)
    return list.sort((a, b) => { const diff = (b[sortKey] as number) - (a[sortKey] as number); return sortDir === 'desc' ? diff : -diff })
  }, [category, sortKey, sortDir, searchQuery, onlyAffordable, balance])

  const visible = filtered.slice(0, visibleCount)
  const handleSort = (key: SortKey) => { if (sortKey === key) setSortDir((d) => d === 'desc' ? 'asc' : 'desc'); else { setSortKey(key); setSortDir('desc') } }
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev)
  }
  const compareModels = leaderboardData.filter((m) => compareIds.includes(m.id))

  return (
    <div className="w-full h-full overflow-y-auto chat-scrollbar bg-[#121118]">
      <div className="w-full max-w-[1100px] mx-auto px-[16px] sm:px-[24px] lg:px-[32px] pt-[24px] pb-[60px]">
        <motion.div className="mb-[24px] relative" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="absolute top-[-40px] right-[15%] w-[250px] h-[250px] bg-[#888ae5] opacity-[0.06] blur-[100px] pointer-events-none rounded-full" />
          <div className="flex items-center gap-[10px] mb-[6px]">
            <h1 className="text-[28px] text-white leading-[36px] font-extrabold">Рейтинг моделей</h1>
          </div>
          <p className="text-[13px] text-[rgba(255,255,255,0.4)] max-w-[600px] leading-relaxed">
            Подробная аналитика и сравнение ИИ-моделей. Выбирайте идеальный инструмент по скорости, точности и стоимости.
          </p>
        </motion.div>
        <SpotlightCards onNavigate={handleRatingNavigate} />
        <RatingFilterBar
          category={category} setCategory={setCategory}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          onlyAffordable={onlyAffordable} setOnlyAffordable={setOnlyAffordable}
          sortKey={sortKey} sortDir={sortDir} handleSort={handleSort}
          compareIds={compareIds} setCompareIds={setCompareIds}
          setShowCompare={setShowCompare} setVisibleCount={setVisibleCount}
        />
        <div className="flex flex-col gap-[8px]">
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <RatingModelCard key={item.id} item={item} rank={i + 1} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} delay={i * 0.04} balance={balance} onlyAffordable={onlyAffordable} isComparing={compareIds.includes(item.id)} onToggleCompare={() => toggleCompare(item.id)} onOpenChat={handleRatingNavigate} />
            ))}
          </AnimatePresence>
        </div>
        {visibleCount < filtered.length && (
          <motion.div className="mt-[20px] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <button onClick={() => setVisibleCount((v) => v + 12)} className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[12px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[13px] text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all cursor-pointer font-bold shadow-sm">
              Загрузить еще ({filtered.length - visibleCount}) <ChevronDown size={14} />
            </button>
          </motion.div>
        )}
        {filtered.length === 0 && (
          <motion.div className="flex flex-col items-center justify-center py-[60px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.02)] flex items-center justify-center mb-[12px]">
              <Search size={24} className="text-[rgba(255,255,255,0.2)]" />
            </div>
            <h3 className="text-[16px] text-white font-bold mb-[6px]">Ничего не найдено</h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.4)]">Попробуйте изменить параметры поиска или фильтры</p>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {showCompare && compareModels.length >= 2 && <CompareOverlay models={compareModels} onClose={() => setShowCompare(false)} />}
      </AnimatePresence>
      <SubscriptionGateModal open={gateOpen} onClose={() => setGateOpen(false)} modelName={gateModelName} />
    </div>
  )
}

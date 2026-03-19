'use client'

import { Trophy } from 'lucide-react'
import type { LeaderboardModel } from '@/data/leaderboard'
import { ModelRankCard } from '@/components/features/rating/model-rank-card'
import type { CategoryFilter, SortKey } from '@/components/features/rating/rating-filters'

interface LeaderboardTableProps {
  models: LeaderboardModel[]
  category: CategoryFilter
  sortKey: SortKey
}

export function LeaderboardTable({ models, category, sortKey }: LeaderboardTableProps) {
  const filtered = models.filter((m) => {
    if (category === 'all') return true
    return m.category === category
  })

  const sorted = [...filtered].sort((a, b) => b[sortKey] - a[sortKey])

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <Trophy size={32} className="mb-3" />
        <p className="text-sm">Нет моделей для отображения</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((model, i) => (
        <ModelRankCard key={model.id} model={model} rank={i + 1} />
      ))}
    </div>
  )
}

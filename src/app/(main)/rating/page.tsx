'use client'

import { useState } from 'react'
import { leaderboardData } from '@/data/leaderboard'
import {
  RatingFilters,
  type CategoryFilter,
  type SortKey,
} from '@/components/features/rating/rating-filters'
import { LeaderboardTable } from '@/components/features/rating/leaderboard-table'

export default function RatingPage() {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('usagePercent')

  return (
    <div className="w-full h-full overflow-y-auto px-6 lg:px-10 pt-8 pb-10">
      <header className="mb-6">
        <h1 className="font-maven font-extrabold text-4xl text-white">Рейтинг моделей</h1>
        <p className="text-[15px] text-white/40 mt-1">
          Сравнение нейросетей по ключевым показателям
        </p>
      </header>

      <div className="mb-6">
        <RatingFilters
          category={category}
          sortKey={sortKey}
          onCategoryChange={setCategory}
          onSortChange={setSortKey}
        />
      </div>

      <LeaderboardTable models={leaderboardData} category={category} sortKey={sortKey} />
    </div>
  )
}

'use client'

import { ChevronDown } from 'lucide-react'

export type CategoryFilter = 'all' | 'text' | 'image' | 'video'
export type SortKey = 'usagePercent' | 'score' | 'speed' | 'accuracy' | 'costEfficiency'

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'Все модели' },
  { key: 'text', label: 'Текст' },
  { key: 'image', label: 'Изображения' },
  { key: 'video', label: 'Видео' },
]

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'usagePercent', label: 'Популярность' },
  { key: 'score', label: 'Оценка' },
  { key: 'speed', label: 'Скорость' },
  { key: 'accuracy', label: 'Точность' },
  { key: 'costEfficiency', label: 'Цена' },
]

interface RatingFiltersProps {
  category: CategoryFilter
  sortKey: SortKey
  onCategoryChange: (c: CategoryFilter) => void
  onSortChange: (s: SortKey) => void
}

export function RatingFilters({
  category,
  sortKey,
  onCategoryChange,
  onSortChange,
}: RatingFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Category tabs */}
      <div className="flex items-center flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => onCategoryChange(c.key)}
            className={`h-9 rounded-xl px-[18px] text-[13px] font-medium transition-colors cursor-pointer ${
              category === c.key
                ? 'bg-[#39375b] text-white'
                : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Sort select */}
      <div className="relative">
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="appearance-none h-9 rounded-xl pl-4 pr-9 text-[13px] font-medium bg-white/[0.04] text-white/60 hover:bg-white/[0.08] transition-colors cursor-pointer border-none outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key} className="bg-[#1a1a2e] text-white">
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
      </div>
    </div>
  )
}

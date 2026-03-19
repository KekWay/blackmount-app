'use client'

export type FilterCategory = 'all' | 'favorites' | 'text' | 'image' | 'video'

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'favorites', label: 'Избранные' },
  { key: 'text', label: 'Текст' },
  { key: 'image', label: 'Изображение' },
  { key: 'video', label: 'Видео' },
]

interface FilterTabsProps {
  activeFilter: FilterCategory
  onFilterChange: (filter: FilterCategory) => void
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`h-9 rounded-xl px-[18px] text-[13px] font-medium transition-colors cursor-pointer ${
            activeFilter === f.key
              ? 'bg-[#39375b] text-white'
              : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

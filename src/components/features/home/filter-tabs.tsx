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
    <div className="flex items-center flex-wrap gap-[8px]">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`h-[35.5px] rounded-[12px] px-[18px] font-manrope font-medium text-[13px] transition-colors cursor-pointer ${
            activeFilter === f.key
              ? 'bg-[#39375b] text-white'
              : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

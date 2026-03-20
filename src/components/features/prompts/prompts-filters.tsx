'use client'

import { useRef } from 'react'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { aiModels } from '@/data/ai-models'
import { ModelIcon } from '@/components/shared/model-icon'
import { themeTags } from './prompts-data'

interface PromptsFiltersProps {
  activeThemeFilter: string
  activeModelFilter: string
  favCount: number
  onThemeChange: (id: string) => void
  onModelChange: (id: string) => void
}

export function PromptsFilters({ activeThemeFilter, activeModelFilter, favCount, onThemeChange, onModelChange }: PromptsFiltersProps) {
  const themeScrollRef = useRef<HTMLDivElement>(null)
  const scrollThemes = (dir: 'left' | 'right') => {
    if (themeScrollRef.current) {
      themeScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
    }
  }

  const modelFilters = [
    { id: 'all', name: 'Все модели' },
    ...aiModels.filter((m) => m.category === 'image' || m.category === 'video'),
  ]

  return (
    <>
      {/* Theme filter chips */}
      <div className="flex items-center gap-[8px] mb-[10px]">
        <button
          onClick={() => scrollThemes('left')}
          className="shrink-0 self-center size-[32px] rounded-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          <ChevronLeft size={14} className="text-[rgba(255,255,255,0.5)]" />
        </button>
        <div ref={themeScrollRef} className="flex gap-[4px] overflow-x-auto flex-1 items-center [scrollbar-width:none]">
          {themeTags.flatMap((tag, idx) => {
            const chips = [
              <button
                key={tag.id}
                onClick={() => onThemeChange(tag.id)}
                className={`shrink-0 rounded-[10px] px-[12px] py-[7px] text-[13px] transition-colors cursor-pointer ${
                  activeThemeFilter === tag.id
                    ? 'bg-[#39375b] text-white'
                    : 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                {tag.label}
              </button>,
            ]
            if (idx === 0) {
              chips.push(
                <button
                  key="favorites"
                  onClick={() => onThemeChange('favorites')}
                  className={`shrink-0 flex items-center gap-[5px] rounded-[10px] px-[12px] py-[7px] text-[13px] transition-colors cursor-pointer ${
                    activeThemeFilter === 'favorites'
                      ? 'bg-[#39375b] text-white'
                      : 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <Heart size={12} fill={activeThemeFilter === 'favorites' ? 'white' : 'none'} />
                  Избранные
                  {favCount > 0 && (
                    <span className="text-[10px] opacity-60">{favCount}</span>
                  )}
                </button>
              )
            }
            return chips
          })}
        </div>
        <button
          onClick={() => scrollThemes('right')}
          className="shrink-0 self-center size-[32px] rounded-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          <ChevronRight size={14} className="text-[rgba(255,255,255,0.5)]" />
        </button>
      </div>

      {/* Model filter chips */}
      <div className="flex gap-[4px] overflow-x-auto pb-[4px] mb-[20px] [scrollbar-width:none]">
        {modelFilters.map((mf) => {
          const isAll = mf.id === 'all'
          return (
            <button
              key={mf.id}
              onClick={() => onModelChange(mf.id)}
              className={`shrink-0 flex items-center gap-[6px] rounded-[10px] px-[14px] py-[7px] text-[13px] transition-colors cursor-pointer ${
                activeModelFilter === mf.id
                  ? 'bg-[#39375b] text-white'
                  : 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              {!isAll && <ModelIcon modelId={mf.id} size={16} />}
              {mf.name}
            </button>
          )
        })}
      </div>
    </>
  )
}

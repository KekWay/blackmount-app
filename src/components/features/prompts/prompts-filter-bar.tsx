'use client'

import { useRef, useEffect, useCallback } from 'react'
import { CustomIcon } from '@/components/shared/custom-icon'
import { promptCategories } from './prompts-data'

interface PromptsFilterBarProps {
  activeCategoryFilter: string
  favCount: number
  onCategoryChange: (id: string) => void
  onOpenOverlay: () => void
  registerScrollToChip: (fn: (id: string) => void) => void
}

export function PromptsFilterBar({
  activeCategoryFilter,
  favCount,
  onCategoryChange,
  onOpenOverlay,
  registerScrollToChip,
}: PromptsFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const hasDragged = useRef(false)

  const scrollToChip = useCallback((id: string) => {
    const chip = chipRefs.current[id]
    const container = scrollRef.current
    if (!chip || !container) return
    const left = chip.offsetLeft - container.offsetLeft - 12
    container.scrollTo({ left, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    registerScrollToChip(scrollToChip)
  }, [registerScrollToChip, scrollToChip])

  const scrollBy = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -200 : 200,
      behavior: 'smooth',
    })
  }

  const onMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current
    if (!container) return
    isDragging.current = true
    hasDragged.current = false
    dragStartX.current = e.pageX - container.offsetLeft
    dragScrollLeft.current = container.scrollLeft
    container.style.cursor = 'grabbing'
    container.style.userSelect = 'none'
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const container = scrollRef.current
    if (!container) return
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = x - dragStartX.current
    if (Math.abs(walk) > 3) hasDragged.current = true
    container.scrollLeft = dragScrollLeft.current - walk
  }

  const onMouseUp = () => {
    isDragging.current = false
    const container = scrollRef.current
    if (container) {
      container.style.cursor = 'grab'
      container.style.userSelect = ''
    }
  }

  useEffect(() => {
    const handleGlobalUp = () => onMouseUp()
    window.addEventListener('mouseup', handleGlobalUp)
    return () => window.removeEventListener('mouseup', handleGlobalUp)
  }, [])

  return (
    <div className="flex items-center gap-[6px] mb-[10px]">
      <button
        onClick={() => scrollBy('left')}
        aria-label="Назад"
        className="group shrink-0 hidden sm:flex bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] rounded-full w-[28px] h-[28px] items-center justify-center transition-colors cursor-pointer"
      >
        <CustomIcon src="/icons/litle_arrow_left.png" size={10} className="opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-[4px] overflow-x-auto [scrollbar-width:none] min-w-0 cursor-grab"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {promptCategories.map((cat) => {
          const isFav = cat.id === 'favorites'
          const isActive = activeCategoryFilter === cat.id
          return (
            <button
              key={cat.id}
              ref={(el) => { chipRefs.current[cat.id] = el }}
              onClick={() => {
                if (hasDragged.current) return
                onCategoryChange(cat.id)
              }}
              className={`shrink-0 flex items-center gap-[5px] rounded-[10px] px-[12px] py-[7px] text-[13px] transition-colors cursor-pointer select-none ${
                isActive
                  ? 'bg-[#39375b] text-white'
                  : 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              {isFav && (
                <img src="/icons/heart_icon.png" alt="" width={12} height={12} className={`brightness-0 invert transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`} />
              )}
              {cat.name}
              {isFav && favCount > 0 && (
                <span className="text-[10px] opacity-60">{favCount}</span>
              )}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => scrollBy('right')}
        aria-label="Вперёд"
        className="group shrink-0 hidden sm:flex bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] rounded-full w-[28px] h-[28px] items-center justify-center transition-colors cursor-pointer"
      >
        <CustomIcon src="/icons/litle_arrow_right.png" size={10} className="opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
      <div className="w-px h-[24px] bg-white/10 shrink-0" />
      <button
        onClick={onOpenOverlay}
        className="group shrink-0 rounded-[10px] px-3 py-1.5 text-[13px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)] flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <CustomIcon src="/icons/menu_icon.png" size={14} className="opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
        <span className="hidden sm:inline">Все разделы</span>
      </button>
    </div>
  )
}

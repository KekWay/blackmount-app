'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { aiModels } from '@/data/ai-models'
import { ModelIcon } from '@/components/shared/model-icon'
import {
  promptCategories,
  categoryGroupLabels,
} from './prompts-data'
import type { PromptCategory } from './prompts-data'

function getHoverImage(cat: PromptCategory): string | null {
  if (cat.images.length === 0) return null
  return cat.images[Math.floor(Math.random() * cat.images.length)]
}

interface PromptsFiltersProps {
  activeCategoryFilter: string
  activeModelFilter: string
  favCount: number
  onCategoryChange: (id: string) => void
  onModelChange: (id: string) => void
}

const groupOrder: PromptCategory['group'][] = ['main', 'trending', 'classic']

const overlayCategories = promptCategories.filter((c) => c.id !== 'all')

function OverlayCategoryItem({
  cat,
  isActive,
  onSelect,
}: {
  cat: PromptCategory
  isActive: boolean
  onSelect: (id: string) => void
}) {
  const [hoverSrc, setHoverSrc] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  const onMouseEnter = () => {
    const src = getHoverImage(cat)
    setHoverSrc(src)
    setImgError(false)
  }

  const showImage = hoverSrc && !imgError

  return (
    <button
      onMouseEnter={onMouseEnter}
      onClick={() => onSelect(cat.id)}
      className={`group relative text-left rounded-lg p-3 overflow-hidden transition-colors cursor-pointer ${
        isActive
          ? 'bg-white/10 ring-1 ring-white/20'
          : ''
      }`}
    >
      {/* Hover image (from images array) */}
      {showImage && (
        <img
          src={hoverSrc}
          alt=""
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        />
      )}

      {/* Gradient fallback when no image */}
      {!showImage && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${cat.accentColor}33 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Text content */}
      <span className="relative z-10 text-sm font-medium text-white block">
        {cat.name}
      </span>
      <span className="relative z-10 text-xs text-white/50 mt-0.5 block">
        {cat.description}
      </span>
    </button>
  )
}

export function PromptsFilters({
  activeCategoryFilter,
  activeModelFilter,
  favCount,
  onCategoryChange,
  onModelChange,
}: PromptsFiltersProps) {
  const [overlayOpen, setOverlayOpen] = useState(false)
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

  const scrollBy = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -200 : 200,
      behavior: 'smooth',
    })
  }

  const handleOverlaySelect = (id: string) => {
    onCategoryChange(id)
    setOverlayOpen(false)
    setTimeout(() => scrollToChip(id), 100)
  }

  /* Mouse drag to scroll */
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

  /* Close overlay on Escape */
  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlayOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [overlayOpen])

  /* Lock body scroll when overlay open */
  useEffect(() => {
    if (overlayOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [overlayOpen])

  const modelFilters = [
    { id: 'all', name: 'Все модели' },
    ...aiModels.filter((m) => m.category === 'image' || m.category === 'video'),
  ]

  return (
    <>
      {/* Category bar: arrows + scrollable chips + fixed button */}
      <div className="flex items-center gap-[6px] mb-[10px]">
        {/* Left arrow */}
        <button
          onClick={() => scrollBy('left')}
          aria-label="Назад"
          className="group shrink-0 hidden sm:flex bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] rounded-full w-[28px] h-[28px] items-center justify-center transition-colors cursor-pointer"
        >
          <CustomIcon src="/icons/litle_arrow_left.png" size={10} className="opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        {/* Scrollable chips */}
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

        {/* Right arrow */}
        <button
          onClick={() => scrollBy('right')}
          aria-label="Вперёд"
          className="group shrink-0 hidden sm:flex bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] rounded-full w-[28px] h-[28px] items-center justify-center transition-colors cursor-pointer"
        >
          <CustomIcon src="/icons/litle_arrow_right.png" size={10} className="opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        {/* Divider */}
        <div className="w-px h-[24px] bg-white/10 shrink-0" />

        {/* "Все разделы" button — no border */}
        <button
          onClick={() => setOverlayOpen(true)}
          className="group shrink-0 rounded-[10px] px-3 py-1.5 text-[13px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CustomIcon src="/icons/menu_icon.png" size={14} className="opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
          <span className="hidden sm:inline">Все разделы</span>
        </button>
      </div>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOverlayOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto chat-scrollbar bg-sidebar border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Все разделы
                </h2>
                <button
                  onClick={() => setOverlayOpen(false)}
                  aria-label="Закрыть"
                  className="group p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Image src="/icons/close_icon.png" alt="" width={14} height={14} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
                </button>
              </div>

              {/* Groups */}
              {groupOrder.map((group, gi) => {
                const items = overlayCategories.filter((c) => c.group === group)
                if (items.length === 0) return null
                return (
                  <div key={group}>
                    <p
                      className={`text-xs uppercase tracking-wider text-white/30 mb-3 ${gi > 0 ? 'mt-5' : ''}`}
                    >
                      {categoryGroupLabels[group]}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[4px]">
                      {items.map((cat) => (
                        <OverlayCategoryItem
                          key={cat.id}
                          cat={cat}
                          isActive={activeCategoryFilter === cat.id}
                          onSelect={handleOverlaySelect}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

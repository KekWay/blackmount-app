'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CustomIcon } from '@/components/shared/custom-icon'
import { motion } from 'motion/react'
import { useClickOutside } from '@/lib/hooks'
import { TEXT_MODELS, IMAGE_MODELS, VIDEO_MODELS } from '@/data/arena-models'
import type { ArenaModel, ArenaCategory } from '@/data/arena-models'
import { useSubscriptionStore } from '@/stores/subscription'
import { ARENA_LOCKED_IDS, FREE_ARENA_IDS, IMG_COIN, IMG_LIGHTNING_MASK } from './arena-data'
import { MIcon } from './arena-micon'

interface Props {
  selectedModels: ArenaModel[]
  onToggle: (m: ArenaModel) => void
  onCategoryChange: (c: ArenaCategory) => void
}

export function ArenaModelDropdown({ selectedModels, onToggle, onCategoryChange }: Props) {
  const [open, setOpen] = useState(false)
  const [filterCat, setFilterCat] = useState<'all' | ArenaCategory>('all')
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const hasSub = useSubscriptionStore((s) => s.hasActiveSubscription())

  useClickOutside([ref, btnRef], useCallback(() => setOpen(false), []))

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left })
    }
  }, [open])

  const allModels = [...TEXT_MODELS, ...IMAGE_MODELS, ...VIDEO_MODELS]
  const filtered = filterCat === 'all' ? allModels : filterCat === 'text' ? TEXT_MODELS : filterCat === 'image' ? IMAGE_MODELS : VIDEO_MODELS

  const isLocked = (id: string) => !hasSub && ARENA_LOCKED_IDS.has(id)

  return (
    <>
      <button ref={btnRef} onClick={() => setOpen(!open)} className={`flex items-center gap-[8px] cursor-pointer rounded-[12px] px-[14px] py-[8px] transition-all ${open ? 'bg-[#39375b] text-white' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(136,138,229,0.08)]'}`}>
        <div className="shrink-0 w-[12px] h-[15px] bg-[#8d8d90]" style={{ maskImage: `url('${IMG_LIGHTNING_MASK}')`, WebkitMaskImage: `url('${IMG_LIGHTNING_MASK}')`, maskSize: '15px 15px', WebkitMaskSize: '15px 15px', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
        <span className="text-[13px] font-semibold">Модели</span>
        {selectedModels.length > 0 && (
          <span className="text-[10px] px-[6px] py-[1px] rounded-[6px] bg-[rgba(136,138,229,0.2)] text-[#888ae5] font-bold">{selectedModels.length}</span>
        )}
        <CustomIcon src="/icons/arrow_down_icon.png" size={12} className={`opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && pos && createPortal(
        <motion.div ref={ref} className="fixed bg-[#1e1d26] rounded-[16px] w-[280px] py-[8px] z-[9999] shadow-[0_12px_40px_rgba(0,0,0,0.6)]" style={{ top: pos.top, left: pos.left }} initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 24, stiffness: 400 }}>
          <DropdownHeader count={selectedModels.length} filterCat={filterCat} onFilter={(cat) => { setFilterCat(cat); if (cat !== 'all') onCategoryChange(cat as ArenaCategory) }} />
          <div className="max-h-[340px] overflow-y-auto chat-scrollbar">
            {filtered.map((m) => {
              const sel = selectedModels.some((x) => x.id === m.id)
              const disabled = !sel && selectedModels.length >= 4
              const mLocked = isLocked(m.id)
              return (
                <button key={m.id} onClick={(e) => { e.stopPropagation(); if (!disabled) onToggle(m) }} className={`flex items-center gap-[10px] w-full px-[14px] py-[7px] transition-colors cursor-pointer ${mLocked ? 'opacity-60' : sel ? 'bg-[rgba(136,138,229,0.1)]' : disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[rgba(136,138,229,0.08)]'}`}>
                  <MIcon model={m} size={22} />
                  <span className="text-[13px] text-white flex-1 text-left truncate font-medium">{m.name}</span>
                  {mLocked ? (
                    <div className="flex items-center gap-[3px] px-[7px] py-[2px] rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, rgba(91,91,214,0.5), rgba(124,92,191,0.5))' }}>
                      <img src="/assets/models/stars_icon_2.png" alt="" className="size-[8px] object-contain brightness-0 invert" />
                      <span className="text-[9px] text-white font-semibold">Подписка</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[11px] text-[rgba(255,255,255,0.35)] shrink-0 font-semibold">{hasSub && FREE_ARENA_IDS.has(m.id) ? 0 : m.price}<img alt="" className="size-[10px] inline ml-[2px]" src={IMG_COIN} /></span>
                      <div className={`size-[16px] rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${sel ? 'bg-[#888ae5]' : 'bg-[rgba(255,255,255,0.06)]'}`}>{sel && <CustomIcon src="/icons/chekmark_icon.png" size={10} className="opacity-60" />}</div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>,
        document.body
      )}
    </>
  )
}

type FilterCat = 'all' | ArenaCategory

function DropdownHeader({ count, filterCat, onFilter }: { count: number; filterCat: FilterCat; onFilter: (c: FilterCat) => void }) {
  return (
    <div className="flex items-center justify-between px-[14px] pb-[8px] border-b border-[rgba(255,255,255,0.06)] mb-[4px]">
      <span className="text-[11px] text-[rgba(255,255,255,0.3)] font-medium">{count}/4 выбрано</span>
      <div className="flex gap-[3px]">
        {(['all', 'text', 'image', 'video'] as const).map((cat) => (
          <button key={cat} onClick={(e) => { e.stopPropagation(); onFilter(cat) }} className={`text-[11px] px-[7px] py-[3px] rounded-[8px] transition-colors cursor-pointer font-medium ${filterCat === cat ? 'bg-[#39375b] text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(136,138,229,0.08)]'}`}>
            {cat === 'all' ? 'Все' : cat === 'text' ? 'Текст' : cat === 'image' ? 'Фото' : 'Видео'}
          </button>
        ))}
      </div>
    </div>
  )
}

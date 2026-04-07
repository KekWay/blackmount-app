'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CustomIcon } from '@/components/shared/custom-icon'
import { getBasePrice } from '@/types/models'
import { motion } from 'motion/react'
import { ModelIcon } from '@/components/shared/model-icon'
import { useSubscriptionStore } from '@/stores/subscription'
import { aiModels } from '@/data/ai-models'
import { APP_ASSETS } from '@/lib/assets'
import type { AIModel } from '@/types'

const imgXsCoin = APP_ASSETS.coin

interface InputModelDropdownProps {
  currentModel: AIModel
  onSelect: (model: AIModel) => void
}

export function InputModelDropdown({ currentModel, onSelect }: InputModelDropdownProps) {
  const [open, setOpen] = useState(false)
  const [filterCat, setFilterCat] = useState<'all' | 'text' | 'image' | 'video'>('all')
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ bottom: number; right: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ bottom: window.innerHeight - rect.top + 8, right: window.innerWidth - rect.right })
    }
  }, [open])

  const filtered = filterCat === 'all' ? aiModels : aiModels.filter((m) => m.category === filterCat)

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[6px] cursor-pointer hover:bg-[rgba(255,255,255,0.05)] rounded-[8px] px-[6px] py-[2px] transition-colors"
      >
        <ModelIcon modelId={currentModel.id} size={16} />
        <p className="font-manrope font-medium leading-[28px] text-[14px] text-[#919191]">
          {currentModel.name}
        </p>
        <CustomIcon src="/icons/arrow_down_icon.png" size={11} className={`opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && pos && mounted && createPortal(
        <motion.div
          ref={ref}
          className="fixed bg-[#1e1d26] rounded-[16px] w-[230px] py-[8px] z-[9999] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          style={{ bottom: pos.bottom, right: pos.right }}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 400 }}
        >
          <div className="flex gap-[4px] px-[10px] pb-[8px] border-b border-[rgba(255,255,255,0.06)] mb-[4px]">
            {(['all', 'text', 'image', 'video'] as const).map((cat) => (
              <button
                key={cat}
                onClick={(e) => { e.stopPropagation(); setFilterCat(cat) }}
                className={`font-manrope font-medium text-[11px] px-[8px] py-[3px] rounded-[8px] transition-colors cursor-pointer ${filterCat === cat ? 'bg-[rgba(255,255,255,0.12)] text-white' : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}
              >
                {cat === 'all' ? 'Все' : cat === 'text' ? 'Текст' : cat === 'image' ? 'Фото' : 'Видео'}
              </button>
            ))}
          </div>
          <div className="max-h-[280px] overflow-y-auto chat-scrollbar">
            {filtered.map((m) => {
              const mLocked = useSubscriptionStore.getState().isModelLocked(m.id)
              return (
                <button
                  key={m.id}
                  onClick={(e) => { e.stopPropagation(); if (!mLocked) { onSelect(m); setOpen(false) } }}
                  className={`flex items-center gap-[10px] w-full px-[14px] py-[7px] transition-colors ${mLocked ? 'opacity-60 cursor-default' : 'hover:bg-[rgba(136,138,229,0.08)] cursor-pointer'} ${m.id === currentModel.id && !mLocked ? 'bg-[rgba(136,138,229,0.1)]' : ''}`}
                >
                  <ModelIcon modelId={m.id} size={20} />
                  <span className="font-manrope font-medium text-[13px] text-white">{m.name}</span>
                  {mLocked ? (
                    <div className="flex items-center gap-[4px] ml-auto shrink-0">
                      <img src="/assets/models/padlock_icon.png" alt="" className="size-[10px] object-contain brightness-0 invert opacity-35" />
                      <div
                        className="flex items-center gap-[3px] px-[7px] py-[2px] rounded-full cursor-pointer hover:brightness-110 transition-all ml-[4px]"
                        style={{ background: 'linear-gradient(135deg, rgba(91,91,214,0.5), rgba(124,92,191,0.5))' }}
                        onClick={(e) => { e.stopPropagation(); window.location.href = '/profile?tab=subscription' }}
                      >
                        <img src="/assets/models/stars_icon_2.png" alt="" className="size-[8px] object-contain brightness-0 invert" />
                        <span className="font-manrope font-semibold text-[9px] text-white">Подписка</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-[3px] ml-auto shrink-0">
                        <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)]">
                          от {Math.min(...m.versions.map(v => getBasePrice(v.price)))}
                        </span>
                        <div className="relative shrink-0 size-[10px]">
                          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
                        </div>
                      </div>
                      {m.id === currentModel.id && (
                        <CustomIcon src="/icons/chekmark_icon.png" size={12} className="opacity-50" />
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  )
}

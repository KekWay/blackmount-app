'use client'

import { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ModelIcon } from '@/components/shared/model-icon'
import type { AIModel } from '@/types/models'

interface HistoryFilterProps {
  relevantModels: AIModel[]
  selectedModels: string[]
  onToggleModel: (modelId: string) => void
  onClear: () => void
}

export function HistoryFilter({ relevantModels, selectedModels, onToggleModel, onClear }: HistoryFilterProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const hasActiveFilter = selectedModels.length > 0

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <div ref={filterRef} className="relative">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`rounded-[12px] size-[40px] flex items-center justify-center cursor-pointer transition-colors ${hasActiveFilter ? 'bg-[rgba(136,138,229,0.2)]' : 'bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)]'}`}
        >
          <Image src="/assets/models/filter_icon.png" alt="" width={18} height={18} className={`brightness-0 invert transition-opacity ${hasActiveFilter ? '[filter:brightness(0)_saturate(100%)_invert(55%)_sepia(50%)_saturate(600%)_hue-rotate(210deg)]' : 'opacity-40'}`} />
        </button>
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              className="absolute left-0 top-[calc(100%+6px)] bg-[#1e1d26] rounded-[16px] w-[240px] py-[8px] z-50 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ type: 'spring', damping: 24, stiffness: 400 }}
            >
              <div className="flex items-center justify-between px-[14px] py-[6px] border-b border-[rgba(255,255,255,0.06)] mb-[4px]">
                <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Фильтр по модели</p>
                {hasActiveFilter && (
                  <button onClick={onClear} className="font-manrope font-medium text-[10px] text-[#888ae5] cursor-pointer hover:underline">Сбросить</button>
                )}
              </div>
              {relevantModels.map((m) => {
                const isSelected = selectedModels.includes(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => onToggleModel(m.id)}
                    className={`flex items-center gap-[10px] w-full px-[14px] py-[8px] hover:bg-[rgba(136,138,229,0.08)] transition-colors cursor-pointer ${isSelected ? 'bg-[rgba(136,138,229,0.1)]' : ''}`}
                  >
                    <ModelIcon modelId={m.id} size={22} />
                    <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">{m.name}</span>
                    {isSelected && <Check size={14} className="text-[#888ae5] shrink-0" />}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Active filter badges */}
      {hasActiveFilter && (
        <div className="flex items-center gap-[6px]">
          {selectedModels.map((modelId) => {
            const m = relevantModels.find((x) => x.id === modelId)
            if (!m) return null
            return (
              <div key={modelId} className="flex items-center gap-[5px] bg-[rgba(136,138,229,0.12)] border border-[rgba(136,138,229,0.25)] rounded-[14px] px-[8px] py-[3px]">
                <ModelIcon modelId={m.id} size={14} />
                <span className="font-manrope font-medium text-[11px] text-[#b0b2f0]">{m.name}</span>
                <button onClick={() => onToggleModel(modelId)} className="group cursor-pointer transition-colors">
                  <Image src="/icons/close_icon.png" alt="" width={7} height={7} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

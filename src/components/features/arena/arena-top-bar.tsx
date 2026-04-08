'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import type { ArenaModel, ArenaCategory } from '@/data/arena-models'
import { IMG_COIN } from './arena-data'
import { MIcon } from './arena-micon'
import { ArenaModelDropdown } from './arena-model-dropdown'

const IMG_PROMPT = '/assets/models/arena-prompt.png'

interface Props {
  selectedModels: ArenaModel[]
  totalCost: number
  currentPrompt: string
  promptOpen: boolean
  modelsDisabled: boolean
  onTogglePrompt: () => void
  onToggle: (m: ArenaModel) => void
  onCategoryChange: (c: ArenaCategory) => void
}

export function ArenaTopBar({ selectedModels, totalCost, currentPrompt, promptOpen, modelsDisabled, onTogglePrompt, onToggle, onCategoryChange }: Props) {
  return (
    <div className="flex items-center gap-[10px] px-[12px] md:px-[24px] py-[14px] border-b border-[rgba(255,255,255,0.04)] shrink-0 overflow-x-auto hidden-scrollbar">
      <div className={modelsDisabled ? 'opacity-40 pointer-events-none' : ''}>
        <ArenaModelDropdown selectedModels={selectedModels} onToggle={onToggle} onCategoryChange={onCategoryChange} />
      </div>

      {/* Selected model chips */}
      <AnimatePresence>
        {selectedModels.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, scale: 0.8, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.8, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="flex items-center gap-[6px] rounded-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] pl-[6px] pr-[8px] py-[4px]">
              <MIcon model={m} size={18} />
              <span className="text-[12px] text-white whitespace-nowrap font-medium">{m.name}</span>
              {!modelsDisabled && <button onClick={() => onToggle(m)} aria-label={`Убрать ${m.name}`} className="group/close transition-colors cursor-pointer ml-[2px]"><Image src="/icons/close_icon.png" alt="" width={8} height={8} className="invert opacity-25 group-hover/close:opacity-60 transition-opacity duration-200" /></button>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center gap-[8px] ml-auto">
        {/* Prompt button */}
        {currentPrompt && (
          <button
            onClick={onTogglePrompt}
            className={`flex items-center gap-[8px] cursor-pointer rounded-[12px] px-[14px] py-[8px] transition-all ${promptOpen ? 'bg-[#39375b] text-white' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(136,138,229,0.08)]'}`}
            title="Показать запрос"
          >
            <div className="shrink-0 size-[18px] bg-[#8d8d90]" style={{ maskImage: `url('${IMG_PROMPT}')`, WebkitMaskImage: `url('${IMG_PROMPT}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
            <span className="text-[13px] font-semibold">Запрос</span>
          </button>
        )}

        {/* Cost badge */}
        {selectedModels.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-[4px] bg-[rgba(255,255,255,0.03)] rounded-[8px] px-[10px] py-[5px]">
            <span className="text-[13px] text-white font-bold">{totalCost}</span>
            <img alt="" src={IMG_COIN} className="size-[14px]" />
            <span className="text-[10px] text-[rgba(255,255,255,0.25)] ml-[2px]">/ битва</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

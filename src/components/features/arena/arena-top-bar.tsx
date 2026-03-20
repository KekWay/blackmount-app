'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { ArenaModel, ArenaCategory } from '@/data/arena-models'
import { IMG_COIN } from './arena-data'
import { MIcon } from './arena-micon'
import { ArenaModelDropdown } from './arena-model-dropdown'

interface Props {
  selectedModels: ArenaModel[]
  totalCost: number
  onToggle: (m: ArenaModel) => void
  onCategoryChange: (c: ArenaCategory) => void
}

export function ArenaTopBar({ selectedModels, totalCost, onToggle, onCategoryChange }: Props) {
  return (
    <div className="flex items-center gap-[10px] px-[24px] py-[14px] border-b border-[rgba(255,255,255,0.04)] shrink-0">
      <ArenaModelDropdown selectedModels={selectedModels} onToggle={onToggle} onCategoryChange={onCategoryChange} />

      {/* Selected model chips */}
      <AnimatePresence>
        {selectedModels.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, scale: 0.8, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.8, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="flex items-center gap-[6px] rounded-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] pl-[6px] pr-[8px] py-[4px]">
              <MIcon model={m} size={18} />
              <span className="text-[12px] text-white whitespace-nowrap font-medium">{m.name}</span>
              <button onClick={() => onToggle(m)} className="text-[rgba(255,255,255,0.25)] hover:text-white transition-colors cursor-pointer ml-[2px]"><X size={11} /></button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Cost badge */}
      {selectedModels.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-[4px] ml-auto bg-[rgba(255,255,255,0.03)] rounded-[8px] px-[10px] py-[5px]">
          <span className="text-[13px] text-white font-bold">{totalCost}</span>
          <img alt="" src={IMG_COIN} className="size-[14px]" />
          <span className="text-[10px] text-[rgba(255,255,255,0.25)] ml-[2px]">/ битва</span>
        </motion.div>
      )}
    </div>
  )
}

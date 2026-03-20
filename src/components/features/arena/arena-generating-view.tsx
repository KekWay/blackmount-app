'use client'

import { motion } from 'motion/react'
import type { ArenaModel } from '@/data/arena-models'
import { MIcon } from './arena-micon'

interface Props {
  currentPrompt: string
  selectedModels: ArenaModel[]
  gridCols: number
}

export function ArenaGeneratingView({ currentPrompt, selectedModels, gridCols }: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* User prompt bubble */}
      <div className="flex justify-center py-[16px] px-[24px]">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[500px] rounded-[20px] px-[20px] py-[12px] bg-[rgba(61,57,80,0.6)]">
          <p className="text-[13px] text-white leading-[20px] whitespace-pre-wrap">{currentPrompt}</p>
        </motion.div>
      </div>
      <div className="flex-1 p-[20px] pt-0">
        <div className="grid gap-[10px] h-full" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
          {selectedModels.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-[16px] bg-[rgba(255,255,255,0.02)] ring-1 ring-[rgba(255,255,255,0.03)] overflow-hidden flex flex-col">
              <div className="flex items-center gap-[8px] px-[16px] py-[10px] border-b border-[rgba(255,255,255,0.04)]">
                <MIcon model={m} size={22} />
                <span className="text-[13px] text-white font-semibold">{m.name}</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex gap-[4px]">
                  {[0, 1, 2].map((j) => <motion.div key={j} className="size-[5px] rounded-full bg-[#888ae5]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }} />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

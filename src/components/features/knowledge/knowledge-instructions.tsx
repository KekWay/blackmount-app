'use client'

import { Play } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { InstructionStep } from './knowledge-types'

const imgVideoMask = '/assets/models/2e5b2fe881d38d46194918ca4f16ab0d28f3fd25.png'

interface KnowledgeInstructionsProps {
  modelId: string
  glowColor: string
  instructions: InstructionStep[]
  activeInstruction: number
  onSetActiveInstruction: (idx: number) => void
}

export function KnowledgeInstructions({
  modelId,
  glowColor,
  instructions,
  activeInstruction,
  onSetActiveInstruction,
}: KnowledgeInstructionsProps) {
  return (
    <div className="mb-[36px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <div className="w-[16px] h-[16px]" style={{ backgroundColor: '#888ae5', maskImage: `url('${imgVideoMask}')`, WebkitMaskImage: `url('${imgVideoMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
        <h2 className="text-[18px] text-white font-semibold">Инструкция</h2>
      </div>

      {/* GIF display area */}
      <div className="rounded-[16px] overflow-hidden mb-[12px] relative" style={{ background: `linear-gradient(135deg, rgba(30,29,42,0.8) 0%, rgba(18,17,24,0.9) 100%)`, border: '1px solid rgba(255,255,255,0.04)' }}>
        {/* Top glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${glowColor}35, transparent)` }} />

        <div className="relative min-h-[200px] flex flex-col items-center justify-center p-[32px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${modelId}-${activeInstruction}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              <div className="size-[56px] rounded-[14px] flex items-center justify-center mb-[14px]" style={{ background: `${glowColor}15`, border: `1px solid ${glowColor}25` }}>
                <Play size={24} className="text-white/50 ml-[2px]" />
              </div>
              <p className="text-[15px] text-white mb-[6px] font-semibold">
                {instructions[activeInstruction]?.gifPlaceholder}
              </p>
              <p className="text-[13px] text-[rgba(255,255,255,0.35)] max-w-[380px]">
                {instructions[activeInstruction]?.description}
              </p>
              {/* Progress indicator */}
              <div className="mt-[18px] w-[100px] h-[3px] rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: glowColor }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step buttons */}
      <div className="flex gap-[8px]">
        {instructions.map((instr, idx) => (
          <button
            key={instr.id}
            onClick={() => onSetActiveInstruction(idx)}
            className={`flex-1 rounded-[12px] px-[14px] py-[12px] text-left transition-all cursor-pointer ${
              idx === activeInstruction
                ? 'bg-[rgba(136,138,229,0.1)] ring-1 ring-[rgba(136,138,229,0.25)]'
                : 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            <div className="flex items-center gap-[8px] mb-[3px]">
              <div className={`size-[20px] rounded-[6px] flex items-center justify-center text-[10px] ${
                idx === activeInstruction ? 'bg-[#888ae5] text-white' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.4)]'
              } font-bold`}>
                {idx + 1}
              </div>
              <span className={`text-[12px] font-semibold ${idx === activeInstruction ? 'text-white' : 'text-[rgba(255,255,255,0.5)]'}`}>
                {instr.title}
              </span>
            </div>
            <p className="text-[11px] text-[rgba(255,255,255,0.25)] ml-[28px] leading-[15px]">{instr.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

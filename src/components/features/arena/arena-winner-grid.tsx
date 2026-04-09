'use client'

import { motion } from 'motion/react'
import type { ModelResponse } from './arena-data'
import { IMG_MEDAL1, IMG_MEDAL2, IMG_MEDAL3 } from './arena-data'
import { MIcon } from './arena-micon'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'

interface Props {
  responses: ModelResponse[]
  winnerId: string
  gridCols: number
}

export function ArenaWinnerGrid({ responses, winnerId, gridCols }: Props) {
  const medalImages = [IMG_MEDAL1, IMG_MEDAL2, IMG_MEDAL3]
  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']
  let loserIdx = 0

  return (
    <div className="grid gap-[10px] h-full relative" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
      {responses.map((r) => {
        const isW = r.model.id === winnerId
        const positionIdx = isW ? 0 : Math.min(1 + loserIdx, 2)
        if (!isW) loserIdx++
        const medalImg = medalImages[positionIdx]
        const medalColor = medalColors[positionIdx]
        return (
          <motion.div
            key={r.model.id}
            animate={isW ? { scale: 1.02, opacity: 1 } : { scale: 0.92, opacity: 0.15, filter: 'blur(4px) grayscale(1)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-[16px] overflow-hidden flex flex-col relative ${isW ? 'bg-[rgba(136,138,229,0.06)] ring-2 ring-[#888ae5]/50 shadow-[0_0_40px_rgba(136,138,229,0.15),0_0_80px_rgba(136,138,229,0.05)]' : 'bg-[rgba(255,255,255,0.02)] ring-1 ring-[rgba(255,255,255,0.03)]'}`}
          >
            {isW && <WinnerGlow />}
            <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[rgba(255,255,255,0.04)] relative z-[1]">
              <div className="flex items-center gap-[8px]">
                <MIcon model={r.model} size={22} />
                <span className="text-[13px] text-white font-semibold">{r.model.name}</span>
                {isW && (
                  <motion.span initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.2 }} className="flex items-center gap-[4px] text-[9px] px-[8px] py-[3px] rounded-[6px] font-bold text-[#c4b5fd] bg-gradient-to-br from-[rgba(136,138,229,0.25)] to-[rgba(168,90,220,0.2)]">
                    <motion.div animate={{ rotate: [0, 20, -10, 15, 0], scale: [1, 1.2, 1, 1.15, 1] }} transition={{ duration: 1.5, delay: 0.4 }}>
                      <div className="shrink-0 w-[10px] h-[10px] bg-[#c4b5fd]" style={{ maskImage: `url('${medalImg}')`, WebkitMaskImage: `url('${medalImg}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
                    </motion.div>
                    Победитель
                  </motion.span>
                )}
                {!isW && (
                  <span className="flex items-center gap-[3px] text-[9px] px-[6px] py-[2px] rounded-[5px] bg-[rgba(255,255,255,0.04)] font-semibold" style={{ color: medalColor }}>
                    <div className="shrink-0 w-[10px] h-[10px]" style={{ backgroundColor: medalColor, maskImage: `url('${medalImg}')`, WebkitMaskImage: `url('${medalImg}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
                    {positionIdx + 1}-е место
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 px-[16px] py-[14px] overflow-y-auto chat-scrollbar relative z-[1]">
              <MarkdownRenderer content={r.text} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function WinnerGlow() {
  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[16px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(136,138,229,0.25)_0%,transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.1, 0.2, 0.08] }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      {[...Array(6)].map((_, pi) => (
        <motion.div
          key={pi}
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            x: `${20 + Math.random() * 60}%`,
            y: `${10 + Math.random() * 30}%`,
          }}
          transition={{ duration: 1.2, delay: 0.2 + pi * 0.12, ease: 'easeOut' }}
        >
          <div className="size-[10px] rounded-full bg-[#888ae5] opacity-60" />
        </motion.div>
      ))}
    </>
  )
}

'use client'

import { motion } from 'motion/react'
import type { ArenaModel } from '@/data/arena-models'
import type { ModelResponse } from './arena-data'
import { ArenaWinnerGrid } from './arena-winner-grid'
import { ArenaWinnerCelebration } from './arena-winner-celebration'
import { ArenaWinnerCard } from './arena-winner-card'

interface Props {
  currentPrompt: string
  responses: ModelResponse[]
  winnerResponse: ModelResponse
  winnerId: string
  gridCols: number
  showLosers: boolean
  savedIds: Set<string>
  ratedId: string | null
  onSave: (id: string) => void
  onRate: (id: string) => void
  onReset: () => void
  onGoChat: (m: ArenaModel) => void
}

export function ArenaWinnerView({
  currentPrompt, responses, winnerResponse, winnerId, gridCols,
  showLosers, savedIds, ratedId, onSave, onRate, onReset, onGoChat,
}: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* User prompt */}
      <div className="flex justify-center py-[14px] px-[24px]">
        <div className="max-w-[500px] rounded-[20px] px-[20px] py-[10px] bg-[rgba(61,57,80,0.5)]">
          <p className="text-[13px] text-white leading-[20px] whitespace-pre-wrap">{currentPrompt}</p>
        </div>
      </div>

      <div className="flex-1 px-[20px] pb-[16px]">
        {showLosers ? (
          <ArenaWinnerGrid responses={responses} winnerId={winnerId} gridCols={gridCols} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center gap-[16px] relative"
          >
            <ArenaWinnerCelebration winnerResponse={winnerResponse} />
            <ArenaWinnerCard
              winnerResponse={winnerResponse}
              savedIds={savedIds}
              ratedId={ratedId}
              onSave={onSave}
              onRate={onRate}
              onReset={onReset}
              onGoChat={onGoChat}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

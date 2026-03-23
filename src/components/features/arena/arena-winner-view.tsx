'use client'

import { motion } from 'motion/react'
import type { ArenaModel } from '@/data/arena-models'
import type { ModelResponse } from './arena-data'
import { ArenaWinnerGrid } from './arena-winner-grid'
import { ArenaWinnerCelebration } from './arena-winner-celebration'
import { ArenaWinnerCard } from './arena-winner-card'

interface Props {
  responses: ModelResponse[]
  winnerResponse: ModelResponse
  winnerId: string
  prompt: string
  gridCols: number
  showLosers: boolean
  savedIds: Set<string>
  ratedId: string | null
  onSave: (id: string) => void
  onRate: (id: string) => void
  onReset: () => void
  onGoChat: (m: ArenaModel) => void
  onShare: () => void
}

export function ArenaWinnerView({
  responses, winnerResponse, winnerId, prompt, gridCols,
  showLosers, savedIds, ratedId, onSave, onRate, onReset, onGoChat, onShare,
}: Props) {
  return (
    <div className="h-full flex flex-col">
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
              prompt={prompt}
              savedIds={savedIds}
              ratedId={ratedId}
              onSave={onSave}
              onRate={onRate}
              onReset={onReset}
              onGoChat={onGoChat}
              onShare={onShare}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

import { ThumbsUp, ThumbsDown, Swords } from 'lucide-react'
import type { ArenaModel } from '@/data/arena-models'

interface VoteControlsProps {
  models: ArenaModel[]
  onVote: (winnerId: string | null) => void
  disabled: boolean
}

export function VoteControls({ models, onVote, disabled }: VoteControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <p className="text-sm text-white/50 font-medium">Какой ответ лучше?</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            disabled={disabled}
            onClick={() => onVote(model.id)}
            className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ThumbsUp size={16} className="text-green-400" />
            <span>{model.name}</span>
          </button>
        ))}

        <button
          disabled={disabled}
          onClick={() => onVote(null)}
          className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Swords size={16} className="text-yellow-400" />
          <span>Ничья</span>
        </button>
      </div>
    </div>
  )
}

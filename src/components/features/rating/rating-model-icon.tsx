'use client'

import { ModelIcon } from '@/components/shared/model-icon'
import type { LeaderboardModel } from '@/data/leaderboard'

export function RatingModelIcon({ item, size }: { item: LeaderboardModel; size: number }) {
  if (item.aiModelRef) {
    return <ModelIcon modelId={item.aiModelRef} size={size} />
  }

  return (
    <div
      className="shrink-0 rounded-[8px] flex items-center justify-center"
      style={{ width: size, height: size, background: item.gradient }}
    >
      <span className="text-white" style={{ fontSize: size * 0.4, fontWeight: 800 }}>
        {item.name.charAt(0)}
      </span>
    </div>
  )
}

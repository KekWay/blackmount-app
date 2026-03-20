'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

export function UserRating({ modelId, baseVotes }: { modelId: string; baseVotes: number }) {
  const storageKey = `userVote_${modelId}`
  const likesKey = `modelLikes_${modelId}`
  const dislikesKey = `modelDislikes_${modelId}`

  const [vote, setVote] = useState<'like' | 'dislike' | null>(() => {
    try { return localStorage.getItem(storageKey) as 'like' | 'dislike' | null } catch { return null }
  })
  const [likes, setLikes] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(likesKey) || String(Math.round(baseVotes * 0.82)), 10) } catch { return Math.round(baseVotes * 0.82) }
  })
  const [dislikes, setDislikes] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(dislikesKey) || String(Math.round(baseVotes * 0.18)), 10) } catch { return Math.round(baseVotes * 0.18) }
  })

  const handleVote = (type: 'like' | 'dislike') => {
    let newVote: 'like' | 'dislike' | null
    let newLikes = likes
    let newDislikes = dislikes

    if (vote === type) {
      newVote = null
      if (type === 'like') newLikes--
      else newDislikes--
    } else {
      if (vote === 'like') newLikes--
      if (vote === 'dislike') newDislikes--
      newVote = type
      if (type === 'like') newLikes++
      else newDislikes++
    }

    setVote(newVote)
    setLikes(newLikes)
    setDislikes(newDislikes)
    try {
      if (newVote) localStorage.setItem(storageKey, newVote)
      else localStorage.removeItem(storageKey)
      localStorage.setItem(likesKey, String(newLikes))
      localStorage.setItem(dislikesKey, String(newDislikes))
    } catch { /* noop */ }
  }

  return (
    <div className="flex items-center justify-between pt-[12px] border-t border-[rgba(255,255,255,0.06)] mt-[12px]">
      <span className="text-[10px] text-[rgba(255,255,255,0.35)] font-bold uppercase tracking-wider">Ваша оценка</span>
      <div className="flex items-center gap-[8px]">
        <button
          onClick={(e) => { e.stopPropagation(); handleVote('like') }}
          className={`flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] transition-all cursor-pointer ${
            vote === 'like'
              ? "bg-[#4ade80]/15 text-[#4ade80]"
              : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)]"
          }`}
        >
          <ThumbsUp size={13} fill={vote === 'like' ? '#4ade80' : 'none'} />
          <span className="text-[11px] font-bold">{formatCount(likes)}</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleVote('dislike') }}
          className={`flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] transition-all cursor-pointer ${
            vote === 'dislike'
              ? "bg-[#ef4444]/15 text-[#ef4444]"
              : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)]"
          }`}
        >
          <ThumbsDown size={13} fill={vote === 'dislike' ? '#ef4444' : 'none'} />
          <span className="text-[11px] font-bold">{formatCount(dislikes)}</span>
        </button>
      </div>
    </div>
  )
}

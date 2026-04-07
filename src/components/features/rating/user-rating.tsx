'use client'

import { useState } from 'react'
import Image from 'next/image'

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
          className={`group/like flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] transition-all cursor-pointer ${
            vote === 'like'
              ? "bg-[#4ade80]/15 text-[#4ade80]"
              : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)]"
          }`}
        >
          <Image src="/icons/like_icon.png" alt="" width={13} height={13} className={`transition-all duration-200 ${vote === 'like' ? '[filter:brightness(0)_saturate(100%)_invert(73%)_sepia(57%)_saturate(497%)_hue-rotate(93deg)_brightness(98%)_contrast(92%)]' : 'brightness-0 invert opacity-30 group-hover/like:opacity-100'}`} />
          <span className="text-[11px] font-bold">{formatCount(likes)}</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleVote('dislike') }}
          className={`group/dislike flex items-center gap-[5px] px-[10px] py-[5px] rounded-[8px] transition-all cursor-pointer ${
            vote === 'dislike'
              ? "bg-[#ef4444]/15 text-[#ef4444]"
              : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)]"
          }`}
        >
          <Image src="/icons/dislike_icon.png" alt="" width={13} height={13} className={`transition-all duration-200 ${vote === 'dislike' ? '[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]' : 'brightness-0 invert opacity-30 group-hover/dislike:opacity-100'}`} />
          <span className="text-[11px] font-bold">{formatCount(dislikes)}</span>
        </button>
      </div>
    </div>
  )
}

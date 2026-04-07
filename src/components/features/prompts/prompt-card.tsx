'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import type { PromptItem } from './prompts-data'

interface PromptCardProps {
  item: PromptItem
  onOpen: () => void
}

export function PromptCard({ item, onOpen }: PromptCardProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [fav, setFav] = useState(() => {
    try { const favs: number[] = JSON.parse(localStorage.getItem('promptFavs') || '[]'); return favs.includes(item.id) } catch { return false }
  })

  const toggleFav = () => {
    if (!isLoggedIn) { router.push('/auth'); return }
    try {
      const favs: number[] = JSON.parse(localStorage.getItem('promptFavs') || '[]')
      const next = fav ? favs.filter((id) => id !== item.id) : [...favs, item.id]
      localStorage.setItem('promptFavs', JSON.stringify(next))
      setFav(!fav)
      window.dispatchEvent(new Event('promptFavsChanged'))
    } catch { /* noop */ }
  }

  return (
    <div
      className={`${item.span || 'col-span-1 row-span-1'} rounded-[12px] overflow-hidden relative group cursor-pointer`}
      onClick={onOpen}
    >
      <img alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src={item.src} />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Favorite button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFav() }}
        className={`absolute top-[8px] right-[8px] backdrop-blur-[6px] rounded-[8px] size-[30px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border ${
          fav
            ? 'bg-[#39375b] border-[rgba(136,138,229,0.3)]'
            : 'bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.08)] hover:bg-[rgba(136,138,229,0.15)]'
        }`}
      >
        <img src="/icons/heart_icon.png" alt="" width={13} height={13} className={`brightness-0 invert transition-all ${fav ? 'opacity-100' : 'opacity-70'}`} />
      </button>
      {/* Play icon for video */}
      {item.type === 'video' && (
        <div className="absolute bottom-[8px] left-[8px] bg-[rgba(0,0,0,0.45)] rounded-full size-[28px] flex items-center justify-center backdrop-blur-[4px] border border-[rgba(255,255,255,0.08)]">
          <Play size={12} className="text-white ml-[1px]" fill="white" />
        </div>
      )}
      {/* Prompt preview on hover */}
      <div className="absolute bottom-[8px] left-[8px] right-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[11px] text-[rgba(255,255,255,0.85)] line-clamp-2 leading-[16px] drop-shadow-lg">
          {item.prompt}
        </p>
      </div>
    </div>
  )
}

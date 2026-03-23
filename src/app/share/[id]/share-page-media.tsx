'use client'

import { Play, ImageIcon } from 'lucide-react'
import type { SharedItem } from '@/stores/shared'

interface Props {
  item: SharedItem
}

export function SharePageMedia({ item }: Props) {
  if (!item.mediaUrl) {
    return (
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[14px] h-[280px] flex items-center justify-center">
        {item.type === 'video' ? (
          <Play size={48} className="text-[rgba(255,255,255,0.12)]" />
        ) : (
          <ImageIcon size={48} className="text-[rgba(255,255,255,0.12)]" />
        )}
      </div>
    )
  }

  if (item.type === 'video') {
    return (
      <div className="rounded-[14px] overflow-hidden">
        <video
          src={item.mediaUrl}
          controls
          className="w-full max-h-[400px] object-contain bg-black rounded-[14px]"
        />
      </div>
    )
  }

  return (
    <div className="rounded-[14px] overflow-hidden">
      <img
        src={item.mediaUrl}
        alt={item.prompt}
        className="w-full max-h-[500px] object-contain bg-[rgba(255,255,255,0.02)] rounded-[14px]"
      />
    </div>
  )
}

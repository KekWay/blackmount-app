'use client'

import { Play, ImageIcon } from 'lucide-react'
import { ModelIcon } from '@/components/shared/model-icon'

export interface HistoryMediaItem {
  id: string
  modelId: string
  title: string
  preview: string
  time: string
  dateStr: string
  type: 'text' | 'image' | 'video'
}

interface HistoryMediaCardProps {
  item: HistoryMediaItem
  mediaType: 'image' | 'video'
  onView: () => void
  onDelete: () => void
}

export function HistoryMediaCard({ item, mediaType, onView, onDelete }: HistoryMediaCardProps) {
  return (
    <div
      onClick={onView}
      className="aspect-square rounded-[14px] overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#888ae5]/50 transition-all duration-300 relative group hover:scale-[1.02] hover:shadow-lg bg-[rgba(255,255,255,0.03)]"
    >
      <div className="w-full h-full bg-gradient-to-br from-[rgba(136,138,229,0.15)] to-[rgba(101,222,216,0.1)] flex items-center justify-center">
        {mediaType === 'video' ? <Play size={32} className="text-[rgba(255,255,255,0.2)]" /> : <ImageIcon size={32} className="text-[rgba(255,255,255,0.2)]" />}
      </div>
      {mediaType === 'video' && (
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="bg-[rgba(255,255,255,0.9)] rounded-full size-[36px] flex items-center justify-center">
            <Play size={16} className="text-[#19181e] ml-[2px]" fill="#19181e" />
          </div>
        </div>
      )}
      <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[5px] bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] rounded-[8px] px-[6px] py-[3px] opacity-0 group-hover:opacity-100 transition-opacity">
        <ModelIcon modelId={item.modelId} size={14} />
        <span className="font-manrope font-medium text-[10px] text-white">{item.title}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute top-[8px] right-[8px] backdrop-blur-[4px] bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(248,113,113,0.3)] rounded-[8px] size-[28px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-[rgba(255,255,255,0.08)]"
        title="Удалить"
      >
        <img src="/assets/models/trash_icon.png" alt="" width={12} height={12} className="brightness-0 invert opacity-70" />
      </button>
    </div>
  )
}

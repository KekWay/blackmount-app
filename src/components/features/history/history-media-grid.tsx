'use client'

import { useRouter } from 'next/navigation'
import { Trash2, Play, ImageIcon } from 'lucide-react'
import { ModelIcon } from '@/components/shared/model-icon'
import { useAuthStore } from '@/stores/auth'

interface HistoryItem {
  id: string
  modelId: string
  title: string
  preview: string
  time: string
  dateStr: string
  type: 'text' | 'image' | 'video'
}

interface HistoryMediaGridProps {
  items: HistoryItem[]
  mediaType: 'image' | 'video'
  hasActiveFilter: boolean
  onViewItem: (item: HistoryItem) => void
  onRequestDelete: (id: string) => void
  onClearFilter: () => void
}

export function HistoryMediaGrid({ items, mediaType, hasActiveFilter, onViewItem, onRequestDelete, onClearFilter }: HistoryMediaGridProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  if (items.length === 0) {
    const isVideo = mediaType === 'video'
    const Icon = isVideo ? Play : ImageIcon
    return (
      <div className="col-span-5 flex flex-col items-center justify-center py-[60px] gap-[12px]">
        <div className="size-[56px] rounded-full bg-[rgba(136,138,229,0.08)] flex items-center justify-center mb-[4px]">
          <Icon size={24} className="text-[rgba(136,138,229,0.35)]" />
        </div>
        <p className="font-manrope font-semibold text-[16px] text-[rgba(255,255,255,0.5)]">
          {hasActiveFilter ? 'Ничего не найдено' : isVideo ? 'Нет видео' : 'Нет изображений'}
        </p>
        <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.25)] text-center max-w-[320px]">
          {hasActiveFilter
            ? 'Нет записей с выбранным фильтром. Попробуйте сбросить фильтр.'
            : isVideo
              ? 'Сгенерируйте видео с помощью Sora, Kling или Veo — оно появится здесь'
              : 'Сгенерируйте изображение с помощью Flux или NanoBanana — оно появится здесь'}
        </p>
        {hasActiveFilter ? (
          <button onClick={onClearFilter} className="mt-[4px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-[#888ae5] cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.08)] font-semibold">Сбросить фильтр</button>
        ) : (
          <button onClick={() => router.push('/home')} className="mt-[4px] flex items-center gap-[6px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-white cursor-pointer transition-all hover:brightness-110 font-semibold" style={{ background: 'linear-gradient(135deg, #888ae5, #6b6dce)' }}>
            <Icon size={12} /> {isVideo ? 'Создать видео' : 'Сгенерировать'}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => { if (!isLoggedIn) { router.push('/auth'); return; } onViewItem(item); }}
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
            onClick={(e) => { e.stopPropagation(); onRequestDelete(item.id); }}
            className="absolute top-[8px] right-[8px] backdrop-blur-[4px] bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(248,113,113,0.3)] rounded-[8px] size-[28px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-[rgba(255,255,255,0.08)]"
            title="Удалить"
          >
            <Trash2 size={12} className="text-white/70" />
          </button>
        </div>
      ))}
    </>
  )
}

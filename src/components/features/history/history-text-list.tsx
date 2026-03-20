'use client'

import { useRouter } from 'next/navigation'
import { Trash2, MessageSquare } from 'lucide-react'
import { ModelIcon } from '@/components/shared/model-icon'
import { useAuthStore } from '@/stores/auth'

interface HistoryItem {
  id: string
  modelId: string
  title: string
  preview: string
  time: string
}

interface HistoryTextListProps {
  items: HistoryItem[]
  hasActiveFilter: boolean
  onRequestDelete: (id: string) => void
  onClearFilter: () => void
}

export function HistoryTextList({ items, hasActiveFilter, onRequestDelete, onClearFilter }: HistoryTextListProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
        <div className="size-[56px] rounded-full bg-[rgba(136,138,229,0.08)] flex items-center justify-center mb-[4px]">
          <MessageSquare size={24} className="text-[rgba(136,138,229,0.35)]" />
        </div>
        <p className="font-manrope font-semibold text-[16px] text-[rgba(255,255,255,0.5)]">
          {hasActiveFilter ? 'Ничего не найдено' : 'Пока пусто'}
        </p>
        <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.25)] text-center max-w-[320px]">
          {hasActiveFilter ? 'Нет записей с выбранным фильтром. Попробуйте сбросить фильтр.' : 'Начните диалог с любой текстовой моделью — история появится здесь'}
        </p>
        {hasActiveFilter ? (
          <button onClick={onClearFilter} className="mt-[4px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-[#888ae5] cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.08)] font-semibold">Сбросить фильтр</button>
        ) : (
          <button onClick={() => router.push('/home')} className="mt-[4px] flex items-center gap-[6px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-white cursor-pointer transition-all hover:brightness-110 font-semibold" style={{ background: 'linear-gradient(135deg, #888ae5, #6b6dce)' }}>
            <MessageSquare size={12} /> Начать диалог
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={item.id}
          onClick={() => { if (!isLoggedIn) { router.push('/auth'); return; } router.push(`/chat/${item.modelId}?prompt=${encodeURIComponent(item.title)}`); }}
          className={`flex items-center gap-[16px] px-[20px] py-[16px] cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors rounded-[12px] group ${
            i < items.length - 1 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''
          }`}
        >
          <div className="shrink-0 size-[40px] flex items-center justify-center">
            <ModelIcon modelId={item.modelId} size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-manrope font-semibold text-[14px] text-white leading-[22px] truncate">{item.title}</p>
            <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.4)] leading-[20px] truncate">{item.preview}</p>
          </div>
          <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.3)] leading-[20px] shrink-0">{item.time}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onRequestDelete(item.id); }}
            className="shrink-0 size-[32px] rounded-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[rgba(248,113,113,0.12)] transition-all cursor-pointer"
            title="Удалить"
          >
            <Trash2 size={14} className="text-[rgba(255,255,255,0.3)] hover:text-[#f87171]" />
          </button>
        </div>
      ))}
    </div>
  )
}

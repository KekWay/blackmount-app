'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { ModelIcon } from '@/components/shared/model-icon'
import { useAuthStore } from '@/stores/auth'
import { useChatSessionsStore } from '@/stores/chat-sessions'

interface HistoryTextListProps {
  selectedModels: string[]
  hasActiveFilter: boolean
  onRequestDelete: (id: string) => void
  onClearFilter: () => void
}

export function HistoryTextList({ selectedModels, hasActiveFilter, onRequestDelete, onClearFilter }: HistoryTextListProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const sessionsMap = useChatSessionsStore((s) => s.sessions)
  const allSessions = Object.values(sessionsMap).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const items = allSessions.filter(
    (s) => selectedModels.length === 0 || selectedModels.includes(s.modelId)
  )

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
        {hasActiveFilter ? (
          <img src="/assets/models/search-empty.png" alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
        ) : (
          <img src="/assets/models/history-dialog.png" alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        )}
        <p className="font-manrope font-semibold text-[16px] text-[rgba(255,255,255,0.5)]">
          {hasActiveFilter ? 'По вашему запросу ничего не найдено' : 'Пока пусто'}
        </p>
        <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.25)] text-center max-w-[320px]">
          {hasActiveFilter ? 'Нет записей с выбранным фильтром. Попробуйте сбросить фильтр.' : 'Начните диалог с текстовой моделью — история появится здесь'}
        </p>
        {hasActiveFilter ? (
          <button onClick={onClearFilter} className="mt-[4px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-[#888ae5] cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.08)] font-semibold">Сбросить фильтр</button>
        ) : (
          <button onClick={() => router.push('/?filter=text')} className="mt-[4px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-white cursor-pointer transition-all hover:brightness-110 font-semibold" style={{ background: 'linear-gradient(135deg, #888ae5, #6b6dce)' }}>
            Начать диалог
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {items.map((session, i) => {
        const lastMsg = session.messages[session.messages.length - 1]
        const preview = lastMsg?.role === 'assistant' ? lastMsg.content.slice(0, 80) : ''
        const date = new Date(session.updatedAt)
        const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
        return (
          <div
            key={session.id}
            onClick={() => { if (!isLoggedIn) { router.push('/auth'); return; } router.push(`/chat/${session.modelId}?session=${session.id}`); }}
            className={`flex items-center gap-[16px] px-[20px] py-[16px] cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors rounded-[12px] group ${
              i < items.length - 1 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''
            }`}
          >
            <div className="shrink-0 size-[40px] flex items-center justify-center">
              <ModelIcon modelId={session.modelId} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-manrope font-semibold text-[14px] text-white leading-[22px] truncate">{session.title}</p>
              <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.4)] leading-[20px] truncate">{preview}</p>
            </div>
            <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.3)] leading-[20px] shrink-0">{time}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onRequestDelete(session.id); }}
              className="shrink-0 size-[32px] rounded-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[rgba(248,113,113,0.12)] transition-all cursor-pointer"
              title="Удалить"
            >
              <Trash2 size={14} className="text-[rgba(255,255,255,0.3)] hover:text-[#f87171]" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

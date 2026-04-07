'use client'

import { useRouter } from 'next/navigation'
import { Play, ImageIcon } from 'lucide-react'
import { ModelIcon } from '@/components/shared/model-icon'
import { useAuthStore } from '@/stores/auth'
import { getModelById } from '@/data/ai-models'

const EMPTY_ICONS: Record<'image' | 'video', string> = {
  image: '/assets/models/history-image.png',
  video: '/assets/models/history-video.png',
}

const EMPTY_TEXT: Record<'image' | 'video', string> = {
  image: 'Сгенерируйте изображение — результат сохранится здесь',
  video: 'Создайте видео с помощью нейросети — оно появится здесь',
}

const EMPTY_BTN: Record<'image' | 'video', { label: string; filter: string }> = {
  image: { label: 'Сгенерировать', filter: 'image' },
  video: { label: 'Создать видео', filter: 'video' },
}

const SITE_LOGO = '/assets/models/logo.png'

interface HistoryItem {
  id: string
  modelId: string
  title: string
  preview: string
  time: string
  dateStr: string
  type: 'text' | 'image' | 'video'
}

interface PendingGen {
  id: string
  modelId: string
  type: 'image' | 'video' | 'text'
  status: 'pending' | 'completed'
  startedAt: number
  prompt: string
  sessionId?: string
}

interface HistoryMediaGridProps {
  items: HistoryItem[]
  mediaType: 'image' | 'video'
  hasActiveFilter: boolean
  onViewItem: (item: HistoryItem) => void
  onRequestDelete: (id: string) => void
  onClearFilter: () => void
  pendingGenerations?: PendingGen[]
}

function PendingCard({ gen }: { gen: PendingGen }) {
  const model = getModelById(gen.modelId)
  const colors = model?.glowColors ?? ['#888ae5', '#65ded8']
  const c1 = colors[0]
  const c2 = colors[1] ?? colors[0]

  return (
    <div className="aspect-square rounded-[14px] overflow-hidden relative">
      <div
        className="absolute inset-0 animate-shimmer-card"
        style={{
          background: `linear-gradient(-45deg, ${c1}22, ${c2}33, ${c1}15, ${c2}28)`,
          backgroundSize: '300% 300%',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px]">
        <div className="relative">
          <img
            src={SITE_LOGO}
            alt=""
            className="size-[36px] object-contain animate-pulse-slow"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }}
          />
          <div
            className="absolute -inset-[8px] rounded-full animate-ping-slow opacity-30"
            style={{ background: `radial-gradient(circle, ${c1}40, transparent 70%)` }}
          />
        </div>
        <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-medium text-center px-[8px] line-clamp-2">
          Генерация...
        </p>
      </div>
      <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[5px] bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] rounded-[8px] px-[6px] py-[3px]">
        {model && <ModelIcon modelId={model.id} size={14} />}
        <span className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.5)]">
          {gen.prompt || model?.name || ''}
        </span>
      </div>
      <style>{`
        @keyframes shimmerCard {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        .animate-shimmer-card { animation: shimmerCard 3s ease infinite; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .animate-ping-slow { animation: pingSlow 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export function HistoryMediaGrid({
  items,
  mediaType,
  hasActiveFilter,
  onViewItem,
  onRequestDelete,
  onClearFilter,
  pendingGenerations = [],
}: HistoryMediaGridProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  if (items.length === 0 && pendingGenerations.length === 0) {
    const isVideo = mediaType === 'video'
    const btn = EMPTY_BTN[mediaType]
    return (
      <div className="col-span-5 flex flex-col items-center justify-center py-[60px] gap-[12px]">
        {hasActiveFilter ? (
          <img src="/assets/models/search-empty.png" alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
        ) : (
          <img src={EMPTY_ICONS[mediaType]} alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
        )}
        <p className="font-manrope font-semibold text-[16px] text-[rgba(255,255,255,0.5)]">
          {hasActiveFilter ? 'По вашему запросу ничего не найдено' : isVideo ? 'Нет видео' : 'Нет изображений'}
        </p>
        <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.25)] text-center max-w-[320px]">
          {hasActiveFilter
            ? 'Нет записей с выбранным фильтром. Попробуйте сбросить фильтр.'
            : EMPTY_TEXT[mediaType]}
        </p>
        {hasActiveFilter ? (
          <button onClick={onClearFilter} className="mt-[4px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-[#888ae5] cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.08)] font-semibold">Сбросить фильтр</button>
        ) : (
          <button onClick={() => router.push(`/?filter=${btn.filter}`)} className="mt-[4px] px-[16px] py-[8px] rounded-[10px] text-[12px] text-white cursor-pointer transition-all hover:brightness-110 font-semibold" style={{ background: 'linear-gradient(135deg, #888ae5, #6b6dce)' }}>
            {btn.label}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {pendingGenerations.map((gen) => (
        <PendingCard key={`pending-${gen.id}`} gen={gen} />
      ))}
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
            <img src="/assets/models/trash_icon.png" alt="" width={12} height={12} className="brightness-0 invert opacity-70" />
          </button>
        </div>
      ))}
    </>
  )
}

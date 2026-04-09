'use client'

import { useRouter } from 'next/navigation'

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

interface HistoryMediaEmptyProps {
  mediaType: 'image' | 'video'
  hasActiveFilter: boolean
  onClearFilter: () => void
}

export function HistoryMediaEmpty({ mediaType, hasActiveFilter, onClearFilter }: HistoryMediaEmptyProps) {
  const router = useRouter()
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

'use client'

import Image from 'next/image'
import { CustomIcon } from '@/components/shared/custom-icon'
import type { LeaderboardModel } from '@/data/leaderboard'
import { CustomRadar } from './custom-radar'
import { UserRating } from './user-rating'

function getMetrics(item: LeaderboardModel) {
  if (item.category === 'text') return [
    { id: 'speed', label: 'Скорость', value: item.speed, color: '#6bc085' },
    { id: 'accuracy', label: 'Точность', value: item.accuracy, color: '#e07070' },
    { id: 'costEfficiency', label: 'Выгода', value: item.costEfficiency, color: '#70b8e0' },
    { id: 'creativity', label: 'Креативность', value: item.creativity, color: '#e0a34f' },
    { id: 'reasoning', label: 'Логика', value: item.reasoning, color: '#c084fc' },
    { id: 'analytics', label: 'Аналитика', value: item.analytics, color: '#818cf8' },
  ]
  if (item.category === 'image') return [
    { id: 'creativity', label: 'Качество', value: item.creativity, color: '#e0a34f' },
    { id: 'accuracy', label: 'Детализация', value: item.accuracy, color: '#e07070' },
    { id: 'speed', label: 'Скорость генерации', value: item.speed, color: '#6bc085' },
    { id: 'costEfficiency', label: 'Цена/Качество', value: item.costEfficiency, color: '#70b8e0' },
    { id: 'score', label: 'Фотореализм', value: item.score, color: '#22d3ee' },
  ]
  return [
    { id: 'creativity', label: 'Кинематографичность', value: item.creativity, color: '#e0a34f' },
    { id: 'accuracy', label: 'Стабильность кадра', value: item.accuracy, color: '#e07070' },
    { id: 'speed', label: 'Скорость генерации', value: item.speed, color: '#6bc085' },
    { id: 'costEfficiency', label: 'Цена/Качество', value: item.costEfficiency, color: '#70b8e0' },
    { id: 'score', label: 'Качество видео', value: item.score, color: '#22d3ee' },
  ]
}

export function ModelCardExpanded({ item, onOpenChat }: { item: LeaderboardModel; onOpenChat: (item: LeaderboardModel) => void }) {
  const allMetrics = getMetrics(item)
  const radarData = allMetrics.map(m => ({ subject: m.label, val: m.value }))

  return (
    <div className="px-[16px] pb-[16px] pt-[4px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[12px] bg-[#0c0c10]/40 rounded-[12px] p-[16px] border border-[rgba(255,255,255,0.03)] relative">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-[6px] mb-[10px]">
              <Image src="/icons/info_icon.png" alt="" width={12} height={12} className="[filter:invert(60%)_sepia(50%)_saturate(500%)_hue-rotate(205deg)_brightness(95%)]" />
              <h4 className="text-[11px] text-white font-bold uppercase tracking-wider">О модели</h4>
            </div>
            <p className="text-[13px] text-[rgba(255,255,255,0.7)] leading-[1.6] mb-[16px]">{item.description}</p>
          </div>
          <UserRating modelId={item.id} baseVotes={item.votes} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-[12px] border-t border-[rgba(255,255,255,0.06)] gap-3 sm:gap-0 mt-auto">
            <div className="flex items-center gap-[16px]">
              <div className="flex items-center gap-[6px]">
                <img src="/icons/users_icon.png" alt="" width={14} height={14} className="[filter:brightness(0)_saturate(100%)_invert(55%)_sepia(50%)_saturate(600%)_hue-rotate(210deg)]" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-wider">Аудитория</span>
                  <span className="text-[13px] text-white font-black">{item.usagePercent}%</span>
                </div>
              </div>
              <div className="w-[1px] h-[24px] bg-[rgba(255,255,255,0.06)]" />
              <div className="flex items-center gap-[6px]">
                <Image src="/icons/like_icon.png" alt="" width={14} height={14} className="[filter:brightness(0)_saturate(100%)_invert(55%)_sepia(50%)_saturate(600%)_hue-rotate(210deg)]" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-wider">Оценки</span>
                  <span className="text-[13px] text-white font-black">{item.votes.toLocaleString('ru-RU')}</span>
                </div>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onOpenChat(item) }} className="w-full sm:w-auto flex items-center justify-center gap-[6px] px-[20px] py-[10px] rounded-[10px] bg-[#888ae5] hover:bg-[#9a9cf0] text-white text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(136,138,229,0.3)] hover:shadow-[0_4px_16px_rgba(136,138,229,0.4)]">
              Попробовать <Image src="/icons/arrow_right_icon.png" alt="" width={11} height={11} className="brightness-0 invert" />
            </button>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col bg-[rgba(255,255,255,0.02)] rounded-[10px] p-[16px] border border-[rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between mb-[12px]">
            <div className="flex items-center gap-[6px]">
              <CustomIcon src="/icons/model_raiting_parametr.png" size={12} />
              <h4 className="text-[11px] text-white font-bold uppercase tracking-wider">Подробные оценки</h4>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            {allMetrics.map(m => (
              <div key={m.id} className="flex flex-col gap-[4px]">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[rgba(255,255,255,0.6)] font-medium">{m.label}</span>
                  <span className="text-[12px] text-white font-bold">{m.value}</span>
                </div>
                <div className="w-full h-[4px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 flex flex-col justify-center items-center bg-[rgba(255,255,255,0.02)] rounded-[10px] p-[10px] border border-[rgba(255,255,255,0.03)] min-h-[180px]">
          <CustomRadar data={radarData} size={160} />
        </div>
      </div>
    </div>
  )
}

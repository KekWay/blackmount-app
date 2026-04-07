'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { ScalesIcon } from './scales-icon'
import { RatingModelIcon } from './rating-model-icon'
import { APP_ASSETS } from '@/lib/assets'
import type { LeaderboardModel } from '@/data/leaderboard'

interface CompareOverlayProps {
  models: LeaderboardModel[]
  onClose: () => void
}

export function CompareOverlay({ models, onClose }: CompareOverlayProps) {
  const hasTextModel = models.some(m => m.category === 'text')
  const allMetrics: { key: keyof LeaderboardModel; label: string; color: string }[] = [
    { key: 'usagePercent', label: 'Использование', color: '#888ae5' },
    { key: 'score', label: 'Общая оценка', color: '#4ade80' },
    { key: 'speed', label: 'Скорость', color: '#6bc085' },
    { key: 'accuracy', label: 'Точность', color: '#e07070' },
    { key: 'costEfficiency', label: 'Цена/Качество', color: '#70b8e0' },
    { key: 'creativity', label: 'Креативность', color: '#e0a34f' },
    { key: 'reasoning', label: 'Логика', color: '#c084fc' },
    { key: 'analytics', label: 'Аналитика', color: '#818cf8' },
  ]
  const metrics = hasTextModel
    ? allMetrics
    : allMetrics.filter(m => m.key !== 'reasoning' && m.key !== 'analytics')

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#19181e] rounded-[20px] w-[600px] max-w-[95vw] max-h-[85vh] overflow-y-auto border border-[rgba(255,255,255,0.08)] chat-scrollbar shadow-2xl" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
        <div className="px-[16px] md:px-[24px] py-[20px] md:py-[24px] overflow-x-auto">
          <div className="flex items-center justify-between mb-[20px]">
            <div className="flex items-center gap-[8px]">
              <div className="p-1.5 bg-[#888ae5]/20 rounded-lg"><ScalesIcon size={16} className="text-[#888ae5]" /></div>
              <span className="text-[16px] text-white font-extrabold">Сравнение моделей</span>
            </div>
            <button onClick={onClose} className="group p-1.5 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"><Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" /></button>
          </div>
          <div className="grid gap-[6px] mb-[12px]" style={{ gridTemplateColumns: `140px repeat(${models.length}, 1fr)` }}>
            <div />
            {models.map((m) => (
              <div key={m.id} className="flex flex-col items-center gap-[6px] py-[10px] bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <RatingModelIcon item={m} size={32} />
                <span className="text-[11px] text-white text-center px-1 font-bold">{m.name}</span>
                <span className="text-[9px] text-[#888ae5] bg-[#888ae5]/10 px-1.5 py-0.5 rounded-sm font-semibold">{m.usagePercent}% юзеров</span>
              </div>
            ))}
          </div>
          {metrics.map((metric) => {
            const vals = models.map((m) => m[metric.key] as number)
            const maxVal = Math.max(...vals)
            return (
              <div key={metric.key as string} className="grid gap-[6px] py-[10px] border-t border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.01)] transition-colors rounded-md px-2 -mx-2" style={{ gridTemplateColumns: `140px repeat(${models.length}, 1fr)` }}>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-medium">{metric.label}</span>
                </div>
                {vals.map((v, i) => (
                  <div key={i} className="flex flex-col items-center justify-center gap-[4px]">
                    <span className={`text-[12px] ${v === maxVal ? "text-white font-extrabold" : "text-[rgba(255,255,255,0.5)] font-semibold"}`}>{metric.key === 'usagePercent' ? `${v}%` : v}</span>
                    <div className="w-[80%] h-[3px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: v === maxVal ? metric.color : `${metric.color}60` }} initial={{ width: 0 }} animate={{ width: `${(v / Math.max(maxVal, 1)) * 100}%` }} transition={{ duration: 0.6, delay: 0.1 }} />
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
          <div className="grid gap-[6px] py-[10px] border-t border-[rgba(255,255,255,0.04)] px-2 -mx-2" style={{ gridTemplateColumns: `140px repeat(${models.length}, 1fr)` }}>
            <div className="flex items-center gap-[4px]"><span className="text-[11px] text-[rgba(255,255,255,0.5)] font-medium">Стоимость</span></div>
            {models.map((m) => (
              <div key={m.id} className="flex items-center justify-center gap-[4px] bg-[rgba(255,255,255,0.03)] py-1 rounded-md">
                <span className="text-[12px] text-white font-extrabold">{m.price}</span>
                <img alt="" src={APP_ASSETS.coin} className="size-[12px]" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

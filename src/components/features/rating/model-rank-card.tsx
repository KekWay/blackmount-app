'use client'

import Image from 'next/image'
import { TrendingUp, TrendingDown, Users } from 'lucide-react'
import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'
import type { LeaderboardModel } from '@/data/leaderboard'

interface ModelRankCardProps {
  model: LeaderboardModel
  rank: number
}

const CATEGORY_BADGE: Record<LeaderboardModel['category'], { label: string; className: string }> = {
  text: { label: 'Текст', className: 'bg-blue-500/20 text-blue-400' },
  image: { label: 'Изображение', className: 'bg-purple-500/20 text-purple-400' },
  video: { label: 'Видео', className: 'bg-amber-500/20 text-amber-400' },
}

function scoreColor(score: number): string {
  if (score >= 95) return 'text-emerald-400'
  if (score >= 90) return 'text-sky-400'
  if (score >= 85) return 'text-amber-400'
  return 'text-white/60'
}

export function ModelRankCard({ model, rank }: ModelRankCardProps) {
  const assets = model.aiModelRef ? MODEL_ASSETS[model.aiModelRef as ModelId] : null
  const logoSrc = assets?.colorLogo ?? null
  const badge = CATEGORY_BADGE[model.category]

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors px-4 py-3">
      {/* Rank */}
      <span className="w-8 shrink-0 text-center font-maven font-bold text-lg text-white/30">
        {rank}
      </span>

      {/* Logo */}
      <div className="w-9 h-9 shrink-0 rounded-xl bg-white/[0.06] flex items-center justify-center overflow-hidden">
        {logoSrc ? (
          <Image src={logoSrc} alt={model.name} width={28} height={28} className="object-contain" />
        ) : (
          <span className="text-white/20 text-xs font-bold">{model.name[0]}</span>
        )}
      </div>

      {/* Name + description */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-maven font-bold text-sm text-white truncate">{model.name}</span>
        <span className="text-[11px] text-white/30 truncate">{model.description}</span>
      </div>

      {/* Category badge */}
      <span className={`hidden sm:inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium ${badge.className}`}>
        {badge.label}
      </span>

      {/* Score */}
      <div className="shrink-0 flex flex-col items-center w-12">
        <span className={`font-maven font-extrabold text-lg leading-tight ${scoreColor(model.score)}`}>
          {model.score}
        </span>
        <span className="text-[9px] text-white/20 uppercase tracking-wider">Score</span>
      </div>

      {/* Trend */}
      <div className="hidden md:flex shrink-0 items-center gap-1 w-16 justify-end">
        {model.trend >= 0 ? (
          <TrendingUp size={13} className="text-emerald-400" />
        ) : (
          <TrendingDown size={13} className="text-red-400" />
        )}
        <span className={`text-xs font-medium ${model.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {model.trend > 0 ? '+' : ''}{model.trend}%
        </span>
      </div>

      {/* Usage */}
      <div className="hidden lg:flex shrink-0 items-center gap-1 w-20 justify-end">
        <Users size={12} className="text-white/20" />
        <span className="text-xs text-white/40">{model.usagePercent}%</span>
      </div>
    </div>
  )
}

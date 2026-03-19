'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TrendingUp, Users, ArrowRight, Flame } from 'lucide-react'
import { trendingModels } from '@/data/trending'
import { aiModels } from '@/data/ai-models'
import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'

const PODIUM_COLORS = [
  { glow: 'rgba(255,215,0,0.15)', num: '#FFD700' },
  { glow: 'rgba(192,192,210,0.12)', num: '#C0C0D2' },
  { glow: 'rgba(205,127,50,0.12)', num: '#CD7F32' },
]

function getCategoryLabel(cat: string) {
  if (cat === 'text') return { label: 'Текст', color: '#888ae5' }
  if (cat === 'image') return { label: 'Изображение', color: '#ef4444' }
  return { label: 'Видео', color: '#22d3ee' }
}

export function TrendingModels() {
  const router = useRouter()
  const top3 = trendingModels.slice(0, 3)
  const rest = trendingModels.slice(3, 8)

  return (
    <section className="mb-10" aria-label="Trending models">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Flame size={25} className="text-orange-400" />
          <div>
            <h2 className="text-[22px] font-bold text-white">Популярное</h2>
            <p className="text-xs text-white/35">По частоте использования за неделю</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/rating')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] text-[11px] text-white/40 cursor-pointer hover:bg-white/[0.08] transition-colors font-semibold"
        >
          <TrendingUp size={12} /> Рейтинг <ArrowRight size={10} />
        </button>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {top3.map((tm, idx) => {
          const m = aiModels.find((a) => a.id === tm.id)
          if (!m) return null
          const { label: catLabel, color: catColor } = getCategoryLabel(m.category)
          const place = PODIUM_COLORS[idx]
          const assets = MODEL_ASSETS[tm.id as ModelId]
          const logoSrc = assets ? ('colorLogo' in assets ? assets.colorLogo : null) : null

          return (
            <button
              key={tm.versionId}
              onClick={() => router.push(`/chat/${tm.id}`)}
              className="group relative rounded-2xl p-4 border border-white/5 bg-[#1a1924] transition-all duration-300 hover:-translate-y-1 text-left flex flex-col gap-3 overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-extrabold" style={{ color: place.num }}>
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: catColor }}>
                    {catLabel}
                  </span>
                </div>
                {logoSrc && (
                  <Image src={logoSrc} alt={m.name} width={28} height={28} className="object-contain" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-base font-bold text-white truncate">{tm.versionLabel}</p>
                <p className="text-xs text-white/40 truncate">{tm.desc}</p>
              </div>
              <div className="flex items-center justify-between w-full mt-auto pt-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className={tm.change >= 0 ? 'text-green-400' : 'text-red-400'} />
                  <span className={`text-xs font-bold ${tm.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(tm.change)}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-primary" />
                  <span className="text-xs text-primary font-bold">{tm.usage}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Positions 4-8 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {rest.map((tm, idx) => {
          const m = aiModels.find((a) => a.id === tm.id)
          if (!m) return null
          const realIdx = idx + 3
          const { label: catLabel, color: catColor } = getCategoryLabel(m.category)

          return (
            <button
              key={tm.versionId}
              onClick={() => router.push(`/chat/${tm.id}`)}
              className="group relative rounded-[14px] p-3 border border-white/5 bg-[#1a1924] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 text-left flex flex-col gap-2.5 overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-white/20">#{realIdx + 1}</span>
                  <span className="text-[9px] font-semibold" style={{ color: catColor }}>{catLabel}</span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[13px] font-bold text-white truncate">{tm.versionLabel}</p>
                <p className="text-[10px] text-white/40 truncate mt-0.5">{tm.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className={`text-[10px] font-bold ${tm.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tm.change >= 0 ? '↑' : '↓'}{Math.abs(tm.change)}%
                </span>
                <div className="flex items-center gap-1">
                  <Users size={10} className="text-primary" />
                  <span className="text-[10px] text-primary font-bold">{tm.usage}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { TrendingUp, Users, ArrowRight } from 'lucide-react'
import { trendingModels } from '@/data/trending'
import { aiModels } from '@/data/ai-models'
import { ModelIcon } from '@/components/shared/model-icon'

const imgFireIcon = '/assets/models/fb08020829dd75b6763011bb1c5501cbcaed923d.png'

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
    <section className="mb-[40px]" aria-label="Trending models">
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-[10px]">
          <img src={imgFireIcon} alt="" width={25} height={25} className="object-contain" />
          <div>
            <h2 className="text-[22px] font-bold text-white">
              Популярное
            </h2>
            <p className="text-[12px] text-[rgba(255,255,255,0.35)] font-manrope">
              По частоте использования за неделю
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/rating')}
          className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[12px] bg-[rgba(255,255,255,0.04)] text-[11px] text-[rgba(255,255,255,0.4)] cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors font-semibold"
        >
          <TrendingUp size={12} /> Рейтинг <ArrowRight size={10} />
        </button>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[16px]">
        {top3.map((tm, idx) => {
          const m = aiModels.find((a) => a.id === tm.id)
          if (!m) return null
          const { label: catLabel, color: catColor } = getCategoryLabel(m.category)
          const place = PODIUM_COLORS[idx]

          return (
            <button
              key={tm.versionId}
              onClick={() => router.push(`/chat/${tm.id}`)}
              className="group relative rounded-[16px] p-[16px] border border-[rgba(255,255,255,0.05)] bg-[#1a1924] transition-all duration-300 hover:-translate-y-1 text-left flex flex-col gap-[12px] overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[10px]">
                  <span className="text-[20px] font-extrabold" style={{ color: place.num }}>
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: catColor }}>
                    {catLabel}
                  </span>
                </div>
                <ModelIcon modelId={tm.id} size={28} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[16px] font-bold text-white truncate">{tm.versionLabel}</p>
                <p className="text-[12px] text-[rgba(255,255,255,0.4)] truncate">{tm.desc}</p>
              </div>
              <div className="flex items-center justify-between w-full mt-auto pt-[4px]">
                <div className="flex items-center gap-[6px]">
                  <TrendingUp
                    size={14}
                    className={tm.change >= 0 ? 'text-green-400' : 'text-red-400'}
                  />
                  <span
                    className={`text-[12px] font-bold ${tm.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {Math.abs(tm.change)}%
                  </span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <Users size={13} className="text-[#888ae5]" />
                  <span className="text-[12px] text-[#888ae5] font-bold">{tm.usage}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Positions 4-8 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[12px]">
        {rest.map((tm, idx) => {
          const m = aiModels.find((a) => a.id === tm.id)
          if (!m) return null
          const realIdx = idx + 3
          const { label: catLabel, color: catColor } = getCategoryLabel(m.category)

          return (
            <button
              key={tm.versionId}
              onClick={() => router.push(`/chat/${tm.id}`)}
              className="group relative rounded-[14px] p-[12px] border border-[rgba(255,255,255,0.05)] bg-[#1a1924] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(136,138,229,0.3)] text-left flex flex-col gap-[10px] overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[14px] font-extrabold text-[rgba(255,255,255,0.2)]">
                    #{realIdx + 1}
                  </span>
                  <span className="text-[9px] font-semibold" style={{ color: catColor }}>
                    {catLabel}
                  </span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[13px] font-bold text-white truncate">{tm.versionLabel}</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.4)] truncate mt-[2px]">
                  {tm.desc}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-[4px]">
                <span
                  className={`text-[10px] font-bold ${tm.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {tm.change >= 0 ? '↑' : '↓'}
                  {Math.abs(tm.change)}%
                </span>
                <div className="flex items-center gap-[4px]">
                  <Users size={10} className="text-[#888ae5]" />
                  <span className="text-[10px] text-[#888ae5] font-bold">{tm.usage}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

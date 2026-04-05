'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { trendingModels } from '@/data/trending'
import { aiModels } from '@/data/ai-models'
import { TrendingCard } from './trending-card'

const imgFireIcon = '/assets/models/fire-icon.png'

export function TrendingModels() {
  const router = useRouter()

  return (
    <section className="mb-[40px]" aria-label="Trending models">
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-[10px]">
          <img src={imgFireIcon} alt="Trending" className="shrink-0 size-[25px] object-cover" />
          <div>
            <h2 className="text-[22px] font-bold text-white">
              Популярное
            </h2>
            <p className="text-[12px] text-[rgba(255,255,255,0.35)]">
              По частоте использования за неделю
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/rating')}
          className="flex items-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] rounded-[12px] px-[12px] md:px-[16px] h-[32px] md:h-[36px] transition-colors cursor-pointer"
        >
          <span className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.6)]">
            Смотреть рейтинг
          </span>
          <Image src="/icons/arrow_right_icon.png" alt="" width={11} height={11} className="brightness-0 invert opacity-40" />
        </button>
      </div>

      {/* ── TOP 3 Podium ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px] sm:gap-[16px] mb-[16px]">
        {trendingModels.slice(0, 3).map((tm, idx) => {
          const m = aiModels.find((a) => a.id === tm.id)
          if (!m) return null
          return (
            <TrendingCard
              key={tm.versionId}
              modelId={m.id}
              versionLabel={tm.versionLabel}
              rank={idx + 1}
              usage={tm.usage}
              change={tm.change}
              category={m.category}
              onClick={() => router.push(`/chat/${tm.id}?version=${tm.versionId}`)}
            />
          )
        })}
      </div>

      {/* ── Remaining 4-8 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[12px]">
        {trendingModels.slice(3, 8).map((tm, idx) => {
          const m = aiModels.find((a) => a.id === tm.id)
          if (!m) return null
          return (
            <TrendingCard
              key={tm.versionId}
              modelId={m.id}
              versionLabel={tm.versionLabel}
              rank={idx + 4}
              usage={tm.usage}
              change={tm.change}
              category={m.category}
              onClick={() => router.push(`/chat/${tm.id}?version=${tm.versionId}`)}
            />
          )
        })}
      </div>
    </section>
  )
}

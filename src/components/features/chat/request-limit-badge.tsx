'use client'

import { useState } from 'react'
import { CustomIcon } from '@/components/shared/custom-icon'
import { DAILY_LIMITS, getResetTimeString, useRequestLimiterStore } from '@/stores/request-limiter'
import { useSubscriptionStore } from '@/stores/subscription'
import { useHydrated } from '@/lib/use-hydration'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function RequestLimitBadge() {
  const [hovered, setHovered] = useState(false)
  const hydrated = useHydrated()
  const count = useRequestLimiterStore((s) => (s.date === todayStr() ? s.count : 0))
  const tier = useSubscriptionStore((s) => s.subscription.tier)

  const limit = DAILY_LIMITS[tier] ?? DAILY_LIMITS.free
  const used = Math.min(count, limit)
  const remaining = Math.max(0, limit - used)

  const isEmpty = remaining === 0
  const isLow = remaining > 0 && remaining <= 3

  const iconClass = isEmpty
    ? 'opacity-90 [filter:brightness(0)_saturate(100%)_invert(33%)_sepia(95%)_saturate(7000%)_hue-rotate(355deg)]'
    : isLow
    ? 'opacity-90 [filter:brightness(0)_saturate(100%)_invert(85%)_sepia(60%)_saturate(700%)_hue-rotate(2deg)]'
    : 'opacity-50'

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        aria-label="Лимит запросов"
        className="rounded-[12px] size-[34px] flex items-center justify-center cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.12)]"
      >
        <CustomIcon src="/icons/info_2.png" size={13} className={iconClass} />
      </button>

      {hovered && (
        <div
          role="tooltip"
          className="absolute left-0 top-full mt-[8px] z-[40] min-w-[220px] bg-[#1e1d26] border border-white/10 rounded-[12px] px-3 py-2 text-sm shadow-lg font-manrope text-white animate-in fade-in duration-200"
        >
          <div className="flex justify-between gap-3 leading-[20px]">
            <span className="text-white/70">Запросов сегодня:</span>
            <span>{hydrated ? (<><span className="text-[#888ae5] font-semibold">{used}</span><span className="text-white/50">/{limit}</span></>) : (<span className="inline-block w-10 h-3.5 bg-white/[0.06] rounded animate-pulse align-middle" />)}</span>
          </div>
          <div className="flex justify-between gap-3 leading-[20px]">
            <span className="text-white/70">Осталось:</span>
            {hydrated ? (
              <span className="text-[#888ae5] font-semibold">{remaining}</span>
            ) : (
              <span className="inline-block w-6 h-3.5 bg-white/[0.06] rounded animate-pulse" />
            )}
          </div>
          {isEmpty && (
            <div className="mt-1 pt-1 border-t border-white/10 text-[12px] text-white/60 leading-[16px]">
              Лимит исчерпан. Обновление {getResetTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

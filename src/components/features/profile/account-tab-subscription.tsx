'use client'

import { useSubscriptionStore } from '@/stores/subscription'
import type { SubscriptionTier } from '@/types'
import { IMG_LOGO } from './profile-data'

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'FREE',
  basic: 'BASIC',
  pro: 'PRO',
  max: 'MAX',
}

const TIER_PRICES: Record<SubscriptionTier, string> = {
  free: '',
  basic: '499\u20BD/мес',
  pro: '999\u20BD/мес',
  max: '1 799\u20BD/мес',
}

export function AccountTabSubscription({ onNavigateSubscription }: { onNavigateSubscription: () => void }) {
  const subscription = useSubscriptionStore((s) => s.subscription)
  const hasActiveSub = useSubscriptionStore((s) => s.hasActiveSubscription)
  const hasSubscription = hasActiveSub()

  if (hasSubscription) {
    return (
      <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[29px] py-[18px] flex items-center justify-between">
        <div className="flex items-center gap-[14px]">
          <div className="relative shrink-0 size-[32px]">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_LOGO} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-[8px]">
              <p className="font-manrope text-[14px] text-white leading-[22px] font-extrabold">BLACK MOUNT</p>
              <div className="h-[14px] rounded-[4px] flex items-center justify-center px-[6px] shrink-0" style={{ backgroundImage: 'linear-gradient(122deg, rgb(171, 135, 228) 18%, rgb(155, 33, 130) 88%)' }}>
                <span className="font-manrope text-[8px] text-white leading-none tracking-[0.2px] font-extrabold">{TIER_LABELS[subscription.tier] || subscription.tier.toUpperCase()}</span>
              </div>
            </div>
            <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.35)] leading-[18px]">
              Истекает: {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '\u2014'} · {TIER_PRICES[subscription.tier] || ''}
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateSubscription}
          className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[14px] h-[37.5px] flex items-center cursor-pointer transition-colors"
        >
          <span className="font-manrope font-medium text-[13px] text-white">Управление</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-[20px] overflow-hidden relative group cursor-pointer"
      onClick={onNavigateSubscription}
      style={{
        background: 'linear-gradient(135deg, rgba(136,138,229,0.15) 0%, rgba(100,50,150,0.2) 40%, rgba(160,60,140,0.18) 70%, rgba(136,138,229,0.1) 100%)',
      }}
    >
      <div className="absolute inset-0 rounded-[20px] border border-[rgba(136,138,229,0.25)] group-hover:border-[rgba(136,138,229,0.45)] transition-colors duration-500" />
      <div className="absolute top-[-30px] right-[-20px] w-[140px] h-[140px] bg-[#888ae5] opacity-[0.12] blur-[60px] pointer-events-none group-hover:opacity-[0.2] transition-opacity duration-500" />
      <div className="absolute bottom-[-20px] left-[20%] w-[100px] h-[100px] bg-[#c060a0] opacity-[0.1] blur-[50px] pointer-events-none" />
      <div className="relative z-10 px-[28px] py-[24px] flex items-center justify-between">
        <div className="flex gap-[16px] items-center">
          <div className="relative shrink-0">
            <div className="absolute inset-[-6px] rounded-full bg-gradient-to-br from-[#888ae5]/25 to-[#c060a0]/25 blur-[10px] group-hover:blur-[14px] transition-all duration-500" />
            <img alt="" className="relative w-[40px] h-[40px] object-contain" src={IMG_LOGO} />
          </div>
          <div className="flex flex-col gap-[3px]">
            <p className="font-manrope text-[17px] text-white leading-[1.2]">
              <span className="font-extrabold">Подписка </span>
              <span className="font-bakbak">BLACK MOUNT</span>
            </p>
            <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.4)] leading-[1.4]">
              Доступ к лучшим моделям и увеличенным лимитам
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onNavigateSubscription(); }}
          className="bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] px-[20px] h-[40px] flex items-center gap-[8px] shrink-0 cursor-pointer transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(136,138,229,0.3)]"
        >
          <img src="/assets/models/stars_icon_2.png" alt="" className="size-[14px] object-contain brightness-0 invert" />
          <p className="font-manrope font-extrabold text-[13px] text-white">Оформить</p>
        </button>
      </div>
    </div>
  )
}

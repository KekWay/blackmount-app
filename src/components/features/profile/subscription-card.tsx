'use client'

import Link from 'next/link'
import { Crown } from 'lucide-react'
import { useSubscriptionStore } from '@/stores/subscription'

export function SubscriptionCard() {
  const subscription = useSubscriptionStore((s) => s.subscription)
  const hasActiveSub = useSubscriptionStore((s) => s.hasActiveSubscription)
  const isActive = hasActiveSub()

  const formattedExpiry = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
          <Crown className="h-5 w-5 text-purple-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-white/50">Текущая подписка</span>
          <span className="text-lg font-semibold text-white">
            {subscription.tier.toUpperCase()}
          </span>
        </div>
      </div>

      {isActive && formattedExpiry && (
        <p className="text-sm text-white/50">
          Действует до: <span className="text-white/70">{formattedExpiry}</span>
        </p>
      )}

      {!isActive && (
        <p className="text-sm text-white/50">
          Оформите подписку, чтобы получить доступ ко всем моделям и версиям.
        </p>
      )}

      <Link
        href="/subscription"
        className="flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
      >
        {isActive ? 'Управление подпиской' : 'Оформить подписку'}
      </Link>
    </div>
  )
}

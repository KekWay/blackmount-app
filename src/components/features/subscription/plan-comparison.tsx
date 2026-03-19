'use client'

import { useState } from 'react'
import { useSubscriptionStore } from '@/stores/subscription'
import { PlanCard } from '@/components/features/subscription/plan-card'
import type { SubscriptionTier } from '@/types'
import { cn } from '@/lib/utils'

const plans: {
  name: string
  tier: SubscriptionTier
  monthPrice: number | null
  coins: number
  dailyLimit: number
  features: string[]
  badge?: string
}[] = [
  {
    name: 'Free',
    tier: 'free',
    monthPrice: null,
    coins: 50,
    dailyLimit: 10,
    features: ['50 монет при регистрации', '10 запросов в день', 'Базовые модели'],
  },
  {
    name: 'Basic',
    tier: 'basic',
    monthPrice: 499,
    coins: 500,
    dailyLimit: 50,
    features: ['500 монет/мес', '50 запросов в день', 'Все базовые модели', 'Приоритетная очередь'],
  },
  {
    name: 'Pro',
    tier: 'pro',
    monthPrice: 999,
    coins: 1500,
    dailyLimit: 200,
    features: ['1 500 монет/мес', '200 запросов в день', 'Все модели включая Pro', 'Приоритетная генерация', 'Без водяных знаков'],
    badge: 'Популярный',
  },
  {
    name: 'Max',
    tier: 'ultra',
    monthPrice: 1799,
    coins: 4000,
    dailyLimit: 999,
    features: ['4 000 монет/мес', 'Безлимитные запросы', 'Все модели включая Ultra', 'Максимальный приоритет', 'API доступ', 'Персональная поддержка'],
  },
]

export function PlanComparison() {
  const [period, setPeriod] = useState<'month' | 'year'>('month')
  const { subscription, setSubscription } = useSubscriptionStore()

  const yearDiscount = 0.85

  function getPrice(monthPrice: number | null) {
    if (monthPrice === null) return null
    if (period === 'year') return Math.round(monthPrice * yearDiscount)
    return monthPrice
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPeriod('month')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            period === 'month'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          Месяц
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            period === 'year'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          Год <span className="text-xs opacity-75">-15%</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.tier}
            name={plan.name}
            price={getPrice(plan.monthPrice)}
            features={plan.features}
            badge={plan.badge}
            isCurrent={subscription.tier === plan.tier}
            onSelect={() => setSubscription(plan.tier)}
          />
        ))}
      </div>
    </div>
  )
}

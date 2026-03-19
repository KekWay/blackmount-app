'use client'

import { Coins, Sparkles, Crown } from 'lucide-react'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'

export function ProfileStats() {
  const balance = useBalanceStore((s) => s.balance)
  const genHistory = useBalanceStore((s) => s.genHistory)
  const subscription = useSubscriptionStore((s) => s.subscription)

  const stats = [
    {
      icon: Coins,
      label: 'Баланс',
      value: `${balance} монет`,
      color: 'text-amber-400',
    },
    {
      icon: Sparkles,
      label: 'Генерации',
      value: String(genHistory.length),
      color: 'text-blue-400',
    },
    {
      icon: Crown,
      label: 'Подписка',
      value: subscription.tier.toUpperCase(),
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <stat.icon className={`h-5 w-5 ${stat.color}`} />
          <span className="text-lg font-semibold text-white">{stat.value}</span>
          <span className="text-xs text-white/50">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

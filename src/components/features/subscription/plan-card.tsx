'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanCardProps {
  name: string
  price: number | null
  features: string[]
  badge?: string
  isCurrent: boolean
  onSelect: () => void
}

export function PlanCard({
  name,
  price,
  features,
  badge,
  isCurrent,
  onSelect,
}: PlanCardProps) {
  const isPro = name === 'Pro'

  return (
    <div
      className={cn(
        'relative rounded-2xl p-[1px]',
        isPro
          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
          : 'bg-border',
      )}
    >
      <div className="flex h-full flex-col rounded-2xl bg-card p-5">
        {badge && (
          <span className="mb-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {badge}
          </span>
        )}

        <h3 className="text-lg font-bold text-foreground">{name}</h3>

        <div className="mt-2 flex items-baseline gap-1">
          {price !== null ? (
            <>
              <span className="text-3xl font-extrabold text-foreground">
                {price}
              </span>
              <span className="text-sm text-muted-foreground">{'\u20BD'}/мес</span>
            </>
          ) : (
            <span className="text-3xl font-extrabold text-foreground">
              Бесплатно
            </span>
          )}
        </div>

        <ul className="mt-5 flex flex-1 flex-col gap-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onSelect}
          disabled={isCurrent}
          className={cn(
            'mt-5 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors',
            isCurrent
              ? 'cursor-default bg-muted text-muted-foreground'
              : isPro
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        >
          {isCurrent ? 'Текущий план' : 'Выбрать'}
        </button>
      </div>
    </div>
  )
}

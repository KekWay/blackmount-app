'use client'

import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import { useHydrated } from '@/lib/use-hydration'
import { Badge } from '@/components/ui/badge'

export function ProfileHeader() {
  const user = useAuthStore((s) => s.user)
  const subscription = useSubscriptionStore((s) => s.subscription)
  const hydrated = useHydrated()

  const name = user?.name ?? 'Пользователь'
  const email = user?.email ?? 'user@example.com'
  const initial = name.charAt(0).toUpperCase()
  const isPro = subscription.tier !== 'free'

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#b93d3d]">
        <span className="text-2xl font-bold text-white">{initial}</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{name}</h2>
          {hydrated ? (
            <Badge
              className={
                isPro
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-white/10 text-white/60 border-white/10'
              }
            >
              {subscription.tier.toUpperCase()}
            </Badge>
          ) : (
            <span className="inline-block w-16 h-4 bg-white/[0.06] rounded-md animate-pulse" />
          )}
        </div>
        <p className="text-sm text-white/50">{email}</p>
      </div>
    </div>
  )
}

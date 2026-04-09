import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SubscriptionData, SubscriptionTier } from '@/types'
import { SUBSCRIPTION_VERSION_IDS } from '@/lib/locked-versions'

export const TIER_ORDER: Record<string, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  max: 3,
}

export function getMinTierForVersion(_versionId: string, subscriptionOnly: boolean): string {
  return subscriptionOnly ? 'basic' : 'free'
}

export const LOCKED_MODEL_IDS = new Set<string>([])

/** @deprecated Используй SUBSCRIPTION_VERSION_IDS из lib/locked-versions */
export const LOCKED_VERSION_IDS = SUBSCRIPTION_VERSION_IDS

interface SubscriptionState {
  subscription: SubscriptionData
  setSubscription: (tier: SubscriptionTier, expiresAt?: string | null) => void
  hasActiveSubscription: () => boolean
  isModelLocked: (modelId: string) => boolean
  isVersionLocked: (versionId: string, subscriptionOnly?: boolean) => boolean
  getFirstFreeVersion: (modelId: string, versions: { id: string }[]) => string | null
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: { tier: 'free' as SubscriptionTier, expiresAt: null },

      setSubscription: (tier, expiresAt = null) => {
        set({ subscription: { tier, expiresAt } })
      },

      hasActiveSubscription: () => {
        const { tier, expiresAt } = get().subscription
        if (tier === 'free') return false
        if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
          set({ subscription: { tier: 'free', expiresAt: null } })
          return false
        }
        return true
      },

      isModelLocked: (modelId) => {
        if (get().hasActiveSubscription()) return false
        return LOCKED_MODEL_IDS.has(modelId)
      },

      isVersionLocked: (versionId, subscriptionOnly) => {
        const tier = get().subscription.tier
        const subOnly = subscriptionOnly ?? LOCKED_VERSION_IDS.has(versionId)
        const minTier = getMinTierForVersion(versionId, subOnly)
        return (TIER_ORDER[tier] ?? 0) < (TIER_ORDER[minTier] ?? 0)
      },

      getFirstFreeVersion: (modelId, versions) => {
        if (LOCKED_MODEL_IDS.has(modelId)) return null
        const free = versions.find((v) => !LOCKED_VERSION_IDS.has(v.id))
        return free ? free.id : null
      },
    }),
    { name: 'subscription' },
  ),
)

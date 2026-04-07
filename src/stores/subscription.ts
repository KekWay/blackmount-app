import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SubscriptionData, SubscriptionTier } from '@/types'

export const LOCKED_MODEL_IDS = new Set<string>([])

export const LOCKED_VERSION_IDS = new Set([
  'gpt-5.4',
  'gpt-5.3',
  'chatgpt-5.2',
  'claude-opus-4.6',
  'gemini-3.1-pro',
  'nanobanana-2',
  'kling-3.0-pro',
  'kling-3.0',
  'kling-2.6-pro',
  'claude-opus-4.5',
  'nb-pro',
  'flux-1.1-pro-ultra',
  'veo-3.1-quality',
  'veo-3.1-fast',
])

interface SubscriptionState {
  subscription: SubscriptionData
  setSubscription: (tier: SubscriptionTier, expiresAt?: string | null) => void
  hasActiveSubscription: () => boolean
  isModelLocked: (modelId: string) => boolean
  isVersionLocked: (versionId: string) => boolean
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
        const { tier } = get().subscription
        return tier !== 'free'
      },

      isModelLocked: (modelId) => {
        if (get().hasActiveSubscription()) return false
        return LOCKED_MODEL_IDS.has(modelId)
      },

      isVersionLocked: (versionId) => {
        if (get().hasActiveSubscription()) return false
        return LOCKED_VERSION_IDS.has(versionId)
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

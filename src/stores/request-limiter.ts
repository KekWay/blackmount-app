import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSubscriptionStore } from './subscription'

const DAILY_LIMITS: Record<string, number> = {
  free: 50,
  basic: 100,
  pro: 150,
  max: 200,
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface RequestLimiterState {
  date: string
  count: number
  getDailyLimit: () => number
  getRemainingRequests: () => number
  canMakeRequest: () => boolean
  consumeRequest: () => boolean
}

export const useRequestLimiterStore = create<RequestLimiterState>()(
  persist(
    (set, get) => ({
      date: todayStr(),
      count: 0,

      getDailyLimit: () => {
        const tier = useSubscriptionStore.getState().subscription.tier
        return DAILY_LIMITS[tier] || DAILY_LIMITS.free
      },

      getRemainingRequests: () => {
        const state = get()
        const today = todayStr()
        const used = state.date === today ? state.count : 0
        return Math.max(0, state.getDailyLimit() - used)
      },

      canMakeRequest: () => {
        return get().getRemainingRequests() > 0
      },

      consumeRequest: () => {
        if (!get().canMakeRequest()) return false
        const today = todayStr()
        const state = get()
        const currentCount = state.date === today ? state.count : 0
        set({ date: today, count: currentCount + 1 })
        return true
      },
    }),
    { name: 'request-limiter' },
  ),
)

export function getResetTimeString(): string {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  const diff = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `через ${hours} ч ${minutes} мин`
  return `через ${minutes} мин`
}

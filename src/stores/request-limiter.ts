import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSubscriptionStore } from './subscription'

const FREE_LIMIT = 2
const SUB_LIMIT = 50

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
        const hasSub = useSubscriptionStore.getState().hasActiveSubscription()
        return hasSub ? SUB_LIMIT : FREE_LIMIT
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

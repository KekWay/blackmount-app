import { create } from 'zustand'

interface ArenaGuardState {
  active: boolean
  pendingHref: string | null
  setActive: (v: boolean) => void
  requestNav: (href: string) => void
  clearPending: () => void
}

export const useArenaGuardStore = create<ArenaGuardState>((set) => ({
  active: false,
  pendingHref: null,
  setActive: (v) => set({ active: v }),
  requestNav: (href) => set({ pendingHref: href }),
  clearPending: () => set({ pendingHref: null }),
}))

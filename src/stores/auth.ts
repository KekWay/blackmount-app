import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  name: string
  referredBy?: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    { name: 'auth' },
  ),
)

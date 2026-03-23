'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favorites: string[]
  toggleFavorite: (modelId: string) => void
  isFavorite: (modelId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (modelId) =>
        set((state) => ({
          favorites: state.favorites.includes(modelId)
            ? state.favorites.filter((id) => id !== modelId)
            : [...state.favorites, modelId],
        })),
      isFavorite: (modelId) => get().favorites.includes(modelId),
    }),
    { name: 'favorites-storage' }
  )
)

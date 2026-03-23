import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SharedItem {
  id: string
  prompt: string
  response: string
  modelId: string
  modelName: string
  type: 'text' | 'image' | 'video'
  mediaUrl?: string
  createdAt: string
}

interface SharedState {
  items: Record<string, SharedItem>
  shareItem: (item: Omit<SharedItem, 'id'>) => string
  getItem: (id: string) => SharedItem | null
}

function shortHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export const useSharedStore = create<SharedState>()(
  persist(
    (set, get) => ({
      items: {},
      shareItem: (item) => {
        const id = shortHash()
        set((state) => ({
          items: { ...state.items, [id]: { ...item, id } },
        }))
        return id
      },
      getItem: (id) => get().items[id] ?? null,
    }),
    { name: 'shared-items' },
  ),
)

import { create } from 'zustand'

interface PendingGeneration {
  id: string
  modelId: string
  type: 'image' | 'video' | 'text'
  status: 'pending' | 'completed'
  startedAt: number
  prompt: string
  sessionId?: string
}

interface GenerationState {
  pendingGenerations: PendingGeneration[]
  completedButNotNotified: string[]
  hasNewGenerations: boolean
  activeChat: string | null

  addGeneration: (gen: Omit<PendingGeneration, 'status'>) => void
  completeGeneration: (id: string) => void
  removeGeneration: (id: string) => void
  markNotified: (id: string) => void
  clearNewFlag: () => void
  setActiveChat: (modelId: string | null) => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
  pendingGenerations: [],
  completedButNotNotified: [],
  hasNewGenerations: false,
  activeChat: null,

  addGeneration: (gen) =>
    set((s) => ({
      pendingGenerations: [
        ...s.pendingGenerations,
        { ...gen, status: 'pending' },
      ],
    })),

  completeGeneration: (id) =>
    set((s) => {
      const gen = s.pendingGenerations.find((g) => g.id === id)
      const isInActiveChat = gen != null && s.activeChat === gen.modelId

      return {
        pendingGenerations: s.pendingGenerations.map((g) =>
          g.id === id ? { ...g, status: 'completed' } : g
        ),
        completedButNotNotified: isInActiveChat
          ? s.completedButNotNotified
          : s.completedButNotNotified.includes(id)
            ? s.completedButNotNotified
            : [...s.completedButNotNotified, id],
        hasNewGenerations: isInActiveChat ? s.hasNewGenerations : true,
      }
    }),

  removeGeneration: (id) =>
    set((s) => ({
      pendingGenerations: s.pendingGenerations.filter((g) => g.id !== id),
    })),

  markNotified: (id) =>
    set((s) => ({
      completedButNotNotified: s.completedButNotNotified.filter((gid) => gid !== id),
      pendingGenerations: s.pendingGenerations.filter((g) => g.id !== id),
    })),

  clearNewFlag: () => set({ hasNewGenerations: false }),

  setActiveChat: (modelId) => set({ activeChat: modelId }),
}))

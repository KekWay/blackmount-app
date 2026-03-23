import { create } from 'zustand'

interface PendingGeneration {
  id: string
  modelId: string
  type: 'image' | 'video'
  status: 'pending' | 'completed'
  startedAt: number
  prompt: string
}

interface GenerationState {
  pendingGenerations: PendingGeneration[]
  hasNewGenerations: boolean

  addGeneration: (gen: Omit<PendingGeneration, 'status'>) => void
  completeGeneration: (id: string) => void
  clearNewFlag: () => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
  pendingGenerations: [],
  hasNewGenerations: false,

  addGeneration: (gen) =>
    set((s) => ({
      pendingGenerations: [
        ...s.pendingGenerations,
        { ...gen, status: 'pending' },
      ],
    })),

  completeGeneration: (id) =>
    set((s) => ({
      pendingGenerations: s.pendingGenerations.map((g) =>
        g.id === id ? { ...g, status: 'completed' } : g
      ),
      hasNewGenerations: true,
    })),

  clearNewFlag: () => set({ hasNewGenerations: false }),
}))

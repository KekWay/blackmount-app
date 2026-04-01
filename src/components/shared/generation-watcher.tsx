'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useGenerationStore } from '@/stores/generation'
import { aiModels } from '@/data/ai-models'

const SIMULATION_DELAY = 15_000
const POLL_INTERVAL = 2_000

export function GenerationWatcher() {
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const state = useGenerationStore.getState()
      const now = Date.now()

      for (const gen of state.pendingGenerations) {
        if (gen.status === 'pending' && now - gen.startedAt >= SIMULATION_DELAY) {
          state.completeGeneration(gen.id)
        }
      }

      const fresh = useGenerationStore.getState()
      const queue = fresh.completedButNotNotified

      if (queue.length === 0) return

      for (const genId of queue) {
        const gen = fresh.pendingGenerations.find((g) => g.id === genId)
        if (!gen) {
          fresh.markNotified(genId)
          continue
        }

        if (fresh.activeChat === gen.modelId) {
          fresh.markNotified(genId)
          continue
        }

        const model = aiModels.find((m) => m.id === gen.modelId)
        const modelName = model?.name ?? gen.modelId

        if (gen.type === 'text') {
          toast.success('Генерация завершена', {
            description: `${modelName}: результат готов`,
            action: {
              label: 'Посмотреть',
              onClick: () => router.push(
                gen.sessionId
                  ? `/chat/${gen.modelId}?session=${gen.sessionId}`
                  : `/history?tab=text`
              ),
            },
            duration: 15_000,
          })
        } else {
          const tab = gen.type === 'image' ? 'images' : 'video'

          toast.success('Генерация завершена', {
            description: `${modelName}: результат готов`,
            action: {
              label: 'Посмотреть',
              onClick: () => router.push(`/history?tab=${tab}`),
            },
            duration: 15_000,
          })
        }

        fresh.markNotified(genId)
      }
      const afterQueue = useGenerationStore.getState().completedButNotNotified
      if (afterQueue.length === 0 && useGenerationStore.getState().hasNewGenerations) {
        useGenerationStore.getState().clearNewFlag()
      }
    }, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  return null
}

'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useGenerationStore } from '@/stores/generation'
import { useBalanceStore } from '@/stores/balance'
import { aiModels } from '@/data/ai-models'

const SIMULATION_DELAY = 15_000
const POLL_INTERVAL = 2_000

export function GenerationWatcher() {
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    console.log('[GW] === MOUNTED ===')
    toast.success('GenerationWatcher активен', { duration: 3000 })

    intervalRef.current = setInterval(() => {
      const state = useGenerationStore.getState()
      const now = Date.now()

      for (const gen of state.pendingGenerations) {
        if (gen.status === 'pending' && now - gen.startedAt >= SIMULATION_DELAY) {
          console.log('[GW] simulation complete:', gen.id.slice(0, 8), gen.modelId)
          state.completeGeneration(gen.id)
        }
      }

      const fresh = useGenerationStore.getState()
      const queue = fresh.completedButNotNotified

      console.log('[GW] poll', {
        queue: queue.map((id) => id.slice(0, 8)),
        activeChat: fresh.activeChat,
        pending: fresh.pendingGenerations.map((g) => ({
          id: g.id.slice(0, 8), status: g.status, model: g.modelId,
        })),
      })

      if (queue.length === 0) return

      for (const genId of queue) {
        const gen = fresh.pendingGenerations.find((g) => g.id === genId)
        if (!gen) {
          console.log('[GW] orphan in queue, cleaning:', genId.slice(0, 8))
          fresh.markNotified(genId)
          continue
        }

        if (fresh.activeChat === gen.modelId) {
          console.log('[GW] skip — user in chat:', gen.modelId, 'activeChat:', fresh.activeChat)
          continue
        }

        const model = aiModels.find((m) => m.id === gen.modelId)
        const modelName = model?.name ?? gen.modelId

        console.log('[GW] >>> SHOWING TOAST:', gen.type, gen.modelId, 'activeChat:', fresh.activeChat)

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
          const label = gen.type === 'image' ? 'Изображение' : 'Видео'
          const tab = gen.type === 'image' ? 'images' : 'video'

          const nowDate = new Date()
          const timeStr = `${String(nowDate.getHours()).padStart(2, '0')}:${String(nowDate.getMinutes()).padStart(2, '0')}`
          const dateStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`

          useBalanceStore.getState().addGenHistoryItem({
            modelId: gen.modelId,
            title: gen.prompt || `${label} — ${modelName}`,
            preview: '',
            time: timeStr,
            dateStr,
            type: gen.type,
          })

          toast.success('Генерация завершена', {
            description: `${modelName}: результат готов`,
            action: {
              label: 'Посмотреть',
              onClick: () => router.push(`/history?tab=${tab}`),
            },
            duration: 15_000,
          })
        }

        console.log('[GW] markNotified:', genId.slice(0, 8))
        fresh.markNotified(genId)
      }
    }, POLL_INTERVAL)

    return () => {
      console.log('[GW] === UNMOUNTED ===')
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  return null
}

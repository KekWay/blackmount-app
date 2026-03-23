'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useGenerationStore } from '@/stores/generation'
import { useBalanceStore } from '@/stores/balance'
import { aiModels } from '@/data/ai-models'

const SIMULATION_DELAY = 15_000
const POLL_INTERVAL = 5_000

export function GenerationWatcher() {
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const { pendingGenerations, completeGeneration } =
        useGenerationStore.getState()

      const now = Date.now()

      for (const gen of pendingGenerations) {
        if (gen.status !== 'pending') continue
        if (now - gen.startedAt < SIMULATION_DELAY) continue

        completeGeneration(gen.id)

        const model = aiModels.find((m) => m.id === gen.modelId)
        const label = gen.type === 'image' ? 'Изображение' : 'Видео'
        const tab = gen.type === 'image' ? 'images' : 'video'

        const nowDate = new Date()
        const timeStr = `${String(nowDate.getHours()).padStart(2, '0')}:${String(nowDate.getMinutes()).padStart(2, '0')}`
        const dateStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`

        useBalanceStore.getState().addGenHistoryItem({
          modelId: gen.modelId,
          title: gen.prompt || `${label} — ${model?.name ?? gen.modelId}`,
          preview: '',
          time: timeStr,
          dateStr,
          type: gen.type,
        })

        toast.success('Генерация завершена', {
          description: `${label} от ${model?.name ?? gen.modelId} готово`,
          action: {
            label: 'Посмотреть',
            onClick: () => router.push(`/history?tab=${tab}`),
          },
          duration: 10_000,
        })
      }
    }, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  return null
}

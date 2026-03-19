'use client'

import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'
import type { ArenaModel } from '@/data/arena-models'

interface ModelResponse {
  model: ArenaModel
  text: string
}

interface ModelComparisonProps {
  responses: ModelResponse[]
  winnerId: string | null
}

function getModelLogo(model: ArenaModel): string | null {
  if (!model.aiModelRef) return null
  const assets = MODEL_ASSETS[model.aiModelRef as ModelId]
  if (!assets) return null
  if ('logo' in assets && assets.logo) return assets.logo
  if ('maskImage' in assets && assets.maskImage) return assets.maskImage
  return null
}

export function ModelComparison({ responses, winnerId }: ModelComparisonProps) {
  const colClass =
    responses.length <= 2
      ? 'grid-cols-1 md:grid-cols-2'
      : responses.length === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`grid ${colClass} gap-4`}>
      {responses.map(({ model, text }) => {
        const isWinner = winnerId === model.id
        const isDraw = winnerId === null && responses.length > 0
        const logo = getModelLogo(model)

        return (
          <div
            key={model.id}
            className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
              isWinner
                ? 'border-primary/60 bg-primary/[0.08]'
                : 'border-white/[0.06] bg-white/[0.03]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              {logo && (
                <Image
                  src={logo}
                  alt={model.name}
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {model.name}
                </h3>
                <span className="text-xs text-white/40">{model.price} кр.</span>
              </div>
              {isWinner && (
                <Trophy size={18} className="text-yellow-400 shrink-0" />
              )}
            </div>

            {/* Response text */}
            <div className="flex-1 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {text || (
                <div className="flex items-center gap-2 text-white/30">
                  <div className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />
                  <span>Генерация...</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

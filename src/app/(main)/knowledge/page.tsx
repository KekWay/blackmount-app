'use client'

import { useState } from 'react'
import Image from 'next/image'
import { aiModels } from '@/data/ai-models'
import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'
import { ChevronRight } from 'lucide-react'

export default function KnowledgePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedModel = aiModels.find((m) => m.id === selectedId)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        База знаний
      </h1>

      {!selectedModel ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {aiModels.map((model) => {
            const assets = MODEL_ASSETS[model.id as ModelId]
            return (
              <button
                key={model.id}
                onClick={() => setSelectedId(model.id)}
                className="flex items-center gap-3 rounded-xl bg-card p-4 text-left transition-colors hover:bg-muted"
              >
                {assets?.colorLogo && (
                  <Image
                    src={assets.colorLogo}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-lg"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{model.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {model.category} / {model.versions.length} версий
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedId(null)}
            className="mb-4 text-sm text-primary hover:underline"
          >
            &larr; Назад к списку
          </button>

          <div className="rounded-2xl bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              {MODEL_ASSETS[selectedModel.id as ModelId]?.colorLogo && (
                <Image
                  src={MODEL_ASSETS[selectedModel.id as ModelId].colorLogo}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded-xl"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedModel.name}
                </h2>
                <p className="text-sm capitalize text-muted-foreground">
                  Категория: {selectedModel.category}
                </p>
              </div>
            </div>

            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Версии
            </h3>
            <div className="flex flex-col gap-2">
              {selectedModel.versions.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-xl bg-muted p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {v.label}
                    </p>
                    {v.description && (
                      <p className="text-xs text-muted-foreground">
                        {v.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {v.price} монет
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {v.tier}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

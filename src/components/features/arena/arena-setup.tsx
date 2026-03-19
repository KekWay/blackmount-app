'use client'

import { ArrowUp } from 'lucide-react'
import type { ArenaModel } from '@/data/arena-models'

interface ArenaSetupProps {
  models: ArenaModel[]
  selected: ArenaModel[]
  prompt: string
  generating: boolean
  onToggleModel: (model: ArenaModel) => void
  onPromptChange: (value: string) => void
  onGenerate: () => void
}

export function ArenaSetup({
  models,
  selected,
  prompt,
  generating,
  onToggleModel,
  onPromptChange,
  onGenerate,
}: ArenaSetupProps) {
  return (
    <>
      {/* Model selection */}
      {!generating && (
        <div className="mb-6">
          <p className="text-sm text-white/50 mb-3">
            Выберите 2–4 модели ({selected.length}/4)
          </p>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => {
              const active = selected.some((m) => m.id === model.id)
              return (
                <button
                  key={model.id}
                  onClick={() => onToggleModel(model)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-white/[0.06] text-white/70 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {model.name}
                  <span className="ml-2 text-xs text-white/30">{model.price} кр.</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Prompt input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
          placeholder="Введите запрос для сравнения..."
          disabled={generating}
          className="flex-1 rounded-xl bg-white/[0.06] border border-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/40 disabled:opacity-50"
        />
        <button
          onClick={onGenerate}
          disabled={generating || selected.length < 2 || !prompt.trim()}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowUp size={16} />
          <span>Сравнить</span>
        </button>
      </div>
    </>
  )
}

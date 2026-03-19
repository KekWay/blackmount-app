'use client'

import { useState, useRef, useCallback } from 'react'
import { Swords, RotateCcw } from 'lucide-react'
import { getModelsByCategory, type ArenaModel } from '@/data/arena-models'
import { ModelComparison } from './model-comparison'
import { VoteControls } from './vote-controls'
import { ArenaSetup } from './arena-setup'

type Phase = 'idle' | 'generating' | 'voting' | 'winner'
type Category = 'text' | 'image' | 'video'

interface ModelResponse {
  model: ArenaModel
  text: string
}

const CATEGORY_LABELS: Record<Category, string> = {
  text: 'Текст',
  image: 'Изображения',
  video: 'Видео',
}

const MOCK_RESPONSES = [
  'Это демо-ответ. В реальном приложении здесь был бы ответ от нейросети на ваш запрос.',
  'Вот мой ответ на ваш вопрос. Это демонстрационный режим — реальная генерация пока недоступна.',
  'Ответ сгенерирован в демо-режиме. Полноценная интеграция с моделью будет доступна позже.',
  'Демонстрационный ответ от модели. Скоро здесь появится настоящая генерация.',
]

export function ArenaBattle() {
  const [category, setCategory] = useState<Category>('text')
  const [selected, setSelected] = useState<ArenaModel[]>([])
  const [prompt, setPrompt] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [responses, setResponses] = useState<ModelResponse[]>([])
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const models = getModelsByCategory(category)

  const toggleModel = useCallback((model: ArenaModel) => {
    setSelected((prev) => {
      const exists = prev.find((m) => m.id === model.id)
      if (exists) return prev.filter((m) => m.id !== model.id)
      if (prev.length >= 4) return prev
      return [...prev, model]
    })
  }, [])

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || selected.length < 2) return
    setPhase('generating')
    setWinnerId(null)
    setResponses(selected.map((m) => ({ model: m, text: '' })))

    timerRef.current = setTimeout(() => {
      setResponses(
        selected.map((m, i) => ({
          model: m,
          text: `[${m.name}] ${MOCK_RESPONSES[i % MOCK_RESPONSES.length]}`,
        })),
      )
      setPhase('voting')
    }, 2000)
  }, [prompt, selected])

  const handleVote = useCallback((id: string | null) => {
    setWinnerId(id)
    setPhase('winner')
  }, [])

  const handleReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPhase('idle')
    setPrompt('')
    setResponses([])
    setWinnerId(null)
    setSelected([])
  }, [])

  return (
    <div className="w-full h-full overflow-y-auto px-6 lg:px-10 pt-8 pb-10">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Swords size={28} className="text-primary" />
          <h1 className="font-maven font-extrabold text-4xl text-white">Арена</h1>
        </div>
        <p className="text-[15px] text-white/40">
          Сравните ответы 2–4 моделей на один и тот же запрос
        </p>
      </header>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSelected([]) }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              category === cat
                ? 'bg-primary text-white'
                : 'bg-white/[0.06] text-white/60 hover:bg-white/10'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {(phase === 'idle' || phase === 'generating') && (
        <ArenaSetup
          models={models}
          selected={selected}
          prompt={prompt}
          generating={phase === 'generating'}
          onToggleModel={toggleModel}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
        />
      )}

      {responses.length > 0 && (
        <ModelComparison responses={responses} winnerId={winnerId} />
      )}

      {phase === 'voting' && (
        <VoteControls models={selected} onVote={handleVote} disabled={false} />
      )}

      {phase === 'winner' && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-sm text-white/50">
            {winnerId
              ? `Победитель: ${selected.find((m) => m.id === winnerId)?.name}`
              : 'Ничья!'}
          </p>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
          >
            <RotateCcw size={16} />
            <span>Новое сравнение</span>
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import type { Message, ModelVersion } from '@/types'
import { aiModels } from '@/data/ai-models'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import { useRequestLimiterStore } from '@/stores/request-limiter'
import { ModelSelector } from './model-selector'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'

const GREETINGS = [
  'Чем могу помочь?', 'Что создадим сегодня?', 'Готов помочь!',
  'С чего начнём?', 'Какой у вас запрос?', 'Давайте начнём!',
]

export function ChatContainer() {
  const params = useParams<{ modelId: string }>()
  const router = useRouter()
  const model = aiModels.find((m) => m.id === params.modelId) ?? aiModels[0]

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
  const generationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const defaultVersion = model.versions.reduce((a, b) =>
    (a.price ?? 0) <= (b.price ?? 0) ? a : b,
  )
  const [selectedVersion, setSelectedVersion] = useState<ModelVersion>(defaultVersion)

  const { deductBalance, addOperation, addGenHistoryItem } = useBalanceStore()
  const isModelLocked = useSubscriptionStore((s) => s.isModelLocked)
  const consumeRequest = useRequestLimiterStore((s) => s.consumeRequest)
  const canMakeRequest = useRequestLimiterStore((s) => s.canMakeRequest)
  const modelLocked = isModelLocked(model.id)

  const handleSend = useCallback(() => {
    if (!input.trim() || modelLocked) return
    if (!canMakeRequest()) return
    const cost = selectedVersion.price ?? 5
    if (!deductBalance(cost)) return

    consumeRequest()
    addOperation('spent', selectedVersion.label, -cost)
    addGenHistoryItem({
      modelId: model.id,
      title: input.trim().slice(0, 100),
      preview: model.category === 'text' ? `Ответ от ${model.name}...` : '',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      dateStr: new Date().toISOString().slice(0, 10),
      type: model.category,
    })

    const userMsg: Message = { role: 'user', content: input }
    const loadingMsg: Message = { role: 'assistant', content: '', isLoading: true, mediaType: model.category !== 'text' ? model.category : undefined }
    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInput('')
    setIsGenerating(true)

    const responseText = `Это демо-ответ от ${model.name} (${selectedVersion.label}). В реальном приложении здесь был бы ответ от нейросети.`

    generationTimer.current = setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.isLoading ? { ...m, content: responseText, isLoading: false } : m,
        ),
      )
      setIsGenerating(false)
    }, 2000)
  }, [input, model, selectedVersion, modelLocked, canMakeRequest, deductBalance, consumeRequest, addOperation, addGenHistoryItem])

  const handleStop = () => {
    if (generationTimer.current) clearTimeout(generationTimer.current)
    setMessages((prev) =>
      prev.map((m) =>
        m.isLoading ? { ...m, content: 'Генерация остановлена.', isLoading: false } : m,
      ),
    )
    setIsGenerating(false)
  }

  const handleRetry = (idx: number) => {
    const prevUserMsg = messages[idx - 1]
    if (prevUserMsg?.role === 'user') {
      setInput(prevUserMsg.content)
    }
  }

  const handleNewChat = () => {
    setMessages([])
  }

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-2 px-6 lg:px-10 shrink-0 relative z-20">
        <ModelSelector
          model={model}
          selectedVersion={selectedVersion}
          onSelectVersion={setSelectedVersion}
        />
        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 cursor-pointer rounded-xl px-3.5 py-[7px] transition-all hover:bg-primary/[0.12]"
        >
          <Plus size={14} className="text-white/60" />
          <span className="text-[13px] text-white font-medium">Новый чат</span>
        </button>
      </div>

      {/* Messages or greeting */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto chat-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-3xl font-semibold text-white/80">{greeting}</p>
          </div>
        ) : (
          <MessageList
            messages={messages}
            modelId={model.id}
            modelName={model.name}
            onRetry={handleRetry}
          />
        )}
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onStop={handleStop}
        isGenerating={isGenerating}
        disabled={modelLocked}
      />
    </div>
  )
}

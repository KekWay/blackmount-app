'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useBalanceStore } from '@/stores/balance'
import { useRequestLimiterStore } from '@/stores/request-limiter'
import { useAuthStore } from '@/stores/auth'
import { useGenerationStore } from '@/stores/generation'
import { useChatSessionsStore } from '@/stores/chat-sessions'
import type { Message, AIModel, ModelVersion } from '@/types'
import {
  getRandomGreeting, testImageSrc, testVideoSrc, testImagePool,
} from './chat-constants'

interface UseChatActionsParams {
  model: AIModel
  selectedVersion: ModelVersion
  isTextModel: boolean
  modelLocked: boolean
  dynamicCost: number
  input: string
  setInput: (v: string) => void
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  isGenerating: boolean
  setIsGenerating: (v: boolean) => void
  isRecording: boolean
  setIsRecording: (v: boolean) => void
  setTypingIdx: (v: number | null) => void
  setShowAuthGate: (v: boolean) => void
  setShowLowBalance: (v: boolean) => void
  setShowLimitReached: (v: boolean) => void
  setGreeting: (v: string) => void
  webSearchActive: boolean
  deepResearchActive: boolean
  imageCount: number
  sessionIdRef: React.MutableRefObject<string | null>
}

export function useChatActions(p: UseChatActionsParams) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const recordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ensureSession = (userText: string): string => {
    if (p.sessionIdRef.current) return p.sessionIdRef.current
    const id = useChatSessionsStore.getState().createSession(p.model.id, userText)
    p.sessionIdRef.current = id
    return id
  }

  const handleSend = () => {
    if (!p.input.trim()) return
    if (!isLoggedIn) { p.setShowAuthGate(true); return }
    if (p.modelLocked) { router.push('/profile?tab=subscription'); return }
    // TODO: временно отключен лимит запросов
    // if (!useRequestLimiterStore.getState().canMakeRequest()) { p.setShowLimitReached(true); return }
    if (useBalanceStore.getState().balance < p.dynamicCost) { p.setShowLowBalance(true); return }
    // useRequestLimiterStore.getState().consumeRequest()
    useBalanceStore.getState().deductBalance(p.dynamicCost)
    useBalanceStore.getState().addOperation('spent', p.selectedVersion.label, -p.dynamicCost)
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    if (!p.isTextModel) {
      useBalanceStore.getState().addGenHistoryItem({ modelId: p.model.id, title: p.input.trim().slice(0, 100), preview: '', time: timeStr, dateStr, type: p.model.category })
    }

    const prefix = p.webSearchActive ? '\u{1F310} ' : ''
    const userMsg: Message = { role: 'user', content: prefix + p.input, timestamp: Date.now() }
    const sessionId = ensureSession(p.input.trim())

    p.setMessages((prev) => [...prev, userMsg])
    useChatSessionsStore.getState().addMessages(sessionId, [userMsg])

    p.setInput('')
    if (p.isRecording) p.setIsRecording(false)
    p.setIsGenerating(true)
    if (!p.isTextModel) {
      const mediaGenId = crypto.randomUUID()
      useGenerationStore.getState().addGeneration({
        id: mediaGenId,
        modelId: p.model.id,
        type: p.model.category as 'image' | 'video',
        startedAt: Date.now(),
        prompt: p.input.trim().slice(0, 100),
      })
      p.setMessages((prev) => [...prev, { role: 'assistant', content: `${p.model.name} генерирует...`, isLoading: true, mediaType: p.model.category as 'image' | 'video' }])
      generationTimerRef.current = setTimeout(() => {
        useGenerationStore.getState().completeGeneration(mediaGenId)
        let assistantMsg: Message
        if (p.model.category === 'image' && p.imageCount > 1) {
          assistantMsg = { role: 'assistant', content: `Сгенерировано ${p.imageCount} изображений моделью ${p.model.name} (${p.selectedVersion.label})`, mediaType: 'image', mediaSrcs: testImagePool.slice(0, p.imageCount), timestamp: Date.now() }
        } else {
          assistantMsg = { role: 'assistant', content: `Сгенерировано моделью ${p.model.name} (${p.selectedVersion.label})`, mediaType: p.model.category as 'image' | 'video', mediaSrc: p.model.category === 'video' ? testVideoSrc : testImageSrc, timestamp: Date.now() }
        }
        p.setMessages((prev) => {
          const u = [...prev]; const li = u.findIndex((m) => m.isLoading)
          if (li !== -1) u[li] = assistantMsg
          return u
        })
        useChatSessionsStore.getState().addMessages(sessionId, [assistantMsg])
        p.setIsGenerating(false)
      }, 3000)
    } else {
      const textGenId = crypto.randomUUID()
      useGenerationStore.getState().addGeneration({
        id: textGenId,
        modelId: p.model.id,
        type: 'text',
        startedAt: Date.now(),
        prompt: p.input.trim().slice(0, 100),
        sessionId,
      })
      p.setMessages((prev) => [...prev, { role: 'assistant', content: '', isLoading: true }])
      const txt = `Это демо-ответ от ${p.model.name} (${p.selectedVersion.label}).${p.webSearchActive ? ' (с веб-поиском)' : ''}${p.deepResearchActive ? ' (с режимом думать)' : ''} В реальном приложении здесь был бы ответ от нейросети. Модель обрабатывает запрос с учётом контекста диалога и настроек выбранной версии.`
      generationTimerRef.current = setTimeout(() => {
        useGenerationStore.getState().completeGeneration(textGenId)
        const assistantMsg: Message = { role: 'assistant', content: txt, isTyping: true, timestamp: Date.now() }
        p.setMessages((prev) => {
          const u = [...prev]; const li = u.findIndex((m) => m.isLoading)
          if (li !== -1) { u[li] = assistantMsg; p.setTypingIdx(li) }
          return u
        })
        useChatSessionsStore.getState().addMessages(sessionId, [{ role: 'assistant', content: txt, timestamp: Date.now() }])
      }, 2000)
    }
  }

  const handleStopGeneration = () => {
    if (generationTimerRef.current) { clearTimeout(generationTimerRef.current); generationTimerRef.current = null }
    p.setTypingIdx(null)
    p.setMessages((prev) => prev.map((m) => { if (m.isLoading) return { ...m, role: 'assistant' as const, content: 'Генерация остановлена.', isLoading: false, isTyping: false }; if (m.isTyping) return { ...m, isTyping: false }; return m }))
    p.setIsGenerating(false)
  }

  const handleModelSwitch = (m: AIModel) => {
    if (p.isGenerating) { if (generationTimerRef.current) { clearTimeout(generationTimerRef.current); generationTimerRef.current = null }; p.setTypingIdx(null); p.setIsGenerating(false) }
    p.sessionIdRef.current = null
    p.setMessages([]); p.setInput(''); p.setGreeting(getRandomGreeting()); router.push(`/chat/${m.id}`)
  }

  const handleNewChat = () => {
    p.sessionIdRef.current = null
    p.setMessages([]); p.setGreeting(getRandomGreeting())
  }

  const toggleRecording = () => {
    if (!p.isTextModel) return
    const voiceDemo = 'Привет, это голосовой запрос к нейросети для демонстрации функции записи голоса'
    if (p.isRecording) { p.setIsRecording(false); if (recordTimerRef.current) clearTimeout(recordTimerRef.current); p.setInput(p.input || voiceDemo) }
    else { p.setIsRecording(true); recordTimerRef.current = setTimeout(() => { p.setIsRecording(false); p.setInput(p.input || voiceDemo) }, 10000) }
  }

  const cancelRecording = () => { p.setIsRecording(false); if (recordTimerRef.current) clearTimeout(recordTimerRef.current) }

  return { handleSend, handleStopGeneration, handleModelSwitch, handleNewChat, toggleRecording, cancelRecording }
}

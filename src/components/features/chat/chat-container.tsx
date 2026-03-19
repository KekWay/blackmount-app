'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Pin, PinOff, Plus, X, Lock, Sparkles } from 'lucide-react'
import { aiModels } from '@/data/ai-models'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import { useRequestLimiterStore } from '@/stores/request-limiter'
import { useAuthStore } from '@/stores/auth'
import { APP_ASSETS } from '@/lib/assets'
import type { Message, AIModel, ModelVersion } from '@/types'
import { VersionDropdown } from './version-dropdown'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { ChatSettingsPanel } from './chat-settings-panel'
import { ChatModals } from './chat-modals'
import { ChatMediaLightbox } from './chat-media-lightbox'
import { ShareModal } from './share-modal'

const imgShareMask = '/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png'
const imgFreeIconSetting = APP_ASSETS.settings

function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgShareMask}')`, WebkitMaskImage: `url('${imgShareMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const greetingPhrases = [
  'Чем могу помочь?', 'Что создадим сегодня?', 'Готов помочь!',
  'С чего начнём?', 'Какой у вас запрос?', 'Что вас интересует?',
  'Давайте начнём!', 'Чем вам помочь?',
]

function getRandomGreeting(): string {
  return greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)]
}

interface PinnedChat { modelId: string; modelName: string }

const testImageSrc = 'https://images.unsplash.com/photo-1644328293665-a783b37f25d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwbWFnaWNhbHxlbnwxfHx8fDE3NzI0NzI1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
const testVideoSrc = 'https://images.unsplash.com/photo-1688377051459-aebb99b42bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbnxlbnwxfHx8fDE3NzI1MTg5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
const testImagePool = [
  testImageSrc,
  'https://images.unsplash.com/photo-1713188090500-a4fb0d2cf309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwYWJzdHJhY3QlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI4OTQ4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1764145045070-02d766d3ad4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwbGFuZHNjYXBlJTIwZHJlYW15JTIwbW91bnRhaW5zfGVufDF8fHx8MTc3Mjk4ODgxMHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1715614176939-f5c46ae99d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbmVvbiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzI5NzM1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
]

const FREE_SUB_VERSIONS = ['chatgpt-5-mini', 'gemini-3-flash', 'gemini-2.5-flash']

const videoPricingMap: Record<string, Record<string, number>> = {
  'sora-2': { '10с': 25, '15с': 30 },
  'sora-2-pro': { '10с': 115, '15с': 215 },
  'kling-2.6': { '5с': 45, '10с': 85 },
  'kling-2.6-audio': { '5с': 85, '10с': 170 },
  'kling-2.5-turbo': { '5с': 35, '10с': 65 },
  'veo-3.1-quality': { '8с': 185, '5с': 120 },
  'veo-3.1-fast': { '8с': 50, '5с': 35 },
}

export function ChatContainer() {
  const params = useParams<{ modelId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const modelId = params.modelId

  const [showAuthGate, setShowAuthGate] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
  const [attachOpen, setAttachOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [toneSetting, setToneSetting] = useState('default')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [quality, setQuality] = useState('1K')
  const [imageCount, setImageCount] = useState(1)
  const [videoDuration, setVideoDuration] = useState('10с')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [webSearchActive, setWebSearchActive] = useState(false)
  const [deepResearchActive, setDeepResearchActive] = useState(false)
  const [showLowBalance, setShowLowBalance] = useState(false)
  const [typingIdx, setTypingIdx] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const recordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [subBannerDismissed, setSubBannerDismissed] = useState(false)
  const [msgRatings, setMsgRatings] = useState<Record<number, 'up' | 'down'>>({})
  const [msgShareIdx, setMsgShareIdx] = useState<number | null>(null)
  const [viewerMedia, setViewerMedia] = useState<{ type: 'image' | 'video'; src: string; srcs?: string[] } | null>(null)
  const [showLimitReached, setShowLimitReached] = useState(false)
  const [greeting, setGreeting] = useState(getRandomGreeting)

  const balance = useBalanceStore((s) => s.balance)
  const hasSub = useSubscriptionStore((s) => s.hasActiveSubscription())
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const model = aiModels.find((m) => m.id === modelId) || aiModels[0]
  const modelLocked = useSubscriptionStore.getState().isModelLocked(model.id)

  const defaultVersion = (() => {
    const sortedVersions = [...model.versions].sort((a, b) => (a.price || 0) - (b.price || 0))
    if (hasSub) return sortedVersions[0]
    const free = sortedVersions.find(v => !useSubscriptionStore.getState().isVersionLocked(v.id))
    return free || sortedVersions[0]
  })()
  const selectedVersion = model.versions.find((v) => v.id === selectedVersionId) || defaultVersion
  const isTextModel = model.category === 'text'
  const dailyLimit = useRequestLimiterStore.getState().getDailyLimit()

  const computeCost = () => {
    const basePrice = selectedVersion.price || 5
    if (hasSub && FREE_SUB_VERSIONS.includes(selectedVersion.id)) return 0
    const featureCost = (isTextModel ? ((webSearchActive ? 5 : 0) + (deepResearchActive ? 5 : 0)) : 0)
    if (isTextModel) return basePrice + featureCost
    if (model.category === 'image') {
      const qualityMultiplier = quality === '4K' ? 2.5 : quality === '2K' ? 1.5 : 1
      return Math.round(basePrice * qualityMultiplier * imageCount)
    }
    const vKey = selectedVersion.id === 'kling-2.6' && audioEnabled ? 'kling-2.6-audio' : selectedVersion.id
    const priceMap = videoPricingMap[vKey]
    if (priceMap && priceMap[videoDuration]) return priceMap[videoDuration]
    return basePrice
  }
  const dynamicCost = computeCost()

  // Pre-fill input from ?prompt= query param
  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam) setInput(promptParam)
  }, [searchParams])

  // Pick up arena context
  useEffect(() => {
    const arenaRaw = sessionStorage.getItem('arena_continue')
    if (arenaRaw) {
      sessionStorage.removeItem('arena_continue')
      try {
        const arena = JSON.parse(arenaRaw) as { prompt: string; response: string; modelName: string }
        if (arena.prompt && arena.response) {
          setMessages([
            { role: 'user', content: arena.prompt },
            { role: 'assistant', content: arena.response },
          ])
        }
      } catch { /* empty */ }
    }
  }, [model.id])

  // Reset state on model change
  useEffect(() => {
    const sortedVersions = [...model.versions].sort((a, b) => (a.price || 0) - (b.price || 0))
    setSelectedVersionId(sortedVersions[0]?.id || null)
    setWebSearchActive(false)
    setDeepResearchActive(false)
    setIsRecording(false)
    setSettingsOpen(false)
    setAudioEnabled(false)
    if (model.id === 'sora2') setVideoDuration('10с')
    else if (model.id === 'kling') setVideoDuration('5с')
    else if (model.id === 'veo31') setVideoDuration('8с')
    setGreeting(getRandomGreeting())
  }, [model.id])

  // Pinned chats
  useEffect(() => {
    const saved = localStorage.getItem('pinnedChats')
    if (saved) {
      try {
        const chats: PinnedChat[] = JSON.parse(saved)
        setIsPinned(chats.some((c) => c.modelId === modelId))
      } catch { /* empty */ }
    }
  }, [modelId])

  const togglePin = () => {
    const saved = localStorage.getItem('pinnedChats')
    let chats: PinnedChat[] = []
    if (saved) { try { chats = JSON.parse(saved) } catch { /* empty */ } }
    if (isPinned) {
      chats = chats.filter((c) => c.modelId !== modelId)
    } else {
      if (!chats.some((c) => c.modelId === modelId)) {
        chats.push({ modelId: modelId!, modelName: model.name })
      }
    }
    localStorage.setItem('pinnedChats', JSON.stringify(chats))
    setIsPinned(!isPinned)
    window.dispatchEvent(new Event('pinnedChatsChanged'))
  }

  const handleSend = () => {
    if (!input.trim()) return
    if (!isLoggedIn) { setShowAuthGate(true); return }
    if (modelLocked) { router.push('/profile?tab=subscription'); return }
    if (!useRequestLimiterStore.getState().canMakeRequest()) { setShowLimitReached(true); return }
    const cost = dynamicCost
    if (useBalanceStore.getState().balance < cost) { setShowLowBalance(true); return }

    useRequestLimiterStore.getState().consumeRequest()
    useBalanceStore.getState().deductBalance(cost)
    useBalanceStore.getState().addOperation('spent', selectedVersion.label, -cost)

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    useBalanceStore.getState().addGenHistoryItem({
      modelId: model.id,
      title: input.trim().slice(0, 100),
      preview: model.category === 'text' ? `Ответ от ${model.name}...` : '',
      time: timeStr,
      dateStr,
      type: model.category,
    })

    const prefix = webSearchActive ? '\u{1F310} ' : ''
    const userMsg: Message = { role: 'user', content: prefix + input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    if (isRecording) setIsRecording(false)
    setIsGenerating(true)

    if (!isTextModel) {
      const loadingMsg: Message = { role: 'assistant', content: `${model.name} генерирует...`, isLoading: true, mediaType: model.category as 'image' | 'video' }
      setMessages((prev) => [...prev, loadingMsg])
      generationTimerRef.current = setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev]
          const loadIdx = updated.findIndex((m) => m.isLoading)
          if (loadIdx !== -1) {
            if (model.category === 'image' && imageCount > 1) {
              const srcs = testImagePool.slice(0, imageCount)
              updated[loadIdx] = { role: 'assistant', content: `Сгенерировано ${imageCount} изображений моделью ${model.name} (${selectedVersion.label})`, mediaType: 'image', mediaSrcs: srcs }
            } else {
              updated[loadIdx] = { role: 'assistant', content: `Сгенерировано моделью ${model.name} (${selectedVersion.label})`, mediaType: model.category as 'image' | 'video', mediaSrc: model.category === 'video' ? testVideoSrc : testImageSrc }
            }
          }
          return updated
        })
        setIsGenerating(false)
      }, 3000)
    } else {
      const loadingMsg: Message = { role: 'assistant', content: '', isLoading: true }
      setMessages((prev) => [...prev, loadingMsg])
      const responseText = `Это демо-ответ от ${model.name} (${selectedVersion.label}).${webSearchActive ? ' (с веб-поиском)' : ''}${deepResearchActive ? ' (с режимом думать)' : ''} В реальном приложении здесь был бы ответ от нейросети. Модель обрабатывает запрос с учётом контекста диалога и настроек выбранной версии.`
      generationTimerRef.current = setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev]
          const loadIdx = updated.findIndex((m) => m.isLoading)
          if (loadIdx !== -1) {
            updated[loadIdx] = { role: 'assistant', content: responseText, isTyping: true }
            setTypingIdx(loadIdx)
          }
          return updated
        })
      }, 2000)
    }
  }

  const handleStopGeneration = () => {
    if (generationTimerRef.current) { clearTimeout(generationTimerRef.current); generationTimerRef.current = null }
    setTypingIdx(null)
    setMessages((prev) =>
      prev.map((m) => {
        if (m.isLoading) return { ...m, role: 'assistant' as const, content: 'Генерация остановлена.', isLoading: false, isTyping: false }
        if (m.isTyping) return { ...m, isTyping: false }
        return m
      })
    )
    setIsGenerating(false)
  }

  const handleModelSwitch = (m: AIModel) => {
    if (isGenerating) {
      if (generationTimerRef.current) { clearTimeout(generationTimerRef.current); generationTimerRef.current = null }
      setTypingIdx(null)
      setIsGenerating(false)
    }
    setMessages([])
    setInput('')
    setGreeting(getRandomGreeting())
    router.push(`/chat/${m.id}`)
  }

  const handleNewChat = () => {
    setMessages([])
    setGreeting(getRandomGreeting())
  }

  const toggleRecording = () => {
    if (!isTextModel) return
    if (isRecording) {
      setIsRecording(false)
      if (recordTimerRef.current) clearTimeout(recordTimerRef.current)
      setInput((prev) => prev || 'Привет, это голосовой запрос к нейросети для демонстрации функции записи голоса')
    } else {
      setIsRecording(true)
      recordTimerRef.current = setTimeout(() => {
        setIsRecording(false)
        setInput((prev) => prev || 'Привет, это голосовой запрос к нейросети для демонстрации функции записи голоса')
      }, 10000)
    }
  }

  const cancelRecording = () => {
    setIsRecording(false)
    if (recordTimerRef.current) clearTimeout(recordTimerRef.current)
  }

  // Suppress unused var warning
  void typingIdx

  return (
    <div className="w-full h-screen flex flex-col bg-[#121118] relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-1/2"
          style={{
            top: '38%',
            transform: 'translateX(-50%) translateY(-50%)',
            width: '80%',
            height: '55%',
            background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${hexToRgba(model.glowColors[0] || '#3e993e', 0.28)} 0%, ${hexToRgba(model.glowColors[1] || model.glowColors[0] || '#3e993e', 0.15)} 30%, ${hexToRgba(model.glowColors[0] || '#3e993e', 0.06)} 55%, transparent 75%)`,
            filter: 'blur(140px)',
          }}
        />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between pt-[24px] pb-[8px] px-[40px] shrink-0 relative z-[20]">
        <div className="flex items-center gap-[8px]">
          <VersionDropdown
            currentModel={model}
            selectedVersion={selectedVersion}
            onSelectVersion={(v: ModelVersion) => setSelectedVersionId(v.id)}
          />
          <button
            onClick={togglePin}
            className={`p-[7px] rounded-[10px] transition-all cursor-pointer ${isPinned ? 'bg-[rgba(136,138,229,0.15)] text-white' : 'text-[rgba(255,255,255,0.4)] hover:bg-[rgba(136,138,229,0.12)] hover:text-white'}`}
            title={isPinned ? 'Открепить чат' : 'Закрепить чат'}
          >
            {isPinned ? <PinOff size={15} /> : <Pin size={15} />}
          </button>
        </div>

        {!hasSub && !subBannerDismissed && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center z-[2]">
            <button
              onClick={() => router.push('/profile?tab=subscription')}
              className="flex items-center gap-[6px] px-[14px] py-[6px] rounded-full cursor-pointer transition-all hover:brightness-110 group/pill"
              style={{ background: 'linear-gradient(135deg, #5b5bd6, #7c5cbf)', boxShadow: '0 2px 12px rgba(91,91,214,0.35)' }}
            >
              <Sparkles size={12} className="text-white" />
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-white whitespace-nowrap">Оформить подписку</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSubBannerDismissed(true) }}
              className="ml-[4px] size-[24px] rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <X size={12} className="text-[rgba(255,255,255,0.4)]" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-[10px]">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-[6px] cursor-pointer rounded-[12px] px-[14px] py-[7px] transition-all hover:bg-[rgba(136,138,229,0.12)]"
          >
            <Plus size={14} className="text-[rgba(255,255,255,0.6)]" />
            <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-[13px] text-white">Новый чат</p>
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="rounded-[12px] size-[34px] flex items-center justify-center cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.12)]"
            title="Поделиться"
          >
            <ShareIcon size={15} className="text-[rgba(255,255,255,0.5)]" />
          </button>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`rounded-[12px] size-[34px] flex items-center justify-center cursor-pointer transition-all ${settingsOpen ? 'bg-[rgba(136,138,229,0.2)]' : 'hover:bg-[rgba(136,138,229,0.12)]'}`}
            title="Настройки модели"
          >
            <img alt="" className={`max-w-none object-cover pointer-events-none size-[16px] ${settingsOpen ? 'opacity-80' : 'opacity-50'}`} src={imgFreeIconSetting} />
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center relative min-h-0 overflow-y-auto z-[1] chat-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-[40px]">
            {modelLocked ? (
              <div className="flex flex-col items-center gap-[16px] text-center">
                <div className="size-[56px] rounded-full flex items-center justify-center bg-[rgba(136,138,229,0.12)]">
                  <Lock size={24} className="text-[#a8a9f0]" />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="font-['Inter',sans-serif] font-semibold text-[18px] text-white">{model.name} доступна по подписке</p>
                  <p className="font-['Inter',sans-serif] font-normal text-[13px] text-[rgba(255,255,255,0.4)] max-w-[320px]">Оформите подписку BLACK MOUNT PRO, чтобы получить доступ к этой и другим премиум-моделям</p>
                </div>
                <button
                  onClick={() => router.push('/profile?tab=subscription')}
                  className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[12px] cursor-pointer transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, rgba(136,138,229,0.3), rgba(168,90,220,0.3))', border: '1px solid rgba(136,138,229,0.25)' }}
                >
                  <Sparkles size={14} className="text-[#c4b5fd]" />
                  <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#c4b5fd]">Оформить подписку</span>
                </button>
              </div>
            ) : (
              <>
                <p
                  className="font-['Inter',sans-serif] font-semibold leading-[40px] text-[30px] relative z-[1] bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(200,200,220,0.7), rgba(255,255,255,0.9))',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 4s ease-in-out infinite',
                  }}
                >
                  {greeting}
                </p>
                <style>{`@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
              </>
            )}
          </div>
        ) : (
          <ChatMessages
            messages={messages}
            model={model}
            msgRatings={msgRatings}
            setMsgRatings={setMsgRatings}
            setMsgShareIdx={setMsgShareIdx}
            setViewerMedia={setViewerMedia}
            setTypingIdx={setTypingIdx}
            setIsGenerating={setIsGenerating}
            setMessages={setMessages}
            setInput={setInput}
          />
        )}
      </div>

      {/* Input area */}
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleStopGeneration={handleStopGeneration}
        handleModelSwitch={handleModelSwitch}
        model={model}
        isTextModel={isTextModel}
        isGenerating={isGenerating}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        cancelRecording={cancelRecording}
        modelLocked={modelLocked}
        messagesLength={messages.length}
        dynamicCost={dynamicCost}
        webSearchActive={webSearchActive}
        setWebSearchActive={setWebSearchActive}
        deepResearchActive={deepResearchActive}
        setDeepResearchActive={setDeepResearchActive}
        attachOpen={attachOpen}
        setAttachOpen={setAttachOpen}
      />

      <ShareModal open={shareOpen || msgShareIdx !== null} onClose={() => { setShareOpen(false); setMsgShareIdx(null) }} modelName={model.name} />

      <ChatSettingsPanel
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        model={model}
        selectedVersion={selectedVersion}
        isTextModel={isTextModel}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        toneSetting={toneSetting}
        setToneSetting={setToneSetting}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        quality={quality}
        setQuality={setQuality}
        imageCount={imageCount}
        setImageCount={setImageCount}
        videoDuration={videoDuration}
        setVideoDuration={setVideoDuration}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        dynamicCost={dynamicCost}
        messagesLength={messages.length}
        handleNewChat={handleNewChat}
      />

      <ChatModals
        showLowBalance={showLowBalance}
        setShowLowBalance={setShowLowBalance}
        showLimitReached={showLimitReached}
        setShowLimitReached={setShowLimitReached}
        showAuthGate={showAuthGate}
        setShowAuthGate={setShowAuthGate}
        selectedVersion={selectedVersion}
        dynamicCost={dynamicCost}
        balance={balance}
        hasSub={hasSub}
        dailyLimit={dailyLimit}
      />

      {viewerMedia && (
        <ChatMediaLightbox media={viewerMedia} onClose={() => setViewerMedia(null)} />
      )}

      <style>{`
        @keyframes micPulseViolet {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes shimmerBar {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

'use client'

import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { aiModels } from '@/data/ai-models'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import { useRequestLimiterStore } from '@/stores/request-limiter'
import { useChatSessionsStore } from '@/stores/chat-sessions'
import { useGenerationStore } from '@/stores/generation'
import type { Message, ModelVersion } from '@/types'
import { getBasePrice, hasAudioPricing } from '@/types/models'
import { getRandomGreeting, isVersionFreeForTier, videoPricingMap, DURATION_KEY_MAP, hexToRgba } from './chat-constants'
import { useChatActions } from './use-chat-actions'
import { ChatHeader } from './chat-header'
import { ChatEmptyState } from './chat-empty-state'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { ChatSettingsPanel } from './chat-settings-panel'
import { ChatModals } from './chat-modals'
import { ChatMediaLightbox } from './chat-media-lightbox'
import { ShareModal } from './share-modal'

function ChatContainerInner() {
  const params = useParams<{ modelId: string }>()
  const searchParams = useSearchParams()
  const modelId = params.modelId

  const [showAuthGate, setShowAuthGate] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
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
  const [subBannerDismissed, setSubBannerDismissed] = useState(false)
  const [msgRatings, setMsgRatings] = useState<Record<number, 'up' | 'down'>>({})
  const [msgShareIdx, setMsgShareIdx] = useState<number | null>(null)
  const [viewerMedia, setViewerMedia] = useState<{ type: 'image' | 'video'; src: string; srcs?: string[] } | null>(null)
  const [showLimitReached, setShowLimitReached] = useState(false)
  const [greeting, setGreeting] = useState(getRandomGreeting)
  const sessionIdRef = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distanceFromBottom > 200)
  }, [])

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [])

  const balance = useBalanceStore((s) => s.balance)
  const hasSub = useSubscriptionStore((s) => s.hasActiveSubscription())
  const model = aiModels.find((m) => m.id === modelId) || aiModels[0]
  const modelLocked = useSubscriptionStore.getState().isModelLocked(model.id)
  const defaultVersion = (() => {
    const s = [...model.versions].sort((a, b) => getBasePrice(a.price) - getBasePrice(b.price))
    if (hasSub) return s[0]
    return s.find(v => !useSubscriptionStore.getState().isVersionLocked(v.id)) || s[0]
  })()
  const selectedVersion = model.versions.find((v) => v.id === selectedVersionId) || defaultVersion
  const isTextModel = model.category === 'text'
  const dailyLimit = useRequestLimiterStore.getState().getDailyLimit()

  const dynamicCost = (() => {
    const p = selectedVersion.price
    const bp = getBasePrice(p)
    const tier = useSubscriptionStore.getState().subscription.tier
    if (isVersionFreeForTier(selectedVersion.id, tier)) return 0
    const fc = isTextModel ? ((webSearchActive ? 3 : 0) + (deepResearchActive ? 3 : 0)) : 0
    if (isTextModel) return bp + fc
    if (p != null && typeof p === 'object') {
      const dk = DURATION_KEY_MAP[videoDuration]
      const qk = quality.toLowerCase()
      if (model.category === 'video' && dk) {
        const key = audioEnabled && hasAudioPricing(p) ? `${dk}_audio` : dk
        return (p[key] ?? p[dk] ?? bp) * (model.category === 'video' ? 1 : imageCount)
      }
      if (model.category === 'image') {
        return (p[qk] ?? bp) * imageCount
      }
    }
    if (model.category === 'image') return Math.round(bp * (quality === '4K' ? 2.5 : quality === '2K' ? 1.5 : 1) * imageCount)
    const vk = selectedVersion.id
    const audioVk = `${vk}-audio`
    if (audioEnabled && videoPricingMap[audioVk]) {
      return videoPricingMap[audioVk]?.[DURATION_KEY_MAP[videoDuration]] ?? bp
    }
    return videoPricingMap[vk]?.[DURATION_KEY_MAP[videoDuration]] ?? bp
  })()

  const actions = useChatActions({
    model, selectedVersion, isTextModel, modelLocked, dynamicCost, input, setInput,
    messages, setMessages, isGenerating, setIsGenerating, isRecording, setIsRecording,
    setTypingIdx, setShowAuthGate, setShowLowBalance, setShowLimitReached, setGreeting,
    webSearchActive, deepResearchActive, imageCount, sessionIdRef,
  })

  useEffect(() => { const p = searchParams.get('prompt'); if (p) setInput(p) }, [searchParams])
  useEffect(() => {
    const sid = searchParams.get('session')
    if (sid) {
      const session = useChatSessionsStore.getState().getSession(sid)
      if (session) { sessionIdRef.current = sid; setMessages(session.messages) }
    } else {
      sessionIdRef.current = null
    }
  }, [searchParams])
  useEffect(() => {
    const raw = sessionStorage.getItem('arena_continue')
    if (raw) { sessionStorage.removeItem('arena_continue'); try { const a = JSON.parse(raw) as { prompt: string; response: string }; if (a.prompt && a.response) setMessages([{ role: 'user', content: a.prompt }, { role: 'assistant', content: a.response }]) } catch { /* empty */ } }
  }, [model.id])
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams
  const modelVersionsRef = useRef(model.versions)
  modelVersionsRef.current = model.versions
  useEffect(() => {
    const versionParam = searchParamsRef.current.get('version')
    const versions = modelVersionsRef.current
    const matchedVersion = versionParam ? versions.find((v) => v.id === versionParam) : null
    if (matchedVersion) {
      setSelectedVersionId(matchedVersion.id)
    } else {
      const s = [...versions].sort((a, b) => getBasePrice(a.price) - getBasePrice(b.price))
      setSelectedVersionId(s[0]?.id || null)
    }
    setWebSearchActive(false); setDeepResearchActive(false)
    setIsRecording(false); setSettingsOpen(false)
    setGreeting(getRandomGreeting())
  }, [model.id])
  useEffect(() => {
    setAudioEnabled(false)
    setQuality('1K')
    if (model.id === 'kling') setVideoDuration('5с'); else if (model.id === 'veo31') setVideoDuration('8с')
  }, [model.id, selectedVersion.id])
  useEffect(() => {
    useGenerationStore.getState().setActiveChat(modelId)
    return () => { useGenerationStore.getState().setActiveChat(null) }
  }, [modelId])

  const prevModelIdRef = useRef(modelId)
  const actionsRef = useRef(actions)
  actionsRef.current = actions
  useEffect(() => {
    if (prevModelIdRef.current !== modelId) {
      actionsRef.current.handleStopGeneration()
      setMessages([])
      sessionIdRef.current = null
      prevModelIdRef.current = modelId
    }
  }, [modelId])

  void typingIdx

  return (
    <div className="w-full h-screen flex flex-col bg-[#121118] relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2" style={{ top: '38%', transform: 'translateX(-50%) translateY(-50%)', width: '80%', height: '55%', background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${hexToRgba(model.glowColors[0] || '#3e993e', 0.28)} 0%, ${hexToRgba(model.glowColors[1] || model.glowColors[0] || '#3e993e', 0.15)} 30%, ${hexToRgba(model.glowColors[0] || '#3e993e', 0.06)} 55%, transparent 75%)`, filter: 'blur(140px)' }} />
      </div>
      <ChatHeader model={model} selectedVersion={selectedVersion} onSelectVersion={(v: ModelVersion) => setSelectedVersionId(v.id)} hasSub={hasSub} subBannerDismissed={subBannerDismissed} setSubBannerDismissed={setSubBannerDismissed} handleNewChat={actions.handleNewChat} setShareOpen={setShareOpen} settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 flex flex-col items-center relative min-h-0 overflow-y-auto z-[1] chat-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-[16px] md:px-[24px] lg:px-[40px]"><ChatEmptyState model={model} modelLocked={modelLocked} greeting={greeting} /></div>
        ) : (
          <ChatMessages messages={messages} model={model} msgRatings={msgRatings} setMsgRatings={setMsgRatings} setMsgShareIdx={setMsgShareIdx} setViewerMedia={setViewerMedia} setTypingIdx={setTypingIdx} setIsGenerating={setIsGenerating} setMessages={setMessages} setInput={setInput} />
        )}
        {showScrollBtn && (
          <button onClick={scrollToBottom} className="sticky bottom-[16px] mb-[16px] w-[38px] h-[38px] min-w-[38px] min-h-[38px] rounded-full bg-[rgba(61,57,80,0.8)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[12px] flex items-center justify-center cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.1)] shadow-[0_4px_16px_rgba(0,0,0,0.4)] z-[10] shrink-0 aspect-square">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m0 0l-4-4m4 4l4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
      <ChatInput input={input} setInput={setInput} handleSend={actions.handleSend} handleStopGeneration={actions.handleStopGeneration} handleModelSwitch={actions.handleModelSwitch} model={model} isTextModel={isTextModel} isGenerating={isGenerating} isRecording={isRecording} toggleRecording={actions.toggleRecording} cancelRecording={actions.cancelRecording} modelLocked={modelLocked} messagesLength={messages.length} dynamicCost={dynamicCost} webSearchActive={webSearchActive} setWebSearchActive={setWebSearchActive} deepResearchActive={deepResearchActive} setDeepResearchActive={setDeepResearchActive} attachOpen={attachOpen} setAttachOpen={setAttachOpen} />
      <ShareModal
        open={shareOpen || msgShareIdx !== null}
        onClose={() => { setShareOpen(false); setMsgShareIdx(null) }}
        modelId={model.id}
        modelName={model.name}
        {...(() => {
          if (msgShareIdx !== null) {
            const msg = messages[msgShareIdx]
            const userMsg = messages.slice(0, msgShareIdx).reverse().find((m) => m.role === 'user')
            return {
              prompt: userMsg?.content || '',
              response: msg?.content || '',
              mediaType: (msg?.mediaType || 'text') as 'text' | 'image' | 'video',
              mediaUrl: msg?.mediaSrc,
            }
          }
          const lastUser = [...messages].reverse().find((m) => m.role === 'user')
          const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
          return {
            prompt: lastUser?.content || '',
            response: lastAssistant?.content || '',
            mediaType: (lastAssistant?.mediaType || 'text') as 'text' | 'image' | 'video',
            mediaUrl: lastAssistant?.mediaSrc,
          }
        })()}
      />
      <ChatSettingsPanel settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} model={model} selectedVersion={selectedVersion} isTextModel={isTextModel} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} toneSetting={toneSetting} setToneSetting={setToneSetting} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} quality={quality} setQuality={setQuality} imageCount={imageCount} setImageCount={setImageCount} videoDuration={videoDuration} setVideoDuration={setVideoDuration} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} dynamicCost={dynamicCost} messagesLength={messages.length} handleNewChat={actions.handleNewChat} />
      <ChatModals showLowBalance={showLowBalance} setShowLowBalance={setShowLowBalance} showLimitReached={showLimitReached} setShowLimitReached={setShowLimitReached} showAuthGate={showAuthGate} setShowAuthGate={setShowAuthGate} selectedVersion={selectedVersion} dynamicCost={dynamicCost} balance={balance} hasSub={hasSub} dailyLimit={dailyLimit} />
      {viewerMedia && <ChatMediaLightbox media={viewerMedia} onClose={() => setViewerMedia(null)} />}
      <style>{`@keyframes micPulseViolet { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.35); opacity: 0; } } @keyframes shimmerBar { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  )
}

export function ChatContainer() {
  return (
    <Suspense fallback={null}>
      <ChatContainerInner />
    </Suspense>
  )
}

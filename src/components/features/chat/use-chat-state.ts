'use client'

import { useState, useRef, useMemo } from 'react'
import { useParams, useSearchParams, notFound } from 'next/navigation'
import { aiModels } from '@/data/ai-models'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import { useRequestLimiterStore } from '@/stores/request-limiter'
import type { Message } from '@/types'
import { getBasePrice } from '@/types/models'
import { getRandomGreeting } from './chat-constants'
import { computeDynamicCost } from './compute-dynamic-cost'
import { useChatActions } from './use-chat-actions'
import { useChatScroll } from './use-chat-scroll'
import { useChatEffects } from './use-chat-effects'

export function useChatState() {
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
  const [, setTypingIdx] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [subBannerDismissed, setSubBannerDismissed] = useState(false)
  const [msgRatings, setMsgRatings] = useState<Record<number, 'up' | 'down'>>({})
  const [msgShareIdx, setMsgShareIdx] = useState<number | null>(null)
  const [viewerMedia, setViewerMedia] = useState<{ type: 'image' | 'video'; src: string; srcs?: string[] } | null>(null)
  const [showLimitReached, setShowLimitReached] = useState(false)
  const [greeting, setGreeting] = useState(getRandomGreeting)
  const sessionIdRef = useRef<string | null>(null)
  const { scrollRef, showScrollBtn, handleScroll, scrollToBottom } = useChatScroll()

  const balance = useBalanceStore((s) => s.balance)
  const hasSub = useSubscriptionStore((s) => s.hasActiveSubscription())
  const isModelLocked = useSubscriptionStore((s) => s.isModelLocked)
  const isVersionLocked = useSubscriptionStore((s) => s.isVersionLocked)
  const tier = useSubscriptionStore((s) => s.subscription.tier)
  const model = aiModels.find((m) => m.id === modelId)
  if (!model) {
    notFound()
  }
  const modelLocked = isModelLocked(model.id)
  const defaultVersion = (() => {
    const s = [...model.versions].sort((a, b) => getBasePrice(a.price) - getBasePrice(b.price))
    if (hasSub) return s[0]
    return s.find(v => !isVersionLocked(v.id)) || s[0]
  })()
  const selectedVersion = model.versions.find((v) => v.id === selectedVersionId) || defaultVersion
  const isTextModel = model.category === 'text'
  const dailyLimit = useRequestLimiterStore((s) => s.getDailyLimit())

  const dynamicCost = useMemo(() => {
    return computeDynamicCost({
      model,
      selectedVersion,
      tier,
      isTextModel,
      webSearchActive,
      deepResearchActive,
      videoDuration,
      quality,
      audioEnabled,
      imageCount,
    })
  }, [model, selectedVersion, tier, isTextModel, webSearchActive, deepResearchActive, videoDuration, quality, audioEnabled, imageCount])

  const actions = useChatActions({
    model, selectedVersion, isTextModel, modelLocked, dynamicCost, input, setInput,
    messages, setMessages, isGenerating, setIsGenerating, isRecording, setIsRecording,
    setTypingIdx, setShowAuthGate, setShowLowBalance, setShowLimitReached, setGreeting,
    webSearchActive, deepResearchActive, imageCount, sessionIdRef,
  })

  useChatEffects({
    model, modelId, searchParams, sessionIdRef, setInput, setMessages, setSelectedVersionId,
    setWebSearchActive, setDeepResearchActive, setIsRecording, setSettingsOpen, setGreeting,
    setAudioEnabled, setQuality, setVideoDuration, selectedVersionId,
    handleStopGeneration: actions.handleStopGeneration,
  })

  return {
    model, selectedVersion, modelLocked, isTextModel, dynamicCost, balance, hasSub, dailyLimit,
    messages, setMessages, input, setInput, setSelectedVersionId,
    attachOpen, setAttachOpen, shareOpen, setShareOpen, settingsOpen, setSettingsOpen,
    systemPrompt, setSystemPrompt, toneSetting, setToneSetting, aspectRatio, setAspectRatio,
    quality, setQuality, imageCount, setImageCount, videoDuration, setVideoDuration,
    audioEnabled, setAudioEnabled, isRecording, webSearchActive, setWebSearchActive,
    deepResearchActive, setDeepResearchActive, showLowBalance, setShowLowBalance,
    setTypingIdx, isGenerating, setIsGenerating, subBannerDismissed, setSubBannerDismissed,
    msgRatings, setMsgRatings, msgShareIdx, setMsgShareIdx, viewerMedia, setViewerMedia,
    showLimitReached, setShowLimitReached, greeting, showAuthGate, setShowAuthGate,
    scrollRef, showScrollBtn, handleScroll, scrollToBottom, actions,
  }
}

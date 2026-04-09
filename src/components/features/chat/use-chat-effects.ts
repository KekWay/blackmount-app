'use client'

import { useEffect, useRef } from 'react'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { getBasePrice } from '@/types/models'
import { useChatSessionsStore } from '@/stores/chat-sessions'
import { useGenerationStore } from '@/stores/generation'
import type { Message } from '@/types'
import { getRandomGreeting } from './chat-constants'
import type { aiModels } from '@/data/ai-models'

type Model = (typeof aiModels)[number]

interface Params {
  model: Model
  modelId: string
  searchParams: ReadonlyURLSearchParams
  sessionIdRef: React.MutableRefObject<string | null>
  setInput: (v: string) => void
  setMessages: (m: Message[]) => void
  setSelectedVersionId: (v: string | null) => void
  setWebSearchActive: (v: boolean) => void
  setDeepResearchActive: (v: boolean) => void
  setIsRecording: (v: boolean) => void
  setSettingsOpen: (v: boolean) => void
  setGreeting: (v: string) => void
  setAudioEnabled: (v: boolean) => void
  setQuality: (v: string) => void
  setVideoDuration: (v: string) => void
  selectedVersionId: string | null
  handleStopGeneration: () => void
}

export function useChatEffects(p: Params) {
  const { model, modelId, searchParams, sessionIdRef } = p

  useEffect(() => { const q = searchParams.get('prompt'); if (q) p.setInput(q) }, [searchParams])

  useEffect(() => {
    const sid = searchParams.get('session')
    if (sid) {
      const session = useChatSessionsStore.getState().getSession(sid)
      if (session) { sessionIdRef.current = sid; p.setMessages(session.messages) }
    } else {
      sessionIdRef.current = null
    }
  }, [searchParams])

  useEffect(() => {
    let raw: string | null = null
    try { raw = sessionStorage.getItem('arena_continue') } catch {}
    if (raw) {
      try { sessionStorage.removeItem('arena_continue') } catch {}
      try {
        const a = JSON.parse(raw) as { prompt: string; response: string }
        if (a.prompt && a.response) p.setMessages([{ role: 'user', content: a.prompt }, { role: 'assistant', content: a.response }])
      } catch { /* empty */ }
    }
  }, [model.id])

  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams
  const modelVersionsRef = useRef(model.versions)
  modelVersionsRef.current = model.versions

  const versionFromUrl = searchParams.get('version')
  useEffect(() => {
    const versions = modelVersionsRef.current
    const matchedVersion = versionFromUrl ? versions.find((v) => v.id === versionFromUrl) : null
    if (matchedVersion) {
      p.setSelectedVersionId(matchedVersion.id)
    } else {
      const s = [...versions].sort((a, b) => getBasePrice(a.price) - getBasePrice(b.price))
      p.setSelectedVersionId(s[0]?.id || null)
    }
    p.setWebSearchActive(false); p.setDeepResearchActive(false)
    p.setIsRecording(false); p.setSettingsOpen(false)
    p.setGreeting(getRandomGreeting())
  }, [model.id, versionFromUrl])

  useEffect(() => {
    p.setAudioEnabled(false)
    p.setQuality('1K')
    if (model.id === 'kling') p.setVideoDuration('5с'); else if (model.id === 'veo31') p.setVideoDuration('8с')
  }, [model.id, p.selectedVersionId])

  useEffect(() => {
    useGenerationStore.getState().setActiveChat(modelId)
    return () => { useGenerationStore.getState().setActiveChat(null) }
  }, [modelId])

  const prevModelIdRef = useRef(modelId)
  const stopRef = useRef(p.handleStopGeneration)
  stopRef.current = p.handleStopGeneration
  useEffect(() => {
    if (prevModelIdRef.current !== modelId) {
      stopRef.current()
      p.setMessages([])
      sessionIdRef.current = null
      prevModelIdRef.current = modelId
    }
  }, [modelId])
}

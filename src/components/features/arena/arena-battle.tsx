'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { useArenaGuardStore } from '@/stores/arena-guard'
import { useArenaGuard } from './use-arena-guard'
import { useBalanceStore } from '@/stores/balance'
import { useSubscriptionStore } from '@/stores/subscription'
import { useRequestLimiterStore } from '@/stores/request-limiter'
import { SubscriptionGateModal } from '@/components/shared/subscription-gate'
import type { ArenaModel, ArenaCategory } from '@/data/arena-models'
import type { Phase, ModelResponse } from './arena-data'
import { ARENA_LOCKED_IDS, getMock } from './arena-data'
import { ArenaTopBar } from './arena-top-bar'
import { ArenaIdleView } from './arena-idle-view'
import { ArenaGeneratingView } from './arena-generating-view'
import { ArenaVotingView } from './arena-voting-view'
import { ArenaWinnerView } from './arena-winner-view'
import { ArenaInputBar } from './arena-input-bar'
import { ArenaInputHints } from './arena-input-hints'
import { ArenaLimitModal } from './arena-limit-modal'
import { ArenaPromptOverlay, ArenaLeaveGuardModal } from './arena-battle-modals'
import { ShareModal } from '@/components/features/chat/share-modal'
import { ModalAuthGate } from '@/components/features/chat/modal-auth-gate'

export function ArenaBattle() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { balance, deductBalance } = useBalanceStore()
  const hasSub = useSubscriptionStore((s) => s.hasActiveSubscription())
  const { canMakeRequest, consumeRequest } = useRequestLimiterStore()

  const [, setCategory] = useState<ArenaCategory>('text')
  const [selectedModels, setSelectedModels] = useState<ArenaModel[]>([])
  const [prompt, setPrompt] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [responses, setResponses] = useState<ModelResponse[]>([])
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [savedIds, setSaved] = useState<Set<string>>(new Set())
  const [ratedId, setRatedId] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [showLosers, setShowLosers] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showLimitReached, setShowLimitReached] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [gateModelName, setGateModelName] = useState('')
  const [promptOpen, setPromptOpen] = useState(false)
  const [arenaShareOpen, setArenaShareOpen] = useState(false)
  const [showAuthGate, setShowAuthGate] = useState(false)
  const togglePrompt = useCallback(() => setPromptOpen((p) => !p), [])

  const setGuardActive = useArenaGuardStore((s) => s.setActive)
  const pendingHref = useArenaGuardStore((s) => s.pendingHref)
  const clearPending = useArenaGuardStore((s) => s.clearPending)

  const hasActiveSession = phase === 'generating' || phase === 'voting' || phase === 'winner'
  useArenaGuard(hasActiveSession)

  const confirmLeave = () => {
    if (pendingHref) {
      setGuardActive(false)
      router.push(pendingHref)
      clearPending()
      reset()
    }
  }

  const totalCost = selectedModels.reduce((s, m) => s + m.price, 0)
  const canAfford = balance >= totalCost
  const canSend = selectedModels.length >= 2 && prompt.trim().length > 0 && canAfford && phase === 'idle'
  const gridCols = 2

  const toggle = (m: ArenaModel) => {
    if (!hasSub && ARENA_LOCKED_IDS.has(m.id)) {
      setGateModelName(m.name); setGateOpen(true); return
    }
    setSelectedModels((p) => p.find((x) => x.id === m.id) ? p.filter((x) => x.id !== m.id) : p.length >= 4 ? p : [...p, m])
  }

  const send = () => {
    if (!canSend) return
    if (!isLoggedIn) { setShowAuthGate(true); return }
    if (!canMakeRequest()) { setShowLimitReached(true); return }
    consumeRequest()
    setCurrentPrompt(prompt); setPrompt(''); setPhase('generating')
    setWinnerId(null); setSaved(new Set()); setRatedId(null); setShowLosers(true)
    deductBalance(totalCost)
    setTimeout(() => {
      setResponses(selectedModels.map((m) => ({ model: m, text: getMock(m) })))
      setPhase('voting')
    }, 1200 + Math.random() * 800)
  }

  const vote = (modelId: string) => {
    if (phase !== 'voting') return
    setWinnerId(modelId); setPhase('winner')
    setTimeout(() => setShowLosers(false), 600)
  }

  const save = (id: string) => setSaved((p) => new Set(p).add(id))
  const goChat = (m: ArenaModel) => {
    const winResp = responses.find((r) => r.model.id === m.id)
    if (winResp && currentPrompt) {
      try { sessionStorage.setItem('arena_continue', JSON.stringify({ prompt: currentPrompt, response: winResp.text, modelName: winResp.model.name })) } catch {}
    }
    router.push(`/chat/${m.aiModelRef || m.id}`)
  }
  const toggleExpand = (id: string) => setExpandedId((prev) => prev === id ? null : id)
  const reset = () => { setPhase('idle'); setResponses([]); setWinnerId(null); setSaved(new Set()); setRatedId(null); setCurrentPrompt(''); setShowLosers(true); setExpandedId(null) }
  const winnerResponse = responses.find((r) => r.model.id === winnerId)

  return (
    <div className="flex flex-col h-full w-full">
      <ArenaTopBar selectedModels={selectedModels} totalCost={totalCost} currentPrompt={currentPrompt} promptOpen={promptOpen} modelsDisabled={hasActiveSession} onTogglePrompt={togglePrompt} onToggle={toggle} onCategoryChange={setCategory} />
      <div className="flex-1 overflow-y-auto chat-scrollbar relative">
        {phase === 'idle' && <ArenaIdleView selectedModels={selectedModels} gridCols={gridCols} />}
        {phase === 'generating' && <ArenaGeneratingView selectedModels={selectedModels} gridCols={gridCols} />}
        {phase === 'voting' && <ArenaVotingView responses={responses} gridCols={gridCols} expandedId={expandedId} onVote={vote} onToggleExpand={toggleExpand} />}
        {phase === 'winner' && winnerResponse && <ArenaWinnerView responses={responses} winnerResponse={winnerResponse} winnerId={winnerId!} prompt={currentPrompt} gridCols={gridCols} showLosers={showLosers} savedIds={savedIds} ratedId={ratedId} onSave={save} onRate={setRatedId} onReset={reset} onGoChat={goChat} onShare={() => setArenaShareOpen(true)} />}

        <ArenaPromptOverlay open={promptOpen} currentPrompt={currentPrompt} onClose={() => setPromptOpen(false)} />
      </div>
      {(phase === 'idle' || phase === 'winner') && (
        <>
          <ArenaInputHints selectedModels={selectedModels} canAfford={canAfford} totalCost={totalCost} balance={balance} />
          <ArenaInputBar prompt={prompt} totalCost={totalCost} canSend={canSend} onPromptChange={setPrompt} onSend={send} />
        </>
      )}
      <ArenaLimitModal open={showLimitReached} onClose={() => setShowLimitReached(false)} />
      <ModalAuthGate show={showAuthGate} onClose={() => setShowAuthGate(false)} />
      <SubscriptionGateModal open={gateOpen} onClose={() => setGateOpen(false)} modelName={gateModelName} />

      {winnerResponse && (
        <ShareModal
          open={arenaShareOpen}
          onClose={() => setArenaShareOpen(false)}
          modelId={winnerResponse.model.aiModelRef || winnerResponse.model.id}
          modelName={winnerResponse.model.name}
          prompt={currentPrompt}
          response={winnerResponse.text}
        />
      )}

      <ArenaLeaveGuardModal pendingHref={pendingHref} onStay={clearPending} onLeave={confirmLeave} />
    </div>
  )
}

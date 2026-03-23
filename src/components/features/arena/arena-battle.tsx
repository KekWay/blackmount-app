'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuthStore } from '@/stores/auth'
import { useArenaGuardStore } from '@/stores/arena-guard'
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
import { ShareModal } from '@/components/features/chat/share-modal'

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
  const togglePrompt = useCallback(() => setPromptOpen((p) => !p), [])

  const setGuardActive = useArenaGuardStore((s) => s.setActive)
  const pendingHref = useArenaGuardStore((s) => s.pendingHref)
  const clearPending = useArenaGuardStore((s) => s.clearPending)

  const hasActiveSession = phase === 'generating' || phase === 'voting' || phase === 'winner'

  useEffect(() => {
    setGuardActive(hasActiveSession)
    return () => setGuardActive(false)
  }, [hasActiveSession, setGuardActive])

  useEffect(() => {
    if (!hasActiveSession) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasActiveSession])

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
    if (!isLoggedIn) { router.push('/auth'); return }
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
      sessionStorage.setItem('arena_continue', JSON.stringify({ prompt: currentPrompt, response: winResp.text, modelName: winResp.model.name }))
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

        {/* Prompt overlay */}
        <AnimatePresence>
          {promptOpen && currentPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[40] flex items-start justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]"
              onClick={() => setPromptOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="mt-[40px] mx-[20px] w-full max-w-[560px] max-h-[70%] rounded-[16px] bg-[#1e1b2e] shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-[18px] py-[12px]">
                  <span className="text-[13px] text-[rgba(255,255,255,0.5)] font-medium">Ваш запрос</span>
                  <button onClick={() => setPromptOpen(false)} className="text-[rgba(255,255,255,0.3)] hover:text-white transition-colors cursor-pointer p-[4px] rounded-[6px] hover:bg-[rgba(255,255,255,0.06)]">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto chat-scrollbar px-[18px] py-[14px]">
                  <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-[22px] whitespace-pre-wrap">{currentPrompt}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {(phase === 'idle' || phase === 'winner') && (
        <>
          <ArenaInputHints selectedModels={selectedModels} canAfford={canAfford} totalCost={totalCost} balance={balance} />
          <ArenaInputBar prompt={prompt} totalCost={totalCost} canSend={canSend} onPromptChange={setPrompt} onSend={send} />
        </>
      )}
      <ArenaLimitModal open={showLimitReached} onClose={() => setShowLimitReached(false)} />
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

      {/* Navigation guard modal */}
      <AnimatePresence>
        {pendingHref && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-[4px]"
            onClick={clearPending}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[380px] rounded-[16px] bg-[#1e1b2e] shadow-2xl p-[24px] flex flex-col items-center gap-[16px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="size-[45px]" style={{ backgroundColor: '#f87171', maskImage: "url('/assets/models/warning-arena.png')", WebkitMaskImage: "url('/assets/models/warning-arena.png')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
              <h3 className="text-[16px] text-white font-semibold text-center">Покинуть арену?</h3>
              <p className="text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px]">
                Результаты текущей битвы будут потеряны. Вы уверены, что хотите уйти?
              </p>
              <div className="flex items-center gap-[10px] w-full mt-[4px]">
                <button onClick={clearPending} className="flex-1 h-[40px] rounded-[10px] bg-[rgba(255,255,255,0.06)] text-[13px] text-[rgba(255,255,255,0.6)] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                  Остаться
                </button>
                <button onClick={confirmLeave} className="flex-1 h-[40px] rounded-[10px] bg-[#dc2626] text-[13px] text-white font-medium hover:bg-[#ef4444] transition-colors cursor-pointer">
                  Покинуть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

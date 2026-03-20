'use client'

import type { ModelVersion } from '@/types'
import { ModalLowBalance } from './modal-low-balance'
import { ModalLimitReached } from './modal-limit-reached'
import { ModalAuthGate } from './modal-auth-gate'

interface ChatModalsProps {
  showLowBalance: boolean
  setShowLowBalance: (v: boolean) => void
  showLimitReached: boolean
  setShowLimitReached: (v: boolean) => void
  showAuthGate: boolean
  setShowAuthGate: (v: boolean) => void
  selectedVersion: ModelVersion
  dynamicCost: number
  balance: number
  hasSub: boolean
  dailyLimit: number
}

export function ChatModals({
  showLowBalance, setShowLowBalance,
  showLimitReached, setShowLimitReached,
  showAuthGate, setShowAuthGate,
  selectedVersion, dynamicCost, balance, hasSub, dailyLimit,
}: ChatModalsProps) {
  return (
    <>
      <ModalLowBalance
        show={showLowBalance}
        onClose={() => setShowLowBalance(false)}
        selectedVersion={selectedVersion}
        dynamicCost={dynamicCost}
        balance={balance}
      />
      <ModalLimitReached
        show={showLimitReached}
        onClose={() => setShowLimitReached(false)}
        hasSub={hasSub}
        dailyLimit={dailyLimit}
      />
      <ModalAuthGate
        show={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
    </>
  )
}

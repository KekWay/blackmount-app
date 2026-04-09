'use client'

import { useEffect } from 'react'
import { useArenaGuardStore } from '@/stores/arena-guard'

export function useArenaGuard(hasActiveSession: boolean) {
  const setGuardActive = useArenaGuardStore((s) => s.setActive)

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
}

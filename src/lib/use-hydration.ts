import { useState, useEffect } from 'react'

/**
 * Возвращает true только после клиентской гидрации localStorage.
 * Используй для показа skeleton вместо данных из persisted stores
 * на первый рендер (SSR → client).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])
  return hydrated
}

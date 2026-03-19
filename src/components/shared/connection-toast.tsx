'use client'

import { useState, useEffect, useCallback } from 'react'
import { WifiOff, Wifi, X } from 'lucide-react'

interface ToastItem {
  id: number
  type: 'offline' | 'online'
  message: string
}

let toastIdCounter = 0

export function ConnectionToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((type: 'offline' | 'online', message: string) => {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, type === 'online' ? 3000 : 6000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const handleOffline = () => addToast('offline', 'Нет подключения к интернету')
    const handleOnline = () => addToast('online', 'Соединение восстановлено')
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    if (!navigator.onLine) addToast('offline', 'Нет подключения к интернету')
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [addToast])

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[360px]" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <div className={`flex items-center gap-3 pl-4 pr-2.5 py-3 rounded-2xl border backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${
              toast.type === 'offline'
                ? 'bg-[rgba(30,20,20,0.9)] border-red-500/25'
                : 'bg-[rgba(20,30,20,0.9)] border-green-500/25'
            }`} role="alert">
              <div className={`shrink-0 size-9 rounded-xl flex items-center justify-center ${
                toast.type === 'offline' ? 'bg-red-500/15' : 'bg-green-500/15'
              }`}>
                {toast.type === 'offline' ? <WifiOff size={18} className="text-red-500" /> : <Wifi size={18} className="text-green-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white font-bold leading-tight">
                  {toast.type === 'offline' ? 'Нет соединения' : 'Онлайн'}
                </p>
                <p className="text-[11px] text-white/45 leading-tight mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} aria-label="Закрыть" className="shrink-0 size-7 rounded-lg flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer">
                <X size={14} className="text-white/40" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

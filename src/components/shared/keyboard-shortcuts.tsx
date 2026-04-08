'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
const modLabel = isMac ? '⌘' : 'Ctrl'

const NAV_ROUTES: Record<string, string> = {
  '1': '/',
  '2': '/history',
  '3': '/prompts',
  '4': '/knowledge',
  '5': '/rating',
  '6': '/arena',
}

const SHORTCUT_LIST = [
  { keys: `${modLabel} + K`, label: 'Поиск команд' },
  { keys: `${modLabel} + 1`, label: 'Главная' },
  { keys: `${modLabel} + 2`, label: 'История' },
  { keys: `${modLabel} + 3`, label: 'Промпты' },
  { keys: `${modLabel} + 4`, label: 'База знаний' },
  { keys: `${modLabel} + 5`, label: 'Рейтинг' },
  { keys: `${modLabel} + 6`, label: 'Арена' },
  { keys: `${modLabel} + Shift + C`, label: 'Копировать последний ответ' },
  { keys: `${modLabel} + /`, label: 'Горячие клавиши' },
  { keys: 'Escape', label: 'Закрыть окно / остановить генерацию' },
]

function copyLastResponse() {
  const nodes = document.querySelectorAll('[data-role="assistant"]')
  const last = nodes[nodes.length - 1]
  if (last) navigator.clipboard.writeText(last.textContent ?? '')
}

function ShortcutsHelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-[420px] max-w-[90vw] bg-[#1a1926] rounded-2xl border border-white/[0.08] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-maven text-lg font-bold text-white mb-4">Горячие клавиши</h2>
        <div className="flex flex-col gap-1">
          {SHORTCUT_LIST.map((s) => (
            <div key={s.keys} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-white/60">{s.label}</span>
              <kbd className="text-xs text-white/40 bg-white/[0.06] px-2 py-1 rounded font-mono">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-white/20">
          Нажмите Escape чтобы закрыть
        </p>
      </div>
    </div>
  )
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const [helpOpen, setHelpOpen] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      const tag = (e.target as HTMLElement).tagName

      if (e.key === 'Escape') {
        if (helpOpen) setHelpOpen(false)
        return
      }

      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (mod && e.key === '/') {
          e.preventDefault()
          setHelpOpen((v) => !v)
        }
        return
      }

      if (!mod) return

      if (NAV_ROUTES[e.key]) {
        e.preventDefault()
        router.push(NAV_ROUTES[e.key])
      } else if (e.key === '/') {
        e.preventDefault()
        setHelpOpen((v) => !v)
      } else if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault()
        copyLastResponse()
      }
    },
    [router, helpOpen],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return helpOpen ? <ShortcutsHelpModal onClose={() => setHelpOpen(false)} /> : null
}

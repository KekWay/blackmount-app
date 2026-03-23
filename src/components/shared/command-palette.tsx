'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Clock, Image, Trophy, Zap, BookOpen, MessageSquare, User, CreditCard, Plus } from 'lucide-react'
import { aiModels } from '@/data/ai-models'

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
const modKey = isMac ? '⌘' : 'Ctrl'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  category: 'navigation' | 'models' | 'actions'
  keywords?: string[]
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: CommandItem[] = [
    { id: 'home', label: 'Главная', description: 'Библиотека моделей', icon: <Home size={16} />, action: () => router.push('/'), category: 'navigation', keywords: ['home', 'главная'] },
    { id: 'history', label: 'История', icon: <Clock size={16} />, action: () => router.push('/history'), category: 'navigation', keywords: ['history', 'история'] },
    { id: 'prompts', label: 'Промпты', icon: <Image size={16} />, action: () => router.push('/prompts'), category: 'navigation', keywords: ['prompts', 'промпты'] },
    { id: 'knowledge', label: 'База знаний', icon: <BookOpen size={16} />, action: () => router.push('/knowledge'), category: 'navigation', keywords: ['knowledge', 'база'] },
    { id: 'rating', label: 'Рейтинг', icon: <Trophy size={16} />, action: () => router.push('/rating'), category: 'navigation', keywords: ['rating', 'рейтинг'] },
    { id: 'arena', label: 'Арена', icon: <Zap size={16} />, action: () => router.push('/arena'), category: 'navigation', keywords: ['arena', 'арена'] },
    { id: 'profile', label: 'Профиль', icon: <User size={16} />, action: () => router.push('/profile'), category: 'navigation', keywords: ['profile', 'профиль'] },
    { id: 'subscription', label: 'Подписка', icon: <CreditCard size={16} />, action: () => router.push('/subscription'), category: 'navigation', keywords: ['подписка'] },
    ...aiModels.map((m) => ({
      id: `model-${m.id}`, label: m.name, description: `Открыть чат с ${m.name}`, icon: <MessageSquare size={16} />,
      action: () => router.push(`/chat/${m.id}`), category: 'models' as const, keywords: [m.name.toLowerCase(), m.id],
    })),
    { id: 'new-chat', label: 'Новый чат', icon: <Plus size={16} />, action: () => router.push('/'), category: 'actions', keywords: ['new', 'новый'] },
  ]

  const filtered = query.trim()
    ? commands.filter((c) => {
        const q = query.toLowerCase()
        return c.label.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.keywords?.some((k) => k.includes(q))
      })
    : commands

  const groups = { navigation: filtered.filter((c) => c.category === 'navigation'), models: filtered.filter((c) => c.category === 'models'), actions: filtered.filter((c) => c.category === 'actions') }
  const flatList = [...groups.navigation, ...groups.models, ...groups.actions]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen((v) => !v); setQuery(''); setSelectedIdx(0) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50) }, [open])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, flatList.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && flatList[selectedIdx]) { flatList[selectedIdx].action(); setOpen(false) }
    else if (e.key === 'Escape') setOpen(false)
  }, [flatList, selectedIdx])

  if (!open) return null

  const LABELS: Record<string, string> = { navigation: 'Навигация', models: 'Модели', actions: 'Действия' }

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-[520px] max-w-[90vw] bg-[#1a1926] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b border-white/[0.06]">
          <img src="/assets/models/search-icon.png" alt="" className="size-[18px] object-contain shrink-0" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
          <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0) }} onKeyDown={handleKeyDown} placeholder="Поиск команд..." className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder:text-white/30 outline-none" />
          <kbd className="text-[10px] text-white/20 bg-white/[0.06] px-1.5 py-0.5 rounded">{modKey}K</kbd>
        </div>
        <div className="max-h-[360px] overflow-y-auto py-2">
          {flatList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-[8px]">
              <img src="/assets/models/search-empty.png" alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
              <p className="text-sm text-white/30 text-center">По вашему запросу ничего не найдено</p>
            </div>
          )}
          {(['navigation', 'models', 'actions'] as const).map((cat) => {
            const items = groups[cat]
            if (items.length === 0) return null
            return (
              <div key={cat}>
                <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium px-4 pt-2 pb-1">{LABELS[cat]}</p>
                {items.map((cmd) => {
                  const idx = flatList.indexOf(cmd)
                  return (
                    <button key={cmd.id} onClick={() => { cmd.action(); setOpen(false) }} onMouseEnter={() => setSelectedIdx(idx)}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-left transition-colors cursor-pointer ${idx === selectedIdx ? 'bg-primary/10 text-white' : 'text-white/60 hover:bg-white/[0.04]'}`}>
                      <span className="shrink-0 text-white/40">{cmd.icon}</span>
                      <span className="text-[13px] font-medium">{cmd.label}</span>
                      {cmd.description && <span className="text-[11px] text-white/25 ml-auto truncate">{cmd.description}</span>}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

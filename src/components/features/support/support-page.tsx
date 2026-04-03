'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { useSupportStore } from '@/stores/support-store'
import { SupportTicketList } from './support-ticket-list'
import { SupportChat } from './support-chat'
import { SupportNewTicket } from './support-new-ticket'

type View = 'list' | 'chat' | 'new'

export function SupportPage() {
  const router = useRouter()
  const tickets = useSupportStore((s) => s.tickets)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<View>('list')

  const activeTicket = tickets.find((t) => t.id === activeId) ?? null

  const handleSelect = (id: string) => {
    setActiveId(id)
    setView('chat')
  }

  const handleNew = () => setView('new')

  const handleCreated = (id: string) => {
    setActiveId(id)
    setView('chat')
  }

  const handleBack = () => {
    setView('list')
    setActiveId(null)
  }

  return (
    <div className="bg-[#121118] fixed inset-0 z-50 flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-between px-[16px] md:px-[24px] py-[14px] shrink-0">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(136,138,229,0.15)] to-transparent" />
        <div className="flex items-center gap-[10px]">
          <img src={APP_ASSETS.logo} alt="" className="size-[26px] object-contain brightness-0 invert" />
          <p className="font-manrope font-semibold text-[20px] text-white">Поддержка</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-[rgba(255,255,255,0.35)] hover:text-white transition-colors cursor-pointer font-manrope font-medium text-[13px] flex items-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] rounded-[10px] px-[14px] py-[7px]"
        >
          {'\u2715'} Закрыть
        </button>
      </div>

      {/* Desktop: split view */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-[300px] shrink-0 border-r border-[rgba(255,255,255,0.06)] bg-[#181724]">
          <SupportTicketList tickets={tickets} activeId={activeId} onSelect={handleSelect} onNew={handleNew} />
        </div>
        <div className="flex-1 bg-[#121118] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view === 'new' ? 'new' : activeId ?? 'empty'}
              className="h-full"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              {view === 'new' ? (
                <SupportNewTicket onCreated={handleCreated} onBack={handleBack} />
              ) : activeTicket ? (
                <SupportChat ticket={activeTicket} />
              ) : (
                <EmptyState onNew={handleNew} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: single view */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div key="list" className="w-full bg-[#181724]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <SupportTicketList tickets={tickets} activeId={null} onSelect={handleSelect} onNew={handleNew} />
            </motion.div>
          )}
          {view === 'chat' && activeTicket && (
            <motion.div key="chat" className="w-full bg-[#121118]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <SupportChat ticket={activeTicket} onBack={handleBack} />
            </motion.div>
          )}
          {view === 'new' && (
            <motion.div key="new" className="w-full bg-[#121118]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <SupportNewTicket onCreated={handleCreated} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[16px]">
      <div className="flex flex-col items-center gap-[6px]">
        <p className="text-[15px] text-[rgba(255,255,255,0.4)] font-manrope font-medium">Выберите обращение</p>
        <p className="text-[13px] text-[rgba(255,255,255,0.2)] font-manrope">или создайте новое, чтобы начать</p>
      </div>
      <button
        onClick={onNew}
        className="px-[18px] h-[38px] rounded-[12px] bg-[#888ae5] hover:bg-[#7678d0] text-[13px] text-white font-manrope font-semibold cursor-pointer transition-colors"
      >
        Новое обращение
      </button>
    </div>
  )
}

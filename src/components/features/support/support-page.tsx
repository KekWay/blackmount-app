'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
      <div className="flex items-center justify-between px-[16px] md:px-[24px] py-[14px] border-b border-[rgba(255,255,255,0.06)] shrink-0">
        <div className="flex items-center gap-[10px]">
          <button
            onClick={() => router.back()}
            className="size-[34px] flex items-center justify-center rounded-[10px] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} className="text-white/60" />
          </button>
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
        <div className="flex-1 bg-[#121118]">
          {view === 'new' ? (
            <SupportNewTicket onCreated={handleCreated} onBack={handleBack} />
          ) : activeTicket ? (
            <SupportChat ticket={activeTicket} />
          ) : (
            <EmptyState onNew={handleNew} />
          )}
        </div>
      </div>

      {/* Mobile: single view */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {view === 'list' && (
          <div className="w-full bg-[#181724]">
            <SupportTicketList tickets={tickets} activeId={null} onSelect={handleSelect} onNew={handleNew} />
          </div>
        )}
        {view === 'chat' && activeTicket && (
          <div className="w-full bg-[#121118]">
            <SupportChat ticket={activeTicket} onBack={handleBack} />
          </div>
        )}
        {view === 'new' && (
          <div className="w-full bg-[#121118]">
            <SupportNewTicket onCreated={handleCreated} onBack={handleBack} />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-[12px]">
      <p className="text-[14px] text-[rgba(255,255,255,0.25)] font-manrope">Выберите обращение или создайте новое</p>
      <button
        onClick={onNew}
        className="px-[16px] py-[8px] rounded-[10px] bg-[rgba(136,138,229,0.12)] hover:bg-[rgba(136,138,229,0.2)] text-[13px] text-[#888ae5] font-medium cursor-pointer transition-colors"
      >
        Новое обращение
      </button>
    </div>
  )
}

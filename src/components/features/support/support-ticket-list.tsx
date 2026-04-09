'use client'

import type { SupportTicket, TicketStatus } from '@/types'
import { formatDateShort } from '@/lib/utils'

interface SupportTicketListProps {
  tickets: SupportTicket[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}

const statusLabels: Record<TicketStatus, string> = {
  open: 'Открыт',
  answered: 'Отвечен',
  closed: 'Закрыт',
}

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-[rgba(234,179,8,0.15)] text-[#eab308]',
  answered: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]',
  closed: 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.35)]',
}

const formatDate = formatDateShort

export function SupportTicketList({ tickets, activeId, onSelect, onNew }: SupportTicketListProps) {
  const sorted = [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div className="flex flex-col h-full">
      <div className="px-[16px] py-[14px]">
        <div className="flex items-center justify-between mb-[12px]">
          <p className="font-manrope font-semibold text-[15px] text-white">Обращения</p>
        </div>
        <button
          onClick={onNew}
          className="w-full h-[36px] rounded-[12px] bg-[#888ae5] hover:bg-[#7678d0] text-[13px] text-white font-manrope font-semibold cursor-pointer transition-colors flex items-center justify-center"
        >
          Новое обращение
        </button>
      </div>
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {sorted.length === 0 && (
          <p className="text-[13px] text-[rgba(255,255,255,0.25)] text-center mt-[40px] px-[16px]">Нет обращений</p>
        )}
        {sorted.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full text-left px-[16px] py-[12px] border-b border-[rgba(255,255,255,0.04)] cursor-pointer transition-colors ${
              activeId === t.id ? 'bg-[rgba(136,138,229,0.08)]' : 'hover:bg-[rgba(255,255,255,0.02)]'
            }`}
          >
            <div className="flex items-center justify-between mb-[4px]">
              <p className="font-manrope font-medium text-[13px] text-white truncate mr-[8px]">{t.subject}</p>
              <span className={`shrink-0 text-[10px] font-semibold px-[6px] py-[2px] rounded-[6px] ${statusColors[t.status]}`}>
                {statusLabels[t.status]}
              </span>
            </div>
            <p className="font-manrope text-[11px] text-[rgba(255,255,255,0.25)]">{formatDate(t.updatedAt)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

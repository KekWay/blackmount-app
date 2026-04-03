'use client'

import { Plus } from 'lucide-react'
import type { SupportTicket, TicketStatus } from '@/stores/support-store'

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

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`
}

export function SupportTicketList({ tickets, activeId, onSelect, onNew }: SupportTicketListProps) {
  const sorted = [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[rgba(255,255,255,0.06)]">
        <p className="font-manrope font-semibold text-[15px] text-white">Обращения</p>
        <button
          onClick={onNew}
          className="size-[32px] rounded-[10px] bg-[rgba(136,138,229,0.12)] hover:bg-[rgba(136,138,229,0.2)] flex items-center justify-center cursor-pointer transition-colors"
        >
          <Plus size={16} className="text-[#888ae5]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
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

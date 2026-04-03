'use client'

import { useRef, useEffect, useState } from 'react'
import { Send, Lock, ArrowLeft } from 'lucide-react'
import type { SupportTicket } from '@/stores/support-store'
import { useSupportStore } from '@/stores/support-store'

interface SupportChatProps {
  ticket: SupportTicket
  onBack?: () => void
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function SupportChat({ ticket, onBack }: SupportChatProps) {
  const [input, setInput] = useState('')
  const sendMessage = useSupportStore((s) => s.sendMessage)
  const closeTicket = useSupportStore((s) => s.closeTicket)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isClosed = ticket.status === 'closed'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket.messages.length])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isClosed) return
    sendMessage(ticket.id, text)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-[10px] px-[16px] py-[12px] border-b border-[rgba(255,255,255,0.06)]">
        {onBack && (
          <button onClick={onBack} className="size-[32px] rounded-[10px] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer transition-colors">
            <ArrowLeft size={18} className="text-white/50" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-manrope font-semibold text-[14px] text-white truncate">{ticket.subject}</p>
        </div>
        {!isClosed && (
          <button
            onClick={() => closeTicket(ticket.id)}
            className="text-[12px] text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.5)] font-medium cursor-pointer transition-colors px-[10px] py-[5px] rounded-[8px] hover:bg-[rgba(255,255,255,0.04)]"
          >
            Закрыть
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-[16px] py-[16px] flex flex-col gap-[10px]">
        {ticket.messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-[14px] px-[14px] py-[10px] ${
                m.sender === 'user' ? 'bg-[rgba(136,138,229,0.15)]' : 'bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              <p className="font-manrope text-[13px] text-white leading-[20px] whitespace-pre-wrap">{m.text}</p>
              <p className="font-manrope text-[10px] text-[rgba(255,255,255,0.2)] mt-[4px] text-right">{formatTime(m.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-[16px] pb-[16px] pt-[8px]">
        {isClosed ? (
          <div className="flex items-center justify-center gap-[6px] h-[46px] rounded-[14px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
            <Lock size={14} className="text-[rgba(255,255,255,0.2)]" />
            <span className="text-[13px] text-[rgba(255,255,255,0.25)] font-medium">Обращение закрыто</span>
          </div>
        ) : (
          <div className="flex items-center gap-[8px] bg-[rgba(61,57,80,0.5)] border border-[rgba(40,40,40,0.7)] rounded-[14px] px-[14px] py-[10px]">
            <input
              className="flex-1 bg-transparent outline-none font-manrope text-[13px] text-white placeholder:text-[rgba(255,255,255,0.2)]"
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="size-[32px] rounded-[10px] bg-[#888ae5] hover:brightness-110 flex items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:cursor-default shrink-0"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

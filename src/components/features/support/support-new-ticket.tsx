'use client'

import { useState } from 'react'
import { APP_ASSETS } from '@/lib/assets'
import { useSupportStore, type TicketCategory } from '@/stores/support-store'

interface SupportNewTicketProps {
  onCreated: (ticketId: string) => void
  onBack: () => void
}

const categories: { key: TicketCategory; label: string }[] = [
  { key: 'general', label: 'Общий вопрос' },
  { key: 'payment', label: 'Проблема с оплатой' },
  { key: 'withdraw', label: 'Вывод средств' },
  { key: 'technical', label: 'Техническая проблема' },
]

export function SupportNewTicket({ onCreated, onBack }: SupportNewTicketProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState<TicketCategory>('general')
  const createTicket = useSupportStore((s) => s.createTicket)

  const canSubmit = subject.trim().length > 0 && message.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const id = createTicket(subject.trim(), message.trim(), category)
    onCreated(id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-[10px] px-[16px] py-[12px]">
        <button onClick={onBack} className="size-[32px] rounded-[10px] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center cursor-pointer transition-colors">
          <img src={APP_ASSETS.arrowIcon} alt="" className="size-[18px] object-contain brightness-0 invert opacity-50" />
        </button>
        <p className="font-manrope font-semibold text-[15px] text-white">Новое обращение</p>
      </div>

      <div className="flex-1 overflow-y-auto px-[16px] py-[20px] flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-manrope text-[12px] text-[rgba(255,255,255,0.35)] font-medium">Категория</label>
          <div className="flex flex-wrap gap-[8px]">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`h-[35.5px] rounded-[12px] px-[18px] font-manrope font-medium text-[13px] transition-colors cursor-pointer ${
                  category === c.key
                    ? 'bg-[#39375b] text-white'
                    : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-manrope text-[12px] text-[rgba(255,255,255,0.35)] font-medium">Тема</label>
          <input
            className="bg-[rgba(61,57,80,0.5)] border border-[rgba(40,40,40,0.7)] rounded-[12px] px-[14px] py-[10px] font-manrope text-[13px] text-white outline-none placeholder:text-[rgba(255,255,255,0.2)]"
            placeholder="Кратко опишите проблему"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="font-manrope text-[12px] text-[rgba(255,255,255,0.35)] font-medium">Сообщение</label>
          <textarea
            className="bg-[rgba(61,57,80,0.5)] border border-[rgba(40,40,40,0.7)] rounded-[12px] px-[14px] py-[10px] font-manrope text-[13px] text-white outline-none resize-none placeholder:text-[rgba(255,255,255,0.2)] min-h-[120px]"
            placeholder="Подробно опишите вашу проблему или вопрос"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="px-[16px] pb-[16px] pt-[8px]">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-[46px] rounded-[12px] cursor-pointer transition-all flex items-center justify-center gap-[8px] hover:brightness-110 active:scale-[0.98] disabled:opacity-30 disabled:cursor-default"
          style={{ background: '#888ae5', boxShadow: '0 2px 12px rgba(136,138,229,0.3)' }}
        >
          <img src={APP_ASSETS.sendIcon} alt="" className="size-[15px] object-contain brightness-0 invert" />
          <span className="text-[14px] text-white font-bold">Отправить</span>
        </button>
      </div>
    </div>
  )
}

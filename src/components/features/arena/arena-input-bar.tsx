'use client'

import { useRef, useEffect } from 'react'
import { IMG_COIN } from './arena-data'

interface Props {
  prompt: string
  totalCost: number
  canSend: boolean
  onPromptChange: (v: string) => void
  onSend: () => void
}

export function ArenaInputBar({ prompt, totalCost, canSend, onPromptChange, onSend }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendLockRef = useRef(false)
  const handleSendClick = () => {
    if (sendLockRef.current) return
    sendLockRef.current = true
    onSend()
    setTimeout(() => { sendLockRef.current = false }, 1000)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [prompt])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendClick() }
  }

  return (
    <div className="flex justify-center pb-[16px] md:pb-[28px] px-[16px] md:px-[24px] lg:px-[40px] shrink-0 sticky bottom-0 relative z-[20] bg-gradient-to-t from-[#121118] via-[#121118] to-transparent pt-[12px]">
      <div className="w-full max-w-[620px] flex flex-col gap-[6px]">
        <div className="bg-[rgba(61,57,80,0.5)] ring-1 ring-[rgba(255,255,255,0.05)] rounded-[30px] w-full flex flex-col relative shadow-lg">
          <textarea
            ref={textareaRef}
            className="bg-transparent resize-none outline-none leading-[22px] text-[14px] text-white placeholder-[#898787] px-[26px] pt-[18px] pb-[6px] w-full chat-scrollbar"
            placeholder="Напишите запрос для сравнения моделей"
            rows={1}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: 44, maxHeight: 120 }}
          />
          <div className="flex items-center justify-between px-[22px] pb-[14px] relative z-[1]">
            <div className="flex items-center gap-[8px]">
              <span className="leading-[22px] text-[15px] text-[#d5d4d4] font-extrabold">{totalCost || 0}</span>
              <div className="relative size-[14px]">
                <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
              </div>
            </div>
            <div className="flex items-center gap-[6px]">
              {canSend ? (
                <button onClick={handleSendClick} className="size-[28px] rounded-full bg-[#888ae5] hover:bg-[#9a9cf0] flex items-center justify-center cursor-pointer transition-colors" title="Отправить">
                  <img src="/assets/models/arrow_up.png" alt="" className="size-[11px] object-contain brightness-0 invert" />
                </button>
              ) : (
                <div className="size-[28px] rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                  <img src="/assets/models/arrow_up.png" alt="" className="size-[11px] object-contain brightness-0 invert opacity-15" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

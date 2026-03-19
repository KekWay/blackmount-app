'use client'

import { useRef, useEffect, useState } from 'react'
import { ArrowUp, StopCircle } from 'lucide-react'

const PLACEHOLDER_TEXTS = [
  'Напишите запрос...',
  'Опишите что хотите создать...',
  'Задайте вопрос нейросети...',
  'Сгенерируйте изображение или текст...',
  'Спросите о чём угодно...',
]

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onStop?: () => void
  isGenerating: boolean
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, onStop, isGenerating, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_TEXTS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="w-full max-w-[620px] mx-auto px-6 lg:px-10 pb-7 shrink-0 relative z-20">
      <div className="bg-[rgba(61,57,80,0.5)] border border-[rgba(40,40,40,0.7)] rounded-[30px] w-full flex flex-col">
        <textarea
          ref={textareaRef}
          className="bg-transparent resize-none outline-none text-sm text-white px-6 pt-[18px] pb-1.5 w-full placeholder:text-white/30"
          placeholder={disabled ? 'Модель доступна по подписке PRO' : PLACEHOLDER_TEXTS[placeholderIdx]}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-end px-5 pb-3.5">
          {isGenerating ? (
            <button
              onClick={onStop}
              className="size-9 rounded-full bg-red-500/20 flex items-center justify-center cursor-pointer hover:bg-red-500/30 transition-colors"
              aria-label="Остановить"
            >
              <StopCircle size={18} className="text-red-400" />
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="size-9 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Отправить"
            >
              <ArrowUp size={18} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

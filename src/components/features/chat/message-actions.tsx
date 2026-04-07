'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Copy } from 'lucide-react'

interface MessageActionsProps {
  content: string
  onRetry?: () => void
}

export function MessageActions({ content, onRetry }: MessageActionsProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1 mt-1.5">
      <button onClick={handleCopy} title={copied ? 'Скопировано' : 'Копировать'} className="group flex items-center px-1.5 py-1 rounded-lg text-[11px] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"><Copy size={11} /></button>
      <button onClick={() => setRating((r) => (r === 'up' ? null : 'up'))} title="Нравится" className={`group flex items-center px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${rating === 'up' ? 'bg-green-400/[0.08]' : 'hover:bg-white/[0.06]'}`}><Image src="/icons/like_icon.png" alt="" width={11} height={11} className={`transition-all duration-200 ${rating === 'up' ? '[filter:brightness(0)_saturate(100%)_invert(73%)_sepia(57%)_saturate(497%)_hue-rotate(93deg)_brightness(98%)_contrast(92%)]' : 'brightness-0 invert opacity-30 group-hover:opacity-100'}`} /></button>
      <button onClick={() => setRating((r) => (r === 'down' ? null : 'down'))} title="Не нравится" className={`group flex items-center px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${rating === 'down' ? 'bg-red-400/[0.08]' : 'hover:bg-white/[0.06]'}`}><Image src="/icons/dislike_icon.png" alt="" width={11} height={11} className={`transition-all duration-200 ${rating === 'down' ? '[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]' : 'brightness-0 invert opacity-30 group-hover:opacity-100'}`} /></button>
      <button title="Поделиться" className="group flex items-center px-1.5 py-1 rounded-lg text-[11px] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"><Image src="/icons/share_2.png" alt="" width={11} height={11} className="opacity-30 group-hover:opacity-100 transition-opacity duration-200" /></button>
      {onRetry && (
        <button onClick={onRetry} title="Ещё раз" className="group flex items-center px-1.5 py-1 rounded-lg text-[11px] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"><Image src="/icons/redo_icon.png" alt="" width={11} height={11} className="brightness-0 invert opacity-30 group-hover:opacity-100 transition-opacity duration-200" /></button>
      )}
    </div>
  )
}

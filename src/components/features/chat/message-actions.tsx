'use client'

import { useState } from 'react'
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Share2 } from 'lucide-react'

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
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
      >
        <Copy size={11} />
        {copied ? 'Скопировано' : 'Копировать'}
      </button>
      <button
        onClick={() => setRating((r) => (r === 'up' ? null : 'up'))}
        className={`flex items-center px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
          rating === 'up'
            ? 'text-green-400 bg-green-400/[0.08]'
            : 'text-white/30 hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        <ThumbsUp size={11} />
      </button>
      <button
        onClick={() => setRating((r) => (r === 'down' ? null : 'down'))}
        className={`flex items-center px-1.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
          rating === 'down'
            ? 'text-red-400 bg-red-400/[0.08]'
            : 'text-white/30 hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        <ThumbsDown size={11} />
      </button>
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
      >
        <Share2 size={11} /> Поделиться
      </button>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <RotateCcw size={11} /> Ещё раз
        </button>
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/types'
import { MessageBubble } from './message-bubble'

interface MessageListProps {
  messages: Message[]
  modelId: string
  modelName: string
  onRetry?: (messageIndex: number) => void
}

export function MessageList({ messages, modelId, modelName, onRetry }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="w-full max-w-[620px] flex flex-col gap-4 py-5 mx-auto px-6 lg:px-10">
      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          message={msg}
          modelId={modelId}
          modelName={modelName}
          onRetry={
            msg.role === 'assistant' && onRetry
              ? () => onRetry(i)
              : undefined
          }
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

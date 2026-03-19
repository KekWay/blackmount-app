import Image from 'next/image'
import type { Message } from '@/types'
import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'
import { TypingIndicator } from './typing-indicator'
import { MessageActions } from './message-actions'
import { MediaPreview } from './media-preview'

interface MessageBubbleProps {
  message: Message
  modelId: string
  modelName: string
  onRetry?: () => void
}

export function MessageBubble({ message, modelId, modelName, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const assets = MODEL_ASSETS[modelId as ModelId]
  const logoSrc = assets
    ? 'colorLogo' in assets ? assets.colorLogo : null
    : null

  // Loading state — typing indicator
  if (message.isLoading && !message.mediaType) {
    return (
      <div className="flex justify-start">
        <div className="flex items-center gap-3">
          {logoSrc && (
            <Image src={logoSrc} alt={modelName} width={28} height={28} className="rounded-full shrink-0" />
          )}
          <TypingIndicator />
        </div>
      </div>
    )
  }

  // Loading state — media generating
  if (message.isLoading && message.mediaType) {
    return (
      <div className="flex justify-start">
        <div className="w-[300px] h-[300px] rounded-[20px] flex flex-col items-center justify-center bg-[#0e0d15] border border-white/5">
          {logoSrc && (
            <Image src={logoSrc} alt={modelName} width={32} height={32} className="opacity-50" />
          )}
          <p className="text-xs text-white/35 mt-3.5 animate-pulse">
            {message.mediaType === 'video' ? 'Генерация видео' : 'Генерация изображения'}
          </p>
        </div>
      </div>
    )
  }

  // Media result
  if (message.mediaSrc || message.mediaSrcs) {
    return (
      <div className="flex justify-start">
        <div>
          <MediaPreview
            type={message.mediaType ?? 'image'}
            src={message.mediaSrc ?? message.mediaSrcs?.[0] ?? ''}
            srcs={message.mediaSrcs}
          />
          <MessageActions content={message.content} />
        </div>
      </div>
    )
  }

  // Text message
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col">
        <div
          className={`max-w-[80%] rounded-[20px] px-5 py-3.5 ${
            isUser ? 'bg-[rgba(61,57,80,0.7)]' : 'bg-white/5'
          }`}
        >
          <p className="text-sm text-white whitespace-pre-wrap leading-[22px]">
            {message.content}
          </p>
        </div>
        {!isUser && !message.isLoading && !message.isTyping && (
          <MessageActions content={message.content} onRetry={onRetry} />
        )}
      </div>
    </div>
  )
}

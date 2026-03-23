'use client'

import type { Message, AIModel } from '@/types'
import { TextLoadingBubble, MediaLoadingBubble } from './chat-message-loading'
import { ChatMessageMedia } from './chat-message-media'
import { TypingBubble, TextBubble } from './chat-message-text'

interface ChatMessagesProps {
  messages: Message[]
  model: AIModel
  msgRatings: Record<number, 'up' | 'down'>
  setMsgRatings: React.Dispatch<React.SetStateAction<Record<number, 'up' | 'down'>>>
  setMsgShareIdx: (idx: number | null) => void
  setViewerMedia: (media: { type: 'image' | 'video'; src: string; srcs?: string[] } | null) => void
  setTypingIdx: (idx: number | null) => void
  setIsGenerating: (v: boolean) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setInput: (v: string) => void
}

export function ChatMessages({
  messages, model, msgRatings, setMsgRatings, setMsgShareIdx,
  setViewerMedia, setTypingIdx, setIsGenerating, setMessages, setInput,
}: ChatMessagesProps) {
  return (
    <div className="w-full max-w-[620px] flex flex-col gap-[16px] py-[20px] mx-auto px-[12px] md:px-[24px] lg:px-[40px]">
      {messages.map((msg, i) => (
        <div key={i} data-role={msg.role} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.isLoading && !msg.mediaType ? (
            <TextLoadingBubble model={model} />
          ) : msg.isLoading && msg.mediaType ? (
            <MediaLoadingBubble msg={msg} model={model} />
          ) : (msg.mediaSrc || msg.mediaSrcs) ? (
            <ChatMessageMedia
              msg={msg}
              index={i}
              msgRatings={msgRatings}
              setMsgRatings={setMsgRatings}
              setMsgShareIdx={setMsgShareIdx}
              setViewerMedia={setViewerMedia}
            />
          ) : msg.isTyping ? (
            <TypingBubble
              msg={msg}
              index={i}
              setTypingIdx={setTypingIdx}
              setIsGenerating={setIsGenerating}
              setMessages={setMessages}
            />
          ) : (
            <TextBubble
              msg={msg}
              index={i}
              messages={messages}
              msgRatings={msgRatings}
              setMsgRatings={setMsgRatings}
              setMsgShareIdx={setMsgShareIdx}
              setInput={setInput}
            />
          )}
        </div>
      ))}
    </div>
  )
}

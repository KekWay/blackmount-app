'use client'

import { motion } from 'motion/react'
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import { TypewriterText } from './typewriter-text'
import type { Message } from '@/types'

const imgShareMask = '/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png'

function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgShareMask}')`, WebkitMaskImage: `url('${imgShareMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

interface ChatMessageTextProps {
  msg: Message
  index: number
  messages: Message[]
  msgRatings: Record<number, 'up' | 'down'>
  setMsgRatings: React.Dispatch<React.SetStateAction<Record<number, 'up' | 'down'>>>
  setMsgShareIdx: (idx: number | null) => void
  setTypingIdx: (idx: number | null) => void
  setIsGenerating: (v: boolean) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setInput: (v: string) => void
}

export function TypingBubble({
  msg, index, setTypingIdx, setIsGenerating, setMessages,
}: Pick<ChatMessageTextProps, 'msg' | 'index' | 'setTypingIdx' | 'setIsGenerating' | 'setMessages'>) {
  return (
    <motion.div
      className="max-w-[80%] rounded-[20px] px-[20px] py-[14px] bg-[rgba(255,255,255,0.05)]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TypewriterText
        text={msg.content}
        onComplete={() => {
          setTypingIdx(null)
          setIsGenerating(false)
          setMessages((prev) =>
            prev.map((m, idx) => idx === index ? { ...m, isTyping: false } : m)
          )
        }}
      />
    </motion.div>
  )
}

export function TextBubble({
  msg, index, messages, msgRatings, setMsgRatings, setMsgShareIdx, setInput,
}: Omit<ChatMessageTextProps, 'setTypingIdx' | 'setIsGenerating' | 'setMessages'>) {
  return (
    <div className="flex flex-col">
      <div className={`max-w-[80%] rounded-[20px] px-[20px] py-[14px] ${msg.role === 'user' ? 'bg-[rgba(61,57,80,0.7)]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
        <p className="font-manrope font-normal leading-[22px] text-[14px] text-white whitespace-pre-wrap">{msg.content}</p>
      </div>
      {msg.role === 'assistant' && !msg.isLoading && !msg.isTyping && (
        <div className="flex items-center gap-[4px] mt-[6px]">
          <button onClick={() => { navigator.clipboard.writeText(msg.content) }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Copy size={11} /> Копировать</button>
          <button onClick={() => setMsgRatings(p => ({ ...p, [index]: p[index] === 'up' ? undefined as never : 'up' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[index] === 'up' ? 'text-[#4ade80] bg-[rgba(74,222,128,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsUp size={11} /></button>
          <button onClick={() => setMsgRatings(p => ({ ...p, [index]: p[index] === 'down' ? undefined as never : 'down' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[index] === 'down' ? 'text-[#f87171] bg-[rgba(248,113,113,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsDown size={11} /></button>
          <button onClick={() => setMsgShareIdx(index)} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><ShareIcon size={11} /> Поделиться</button>
          <button onClick={() => { setInput(messages[index - 1]?.content || '') }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><RotateCcw size={11} /> Ещё раз</button>
        </div>
      )}
    </div>
  )
}

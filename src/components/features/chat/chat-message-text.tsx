'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { CustomIcon } from '@/components/shared/custom-icon'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'
import { TypewriterText } from './typewriter-text'
import type { Message } from '@/types'

const imgShareMask = '/assets/models/share-mask.png'

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
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content).catch(() => {})
    toast.success('Скопировано в буфер обмена')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex flex-col">
      <div className={`max-w-[80%] rounded-[20px] px-[20px] py-[14px] ${msg.role === 'user' ? 'bg-[rgba(61,57,80,0.7)]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
        {msg.role === 'assistant' ? (
          <MarkdownRenderer content={msg.content} />
        ) : (
          <p className="font-manrope font-normal leading-[22px] text-[14px] text-white whitespace-pre-wrap">{msg.content}</p>
        )}
      </div>
      {msg.role === 'assistant' && !msg.isLoading && !msg.isTyping && (
        <div className="flex items-center gap-[4px] mt-[6px]">
          <button onClick={handleCopy} title={copied ? 'Скопировано' : 'Копировать'} className="group flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer">{copied ? <Check size={11} className="text-[#888ae5]" /> : <CustomIcon src="/icons/copy_icon.png" size={11} className="opacity-30 group-hover:opacity-100 transition-opacity duration-200" />}</button>
          <button onClick={() => setMsgRatings(p => { const next = { ...p }; if (next[index] === 'up') delete next[index]; else next[index] = 'up'; return next })} title="Нравится" className={`group flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[index] === 'up' ? 'bg-[rgba(74,222,128,0.08)]' : 'hover:bg-[rgba(255,255,255,0.06)]'}`}><Image src="/icons/like_icon.png" alt="" width={11} height={11} className={`transition-all duration-200 ${msgRatings[index] === 'up' ? '[filter:brightness(0)_saturate(100%)_invert(73%)_sepia(57%)_saturate(497%)_hue-rotate(93deg)_brightness(98%)_contrast(92%)]' : 'brightness-0 invert opacity-30 group-hover:opacity-100'}`} /></button>
          <button onClick={() => setMsgRatings(p => { const next = { ...p }; if (next[index] === 'down') delete next[index]; else next[index] = 'down'; return next })} title="Не нравится" className={`group flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[index] === 'down' ? 'bg-[rgba(248,113,113,0.08)]' : 'hover:bg-[rgba(255,255,255,0.06)]'}`}><Image src="/icons/dislike_icon.png" alt="" width={11} height={11} className={`transition-all duration-200 ${msgRatings[index] === 'down' ? '[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]' : 'brightness-0 invert opacity-30 group-hover:opacity-100'}`} /></button>
          <button onClick={() => setMsgShareIdx(index)} title="Поделиться" className="group flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><ShareIcon size={11} /></button>
          <button onClick={() => { const blob = new Blob([msg.content], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'response.md'; a.click(); URL.revokeObjectURL(url) }} title="Скачать" className="group flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Image src="/icons/dowland_icon.png" alt="" width={11} height={11} className="brightness-0 invert opacity-30 group-hover:opacity-100 transition-opacity duration-200" /></button>
          <button onClick={() => { setInput(messages[index - 1]?.content || '') }} title="Ещё раз" className="group flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Image src="/icons/redo_icon.png" alt="" width={11} height={11} className="brightness-0 invert opacity-30 group-hover:opacity-100 transition-opacity duration-200" /></button>
        </div>
      )}
    </div>
  )
}

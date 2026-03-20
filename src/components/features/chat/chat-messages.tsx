'use client'

import { motion } from 'motion/react'
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Download, Play } from 'lucide-react'
import { ModelIconWhite } from '@/components/shared/model-icon'
import { TypewriterText } from './typewriter-text'
import type { Message, AIModel } from '@/types'

const imgShareMask = '/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png'

function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgShareMask}')`, WebkitMaskImage: `url('${imgShareMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

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
    <div className="w-full max-w-[620px] flex flex-col gap-[16px] py-[20px] mx-auto px-[40px]">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.isLoading && !msg.mediaType ? (
            <motion.div
              className="flex items-center gap-[14px] py-[14px] px-[20px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative shrink-0">
                <ModelIconWhite modelId={model.id} size={28} />
              </div>
              <div className="flex gap-[6px] items-center">
                {[0, 1, 2].map((d) => (
                  <motion.div
                    key={d}
                    className="size-[6px] rounded-full bg-white/40"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>
          ) : msg.isLoading && msg.mediaType ? (
            <motion.div
              className="rounded-[20px] overflow-hidden"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', damping: 20 }}
            >
              <div className="w-[300px] h-[300px] rounded-[20px] flex flex-col items-center justify-center relative bg-[#0e0d15]">
                <div
                  className="absolute inset-[-3px] rounded-[23px]"
                  style={{
                    '--media-angle': '0deg',
                    background: `conic-gradient(from var(--media-angle), transparent 0%, transparent 65%, ${hexToRgba(model.glowColors[0] || '#888ae5', 0.06)} 72%, ${hexToRgba(model.glowColors[0] || '#888ae5', 0.3)} 79%, ${hexToRgba(model.glowColors[1] || model.glowColors[0] || '#888ae5', 0.6)} 85%, ${hexToRgba(model.glowColors[0] || '#888ae5', 0.3)} 91%, ${hexToRgba(model.glowColors[0] || '#888ae5', 0.06)} 96%, transparent 100%)`,
                    animation: 'mediaSpinSmooth 3s linear infinite',
                  } as React.CSSProperties}
                />
                <div
                  className="absolute inset-[-6px] rounded-[26px]"
                  style={{
                    '--media-angle': '0deg',
                    background: `conic-gradient(from var(--media-angle), transparent 0%, transparent 68%, ${hexToRgba(model.glowColors[0] || '#888ae5', 0.12)} 82%, transparent 96%, transparent 100%)`,
                    animation: 'mediaSpinSmooth 3s linear infinite',
                    filter: 'blur(6px)',
                  } as React.CSSProperties}
                />
                <div className="absolute inset-[2px] bg-[#0e0d15] rounded-[18px]" />
                <div className="relative z-[3]">
                  <ModelIconWhite modelId={model.id} size={32} />
                </div>
                <motion.p
                  className="text-[12px] text-[rgba(255,255,255,0.35)] mt-[14px] relative z-[3]"
                  animate={{ opacity: [0.35, 0.6, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {msg.mediaType === 'video' ? 'Генерация видео' : 'Генерация изображения'}
                </motion.p>
              </div>
            </motion.div>
          ) : (msg.mediaSrc || msg.mediaSrcs) ? (
            <motion.div
              className="rounded-[16px] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', damping: 20 }}
            >
              {msg.mediaSrcs && msg.mediaSrcs.length > 1 ? (
                <div className={`grid gap-[6px] ${msg.mediaSrcs.length === 2 ? 'grid-cols-2' : msg.mediaSrcs.length === 3 ? 'grid-cols-2' : 'grid-cols-2'}`} style={{ width: msg.mediaSrcs.length >= 2 ? 420 : 320 }}>
                  {msg.mediaSrcs.map((src, imgIdx) => (
                    <motion.div
                      key={imgIdx}
                      className="relative rounded-[12px] overflow-hidden aspect-square cursor-pointer"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: imgIdx * 0.1 }}
                      onClick={() => setViewerMedia({ type: 'image', src, srcs: msg.mediaSrcs })}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-[6px] left-[6px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[4px] rounded-[6px] px-[6px] py-[2px]">
                        <span className="text-[10px] text-white font-semibold">{imgIdx + 1}/{msg.mediaSrcs!.length}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); const a = document.createElement('a'); a.href = src; a.download = `blackmount-image-${Date.now()}-${imgIdx + 1}.png`; a.click() }}
                        className="absolute bottom-[6px] right-[6px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[4px] rounded-[8px] size-[28px] flex items-center justify-center cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition-colors"
                      >
                        <Download size={12} className="text-white" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="relative cursor-pointer" onClick={() => setViewerMedia({ type: msg.mediaType || 'image', src: msg.mediaSrc || msg.mediaSrcs?.[0] || '' })}>
                  <img src={msg.mediaSrc || msg.mediaSrcs?.[0]} alt="" className="size-[320px] object-cover rounded-[16px]" />
                  {msg.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[rgba(0,0,0,0.45)] rounded-full size-[48px] flex items-center justify-center backdrop-blur-[6px] border border-[rgba(255,255,255,0.1)]">
                        <Play size={20} className="text-white ml-[2px]" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-[4px] mt-[8px]">
                <button onClick={() => { navigator.clipboard.writeText(msg.content) }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Copy size={11} /> Копировать</button>
                <button onClick={() => setMsgShareIdx(i)} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><ShareIcon size={11} /> Поделиться</button>
                <button onClick={() => setMsgRatings(p => ({ ...p, [i]: p[i] === 'up' ? undefined as never : 'up' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[i] === 'up' ? 'text-[#4ade80] bg-[rgba(74,222,128,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsUp size={11} /></button>
                <button onClick={() => setMsgRatings(p => ({ ...p, [i]: p[i] === 'down' ? undefined as never : 'down' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[i] === 'down' ? 'text-[#f87171] bg-[rgba(248,113,113,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsDown size={11} /></button>
                <button onClick={() => { const a = document.createElement('a'); a.href = msg.mediaSrc || (msg.mediaSrcs?.[0] ?? ''); a.download = `blackmount-${msg.mediaType}-${Date.now()}.png`; a.click() }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Download size={11} /> Сохранить</button>
              </div>
            </motion.div>
          ) : msg.isTyping ? (
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
                    prev.map((m, idx) => idx === i ? { ...m, isTyping: false } : m)
                  )
                }}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col">
              <div className={`max-w-[80%] rounded-[20px] px-[20px] py-[14px] ${msg.role === 'user' ? 'bg-[rgba(61,57,80,0.7)]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
                <p className="font-manrope font-normal leading-[22px] text-[14px] text-white whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'assistant' && !msg.isLoading && !msg.isTyping && (
                <div className="flex items-center gap-[4px] mt-[6px]">
                  <button onClick={() => { navigator.clipboard.writeText(msg.content) }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Copy size={11} /> Копировать</button>
                  <button onClick={() => setMsgRatings(p => ({ ...p, [i]: p[i] === 'up' ? undefined as never : 'up' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[i] === 'up' ? 'text-[#4ade80] bg-[rgba(74,222,128,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsUp size={11} /></button>
                  <button onClick={() => setMsgRatings(p => ({ ...p, [i]: p[i] === 'down' ? undefined as never : 'down' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[i] === 'down' ? 'text-[#f87171] bg-[rgba(248,113,113,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsDown size={11} /></button>
                  <button onClick={() => setMsgShareIdx(i)} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><ShareIcon size={11} /> Поделиться</button>
                  <button onClick={() => { setInput(messages[i - 1]?.content || '') }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><RotateCcw size={11} /> Ещё раз</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

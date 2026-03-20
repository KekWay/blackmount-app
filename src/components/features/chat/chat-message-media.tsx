'use client'

import { motion } from 'motion/react'
import { Copy, ThumbsUp, ThumbsDown, Download, Play } from 'lucide-react'
import type { Message } from '@/types'

const imgShareMask = '/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png'

function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgShareMask}')`, WebkitMaskImage: `url('${imgShareMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

interface ChatMessageMediaProps {
  msg: Message
  index: number
  msgRatings: Record<number, 'up' | 'down'>
  setMsgRatings: React.Dispatch<React.SetStateAction<Record<number, 'up' | 'down'>>>
  setMsgShareIdx: (idx: number | null) => void
  setViewerMedia: (media: { type: 'image' | 'video'; src: string; srcs?: string[] } | null) => void
}

export function ChatMessageMedia({
  msg, index, msgRatings, setMsgRatings, setMsgShareIdx, setViewerMedia,
}: ChatMessageMediaProps) {
  return (
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
        <button onClick={() => setMsgShareIdx(index)} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><ShareIcon size={11} /> Поделиться</button>
        <button onClick={() => setMsgRatings(p => ({ ...p, [index]: p[index] === 'up' ? undefined as never : 'up' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[index] === 'up' ? 'text-[#4ade80] bg-[rgba(74,222,128,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsUp size={11} /></button>
        <button onClick={() => setMsgRatings(p => ({ ...p, [index]: p[index] === 'down' ? undefined as never : 'down' }))} className={`flex items-center px-[6px] py-[4px] rounded-[8px] text-[11px] transition-all cursor-pointer ${msgRatings[index] === 'down' ? 'text-[#f87171] bg-[rgba(248,113,113,0.08)]' : 'text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}><ThumbsDown size={11} /></button>
        <button onClick={() => { const a = document.createElement('a'); a.href = msg.mediaSrc || (msg.mediaSrcs?.[0] ?? ''); a.download = `blackmount-${msg.mediaType}-${Date.now()}.png`; a.click() }} className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] text-[11px] text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"><Download size={11} /> Сохранить</button>
      </div>
    </motion.div>
  )
}

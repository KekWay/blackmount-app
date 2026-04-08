'use client'

import { motion } from 'motion/react'
import { ModelIconWhite } from '@/components/shared/model-icon'
import { hexToRgba } from './chat-constants'
import type { Message, AIModel } from '@/types'

interface TextLoadingProps {
  model: AIModel
}

export function TextLoadingBubble({ model }: TextLoadingProps) {
  return (
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
  )
}

interface MediaLoadingProps {
  msg: Message
  model: AIModel
}

export function MediaLoadingBubble({ msg, model }: MediaLoadingProps) {
  return (
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
  )
}

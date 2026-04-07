'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

interface LightboxImageProps {
  srcs: string[]
}

export function LightboxImage({ srcs }: LightboxImageProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const isMulti = srcs.length > 1

  return (
    <div className="relative">
      <img
        src={srcs[currentIdx]}
        alt=""
        className="max-w-[85vw] max-h-[80vh] object-contain rounded-[12px]"
      />
      {isMulti && (
        <>
          {currentIdx > 0 && (
            <motion.button
              onClick={() => setCurrentIdx(i => i - 1)}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[40px] rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] flex items-center justify-center cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition-colors border border-[rgba(255,255,255,0.1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronDown size={20} className="text-white rotate-90" />
            </motion.button>
          )}
          {currentIdx < srcs.length - 1 && (
            <motion.button
              onClick={() => setCurrentIdx(i => i + 1)}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 size-[40px] rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] flex items-center justify-center cursor-pointer hover:bg-[rgba(0,0,0,0.7)] transition-colors border border-[rgba(255,255,255,0.1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronDown size={20} className="text-white -rotate-90" />
            </motion.button>
          )}
          <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 bg-[rgba(0,0,0,0.6)] backdrop-blur-[6px] rounded-full px-[12px] py-[4px] flex items-center gap-[8px]">
            {srcs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`size-[8px] rounded-full transition-all cursor-pointer ${idx === currentIdx ? 'bg-white scale-110' : 'bg-[rgba(255,255,255,0.35)] hover:bg-[rgba(255,255,255,0.6)]'}`}
              />
            ))}
          </div>
        </>
      )}
      <button
        onClick={() => { const a = document.createElement('a'); a.href = srcs[currentIdx]; a.download = `blackmount-image-${Date.now()}.png`; a.click() }}
        className="group absolute top-[12px] right-[12px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] hover:bg-[rgba(0,0,0,0.7)] rounded-[10px] size-[36px] flex items-center justify-center cursor-pointer transition-colors border border-[rgba(255,255,255,0.1)]"
      >
        <Image src="/icons/dowland_icon.png" alt="" width={16} height={16} className="brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
    </div>
  )
}

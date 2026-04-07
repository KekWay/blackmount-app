'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { LightboxVideo } from './lightbox-video'
import { LightboxImage } from './lightbox-image'

interface ChatMediaLightboxProps {
  media: { type: 'image' | 'video'; src: string; srcs?: string[] }
  onClose: () => void
}

export function ChatMediaLightbox({ media, onClose }: ChatMediaLightboxProps) {
  const srcs = media.srcs && media.srcs.length > 1 ? media.srcs : [media.src]
  const isMulti = srcs.length > 1
  const isVideo = media.type === 'video'

  const [showControls, setShowControls] = useState(true)
  const [isPlaying] = useState(false)
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const resetControls = () => {
    setShowControls(true)
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ' && isVideo) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isVideo, isMulti, srcs.length, isPlaying, onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(0,0,0,0.85)] backdrop-blur-[8px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        onMouseMove={isVideo ? resetControls : undefined}
      >
        <motion.div
          className="relative max-w-[95vw] md:max-w-[90vw] max-h-[90vh] flex flex-col items-center"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="group absolute top-[-40px] right-0 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full size-[32px] flex items-center justify-center cursor-pointer transition-colors z-10">
            <Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {isVideo ? (
            <LightboxVideo src={media.src} showControls={showControls} />
          ) : (
            <LightboxImage srcs={srcs} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

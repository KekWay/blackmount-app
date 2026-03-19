'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronDown, Play, Download } from 'lucide-react'

interface ChatMediaLightboxProps {
  media: { type: 'image' | 'video'; src: string; srcs?: string[] }
  onClose: () => void
}

export function ChatMediaLightbox({ media, onClose }: ChatMediaLightboxProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const progressRef = useRef<HTMLDivElement>(null)

  const srcs = media.srcs && media.srcs.length > 1 ? media.srcs : [media.src]
  const isMulti = srcs.length > 1
  const isVideo = media.type === 'video'

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true) }
    else { videoRef.current.pause(); setIsPlaying(false) }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration || 8)
  }

  const seekTo = (e: React.MouseEvent) => {
    if (!progressRef.current || !videoRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    videoRef.current.currentTime = pct * duration
    setCurrentTime(pct * duration)
  }

  const resetControls = () => {
    setShowControls(true)
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    if (isPlaying) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && isMulti) setCurrentIdx(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight' && isMulti) setCurrentIdx(i => Math.min(srcs.length - 1, i + 1))
      if (e.key === ' ' && isVideo) { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isVideo, isMulti, srcs.length, isPlaying])

  // Suppress unused variable warnings — these are used by a real video element
  void handleTimeUpdate
  void handleLoadedMetadata

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(0,0,0,0.85)] backdrop-blur-[8px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        onMouseMove={isVideo ? resetControls : undefined}
      >
        <motion.div
          className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute top-[-40px] right-0 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full size-[32px] flex items-center justify-center cursor-pointer transition-colors z-10">
            <X size={16} className="text-white" />
          </button>

          {isVideo ? (
            <div className="relative rounded-[16px] overflow-hidden max-w-[80vw] max-h-[80vh]">
              <img src={media.src} alt="" className="max-w-[80vw] max-h-[75vh] object-contain" />
              <motion.div
                className="absolute inset-0 flex flex-col justify-end"
                initial={{ opacity: 1 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-[120px]" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    onClick={togglePlay}
                    className="size-[64px] rounded-full flex items-center justify-center cursor-pointer transition-colors bg-[rgba(0,0,0,0.5)] backdrop-blur-[8px] border border-[rgba(255,255,255,0.15)]"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <div className="flex gap-[4px]">
                        <div className="w-[4px] h-[18px] bg-white rounded-[1px]" />
                        <div className="w-[4px] h-[18px] bg-white rounded-[1px]" />
                      </div>
                    ) : (
                      <Play size={24} className="text-white ml-[3px]" fill="white" />
                    )}
                  </motion.button>
                </div>
                <div className="relative z-10 px-[16px] pb-[14px] flex flex-col gap-[8px]">
                  <div
                    ref={progressRef}
                    className="w-full h-[4px] bg-[rgba(255,255,255,0.2)] rounded-full cursor-pointer group/prog relative"
                    onClick={seekTo}
                  >
                    <div
                      className="h-full bg-[#888ae5] rounded-full relative transition-all"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    >
                      <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 size-[10px] rounded-full bg-white opacity-0 group-hover/prog:opacity-100 transition-opacity shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <button onClick={togglePlay} className="text-white cursor-pointer hover:opacity-80 transition-opacity">
                        {isPlaying ? (
                          <div className="flex gap-[3px]">
                            <div className="w-[3px] h-[14px] bg-white rounded-[1px]" />
                            <div className="w-[3px] h-[14px] bg-white rounded-[1px]" />
                          </div>
                        ) : (
                          <Play size={16} className="text-white" fill="white" />
                        )}
                      </button>
                      <span className="text-[12px] text-[rgba(255,255,255,0.7)] tabular-nums font-medium">
                        {formatTime(currentTime)} / {formatTime(duration || 8)}
                      </span>
                    </div>
                    <button
                      onClick={() => { const a = document.createElement('a'); a.href = media.src; a.download = `blackmount-video-${Date.now()}.mp4`; a.click() }}
                      className="text-white/60 hover:text-white cursor-pointer transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
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
                className="absolute top-[12px] right-[12px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[6px] hover:bg-[rgba(0,0,0,0.7)] rounded-[10px] size-[36px] flex items-center justify-center cursor-pointer transition-colors border border-[rgba(255,255,255,0.1)]"
              >
                <Download size={16} className="text-white" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

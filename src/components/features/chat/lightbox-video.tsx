'use client'

import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { Play, Download } from 'lucide-react'

interface LightboxVideoProps {
  src: string
  showControls: boolean
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function LightboxVideo({ src, showControls }: LightboxVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true) }
    else { videoRef.current.pause(); setIsPlaying(false) }
  }

  const seekTo = (e: React.MouseEvent) => {
    if (!progressRef.current || !videoRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    videoRef.current.currentTime = pct * duration
    setCurrentTime(pct * duration)
  }

  // Suppress unused var warnings for event handlers used by real video
  void setCurrentTime
  void setDuration

  return (
    <div className="relative rounded-[16px] overflow-hidden max-w-[80vw] max-h-[80vh]">
      <img src={src} alt="" className="max-w-[80vw] max-h-[75vh] object-contain" />
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
              onClick={() => { const a = document.createElement('a'); a.href = src; a.download = `blackmount-video-${Date.now()}.mp4`; a.click() }}
              className="text-white/60 hover:text-white cursor-pointer transition-colors"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

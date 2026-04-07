'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface MediaViewerProps {
  type: 'image' | 'video'
  src: string
  srcs?: string[]
  onClose: () => void
}

function downloadFile(src: string, type: string) {
  const a = document.createElement('a')
  a.href = src
  a.download = `blackmount-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'png'}`
  a.click()
}

export function MediaViewer({ type, src, srcs, onClose }: MediaViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const images = srcs && srcs.length > 1 ? srcs : [src]
  const isMulti = images.length > 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && isMulti) setCurrentIdx((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight' && isMulti) setCurrentIdx((i) => Math.min(images.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMulti, images.length, onClose])

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="group absolute top-[-40px] right-0 bg-white/10 hover:bg-white/20 rounded-full size-8 flex items-center justify-center cursor-pointer transition-colors"
        >
          <Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        {type === 'video' ? (
          <div className="relative rounded-2xl overflow-hidden max-w-[80vw] max-h-[80vh]">
            <Image src={src} alt="" width={800} height={600} className="max-w-[80vw] max-h-[75vh] object-contain" unoptimized />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-16 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/15">
                <Play size={24} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Image src={images[currentIdx]} alt="" width={1080} height={1080} className="max-w-[85vw] max-h-[80vh] object-contain rounded-xl" unoptimized />
            {isMulti && currentIdx > 0 && (
              <button onClick={() => setCurrentIdx((i) => i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors border border-white/10">
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}
            {isMulti && currentIdx < images.length - 1 && (
              <button onClick={() => setCurrentIdx((i) => i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors border border-white/10">
                <ChevronRight size={20} className="text-white" />
              </button>
            )}
            {isMulti && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                {images.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentIdx(idx)} className={`size-2 rounded-full transition-all cursor-pointer ${idx === currentIdx ? 'bg-white scale-110' : 'bg-white/35 hover:bg-white/60'}`} />
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => downloadFile(type === 'video' ? src : images[currentIdx], type)}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm cursor-pointer transition-colors"
        >
          <Image src="/icons/dowland_icon.png" alt="" width={14} height={14} className="brightness-0 invert" /> Скачать
        </button>
      </div>
    </div>
  )
}

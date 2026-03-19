'use client'

import Image from 'next/image'
import { Download, Play, Maximize2 } from 'lucide-react'

interface MediaPreviewProps {
  type: 'image' | 'video'
  src: string
  srcs?: string[]
  onOpenFullscreen?: () => void
}

function downloadFile(src: string, type: string) {
  const a = document.createElement('a')
  a.href = src
  a.download = `blackmount-${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'png'}`
  a.click()
}

export function MediaPreview({ type, src, srcs, onOpenFullscreen }: MediaPreviewProps) {
  const images = srcs && srcs.length > 1 ? srcs : [src]
  const isMulti = images.length > 1

  if (isMulti) {
    return (
      <div className="grid grid-cols-2 gap-1.5" style={{ width: 420 }}>
        {images.map((imgSrc, idx) => (
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden aspect-square cursor-pointer group"
            onClick={onOpenFullscreen}
          >
            <Image src={imgSrc} alt="" fill className="object-cover" />
            <div className="absolute top-1.5 left-1.5 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5">
              <span className="text-[10px] text-white font-semibold">
                {idx + 1}/{images.length}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); downloadFile(imgSrc, 'image') }}
              className="absolute bottom-1.5 right-1.5 bg-black/50 backdrop-blur-sm rounded-lg size-7 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Download size={12} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative cursor-pointer group" onClick={onOpenFullscreen}>
      <Image
        src={src}
        alt=""
        width={320}
        height={320}
        className="rounded-2xl object-cover"
      />
      {type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/45 rounded-full size-12 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); downloadFile(src, type) }}
          className="bg-black/50 backdrop-blur-sm rounded-lg size-8 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <Download size={14} className="text-white" />
        </button>
        {onOpenFullscreen && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenFullscreen() }}
            className="bg-black/50 backdrop-blur-sm rounded-lg size-8 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <Maximize2 size={14} className="text-white" />
          </button>
        )}
      </div>
    </div>
  )
}

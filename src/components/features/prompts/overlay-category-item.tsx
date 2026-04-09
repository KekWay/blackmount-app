'use client'

import { useState } from 'react'
import type { PromptCategory } from './prompts-data'

function getHoverImage(cat: PromptCategory): string | null {
  if (cat.images.length === 0) return null
  return cat.images[Math.floor(Math.random() * cat.images.length)]
}

interface OverlayCategoryItemProps {
  cat: PromptCategory
  isActive: boolean
  onSelect: (id: string) => void
}

export function OverlayCategoryItem({ cat, isActive, onSelect }: OverlayCategoryItemProps) {
  const [hoverSrc, setHoverSrc] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  const onMouseEnter = () => {
    setHoverSrc(getHoverImage(cat))
    setImgError(false)
  }

  const showImage = hoverSrc && !imgError

  return (
    <button
      onMouseEnter={onMouseEnter}
      onClick={() => onSelect(cat.id)}
      className={`group relative text-left rounded-lg p-3 overflow-hidden transition-colors cursor-pointer ${
        isActive ? 'bg-white/10 ring-1 ring-white/20' : ''
      }`}
    >
      {showImage && (
        <img
          src={hoverSrc}
          alt=""
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        />
      )}
      {!showImage && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${cat.accentColor}33 0%, transparent 70%)`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span className="relative z-10 text-sm font-medium text-white block">
        {cat.name}
      </span>
      <span className="relative z-10 text-xs text-white/50 mt-0.5 block">
        {cat.description}
      </span>
    </button>
  )
}

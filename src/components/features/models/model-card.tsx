'use client'

import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import type { AIModel } from '@/types'
import { MODEL_ASSETS } from '@/lib/assets'
import { isModelNew } from '@/data/ai-models'
import type { ModelId } from '@/lib/assets'

interface ModelCardProps {
  model: AIModel
  locked?: boolean
  onClick?: () => void
}

export function ModelCard({ model, locked, onClick }: ModelCardProps) {
  const assets = MODEL_ASSETS[model.id as ModelId]
  const logoSrc = assets
    ? 'logo' in assets
      ? (assets as { logo: string }).logo
      : 'maskImage' in assets
        ? (assets as { maskImage: string }).maskImage
        : (assets as { colorLogo: string }).colorLogo
    : null

  return (
    <button
      onClick={locked ? undefined : onClick}
      className="group relative h-[113px] w-[158px] rounded-[20px] overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 will-change-transform"
    >
      {/* Glow on hover */}
      <div
        className="absolute -inset-2 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${model.glowColors[0] ?? 'rgba(136,138,229,0.15)'}26, transparent 70%)`,
        }}
      />

      {/* Card body */}
      <div
        className={`relative size-full rounded-[20px] flex flex-col items-center justify-center gap-2 ${
          locked ? 'brightness-[0.6]' : ''
        }`}
        style={{ background: model.gradient }}
      >
        {logoSrc && (
          <Image
            src={logoSrc}
            alt={model.name}
            width={40}
            height={40}
            className="object-contain"
          />
        )}
        <span className="font-maven font-bold text-sm text-white drop-shadow-md">
          {model.name}
        </span>
      </div>

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 rounded-[20px] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[rgba(91,91,214,0.7)] to-[rgba(124,92,191,0.7)] shadow-[0_2px_8px_rgba(91,91,214,0.3)]">
            <Sparkles size={9} className="text-white" />
            <span className="font-semibold text-[9px] text-white">Подписка</span>
          </div>
        </div>
      )}

      {/* NEW badge */}
      {isModelNew(model) && !locked && (
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-br from-accent/90 to-[rgba(54,180,160,0.9)] shadow-[0_2px_8px_rgba(101,222,216,0.4)]">
          <span className="font-manrope text-[8px] text-white tracking-wider font-extrabold">
            NEW
          </span>
        </div>
      )}
    </button>
  )
}

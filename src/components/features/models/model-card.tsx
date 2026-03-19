'use client'

import { Sparkles } from 'lucide-react'
import type { AIModel } from '@/types'
import { isModelNew } from '@/data/ai-models'

const CARD_CONFIGS: Record<string, {
  whiteLogo: string
  logoStyle: React.CSSProperties
  logoSize: { w: number; h: number }
  textStyle: React.CSSProperties
  fontSize?: number
  useMask?: boolean
}> = {
  chatgpt: {
    whiteLogo: '/assets/models/876f00be72e92b592aa3ba2811a95ebda9f1bffe.png',
    logoStyle: { left: 16, top: 37 },
    logoSize: { w: 28, h: 28 },
    textStyle: { left: 52, top: 51 },
    useMask: true,
  },
  claude: {
    whiteLogo: '/assets/models/be562ae4a77434313994bd749c7d70c57defe30e.png',
    logoStyle: { left: 29, top: 43 },
    logoSize: { w: 28, h: 28 },
    textStyle: { left: 63, top: 50 },
  },
  gemini: {
    whiteLogo: '/assets/models/a755291aabbac793a93ec93f8895cd304da22fa6.png',
    logoStyle: { left: 10, top: 31 },
    logoSize: { w: 46, h: 58 },
    textStyle: { left: 58, top: 51 },
  },
  nanobanana: {
    whiteLogo: '/assets/models/e4164d5835b2d0292379d5cc43cd89624200875e.png',
    logoStyle: { left: 7, top: 43 },
    logoSize: { w: 28, h: 28 },
    textStyle: { left: 43, top: 52 },
    fontSize: 17,
  },
  flux: {
    whiteLogo: '/assets/models/2a08c8247eb8ff9ca7960267e118bd33a85fbaf9.png',
    logoStyle: { left: 25, top: 32 },
    logoSize: { w: 50, h: 50 },
    textStyle: { left: 71, top: 51 },
  },
  sora2: {
    whiteLogo: '/assets/models/608060ad652feef63d189ada2f7bee4e5de1ade7.png',
    logoStyle: { left: 28, top: 42 },
    logoSize: { w: 28, h: 28 },
    textStyle: { left: 64, top: 48 },
  },
  kling: {
    whiteLogo: '/assets/models/870622b36d40395068506055c2814966d24d175e.png',
    logoStyle: { left: 35, top: 42 },
    logoSize: { w: 28, h: 28 },
    textStyle: { left: 69, top: 50 },
  },
  veo31: {
    whiteLogo: '/assets/models/a755291aabbac793a93ec93f8895cd304da22fa6.png',
    logoStyle: { left: 11, top: 30 },
    logoSize: { w: 46, h: 58 },
    textStyle: { left: 60, top: 49 },
  },
}

interface ModelCardProps {
  model: AIModel
  locked?: boolean
  onClick?: () => void
}

export function ModelCard({ model, locked, onClick }: ModelCardProps) {
  const cfg = CARD_CONFIGS[model.id]

  return (
    <button
      onClick={locked ? undefined : onClick}
      className="group relative h-[113px] w-[158px] rounded-[20px] overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 will-change-transform"
    >
      <div
        className="absolute -inset-2 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${model.glowColors[0] ?? 'rgba(136,138,229,0.15)'}26, transparent 70%)`,
        }}
      />

      <div
        className={`relative size-full rounded-[20px] ${locked ? 'brightness-[0.6]' : ''}`}
        style={{ background: model.gradient, opacity: 0.65 }}
      />

      {cfg && (
        <>
          <img
            src={cfg.whiteLogo}
            alt=""
            className="absolute object-contain brightness-0 invert"
            style={{
              ...cfg.logoStyle,
              width: cfg.logoSize.w,
              height: cfg.logoSize.h,
              position: 'absolute',
            }}
          />
          <span
            className="absolute font-['Maven_Pro',sans-serif] font-extrabold text-white"
            style={{
              ...cfg.textStyle,
              fontSize: cfg.fontSize ?? 20,
              position: 'absolute',
            }}
          >
            {model.name}
          </span>
        </>
      )}

      {locked && (
        <div className="absolute inset-0 rounded-[20px] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[rgba(91,91,214,0.7)] to-[rgba(124,92,191,0.7)] shadow-[0_2px_8px_rgba(91,91,214,0.3)]">
            <Sparkles size={9} className="text-white" />
            <span className="font-semibold text-[9px] text-white">Подписка</span>
          </div>
        </div>
      )}

      {isModelNew(model) && !locked && (
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-br from-accent/90 to-[rgba(54,180,160,0.9)] shadow-[0_2px_8px_rgba(101,222,216,0.4)]">
          <span className="font-['Manrope',sans-serif] text-[8px] text-white tracking-wider font-extrabold">
            NEW
          </span>
        </div>
      )}
    </button>
  )
}

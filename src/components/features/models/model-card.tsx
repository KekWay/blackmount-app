'use client'

import { Sparkles } from 'lucide-react'
import type { AIModel } from '@/types'
import { isModelNew } from '@/data/ai-models'
import { CARD_CONFIGS, SVG_CARD_PATH } from './model-card-configs'

interface ModelCardProps {
  model: AIModel
  locked?: boolean
  onClick?: () => void
}

export function ModelCard({ model, locked, onClick }: ModelCardProps) {
  const cfg = CARD_CONFIGS[model.id]
  if (!cfg) return null

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

      {/* Background */}
      {cfg.bgType === 'svg' ? (
        <svg
          className="absolute block h-[113px] left-0 top-0 w-[158px]"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 158 113"
          aria-hidden="true"
        >
          <path
            d={SVG_CARD_PATH}
            fill={`url(#paint_${model.id})`}
            opacity={cfg.bgOpacity}
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={`paint_${model.id}`}
              x1="-1.40025e-07"
              x2="163.546"
              y1="-1.08207"
              y2="94.6996"
            >
              {cfg.svgStops?.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <div
          className={`absolute h-[113px] left-0 rounded-[20px] top-0 w-[158px] ${locked ? 'brightness-[0.6]' : ''}`}
          style={{ backgroundImage: model.gradient, opacity: cfg.bgOpacity }}
        />
      )}

      {/* Text */}
      <span
        className="absolute font-maven font-extrabold h-[29px] leading-[10px] text-white whitespace-pre-wrap"
        style={{
          left: cfg.text.left,
          top: cfg.text.top,
          width: cfg.text.width,
          fontSize: cfg.text.fontSize,
        }}
      >
        {model.name}
      </span>

      {/* Logo */}
      {cfg.logo.type === 'mask' ? (
        <div
          className="absolute bg-white"
          style={{
            left: cfg.logo.left,
            top: cfg.logo.top,
            width: cfg.logo.width,
            height: cfg.logo.height,
            maskImage: `url('${cfg.logo.src}')`,
            WebkitMaskImage: `url('${cfg.logo.src}')`,
            maskSize: cfg.logo.maskSize,
            WebkitMaskSize: cfg.logo.maskSize,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: cfg.logo.maskPosition,
            WebkitMaskPosition: cfg.logo.maskPosition,
          }}
        />
      ) : (
        <img
          alt=""
          className="absolute max-w-none object-cover pointer-events-none brightness-0 invert"
          style={{
            left: cfg.logo.left,
            top: cfg.logo.top,
            width: cfg.logo.width,
            height: cfg.logo.height,
          }}
          src={cfg.logo.src}
        />
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
          <span className="font-manrope text-[8px] text-white tracking-wider font-extrabold">
            NEW
          </span>
        </div>
      )}
    </button>
  )
}

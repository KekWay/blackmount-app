'use client'

import { Sparkles, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { AIModel } from '@/types'
import { isModelNew } from '@/data/ai-models'
import { useFavoritesStore } from '@/stores/favorites'

/* SVG path for rounded card shape (NanoBanana) */
const SVG_CARD_PATH = 'M0 20C0 8.95431 8.9543 0 20 0H138C149.046 0 158 8.9543 158 20V93C158 104.046 149.046 113 138 113H20C8.9543 113 0 104.046 0 93V20Z'

/* ── Logo config types matching FigmaModelCard.tsx ── */
interface LogoImg { type: 'img'; src: string; left: number; top: number; width: number; height: number }
interface LogoColor { type: 'color'; src: string; left: number; top: number; width: number; height: number }
interface LogoMask { type: 'mask'; src: string; left: number; top: number; width: number; height: number; maskSize: string; maskPosition: string }

interface CardConfig {
  gradient: string
  bgType: 'div' | 'svg'
  bgOpacity: number
  svgGradientStops?: { offset: number; color: string }[]
  text: { left: number; top: number; width: number; fontSize: number }
  logo: LogoImg | LogoColor | LogoMask
}

/* ── Configs copied from FigmaModelCard.tsx CARD_CONFIGS ── */
const CONFIGS: Record<string, CardConfig> = {
  chatgpt: {
    gradient: 'linear-gradient(120.356deg, rgb(75, 219, 82) 1.0121%, rgb(148, 185, 133) 98.988%)',
    bgType: 'div', bgOpacity: 0.65,
    text: { left: 52, top: 51, width: 153, fontSize: 20 },
    logo: { type: 'mask', src: '/assets/models/chatgpt-mask-card.png', left: 16, top: 37, width: 35.636, height: 40.727, maskSize: '28px 28px', maskPosition: '3.817px 6.364px' },
  },
  claude: {
    gradient: 'linear-gradient(120.356deg, rgb(255, 200, 123) 1.0121%, rgb(255, 166, 0) 43.678%, rgb(255, 158, 3) 98.988%)',
    bgType: 'div', bgOpacity: 0.65,
    text: { left: 63, top: 50, width: 75, fontSize: 20 },
    logo: { type: 'img', src: '/assets/models/claude-logo.png', left: 29, top: 43, width: 28, height: 28 },
  },
  gemini: {
    gradient: 'linear-gradient(120.356deg, rgb(96, 151, 228) 1.0121%, rgb(100, 70, 111) 93.807%)',
    bgType: 'div', bgOpacity: 0.65,
    text: { left: 58, top: 51, width: 75, fontSize: 20 },
    logo: { type: 'img', src: '/assets/models/gemini-logo.png', left: 10, top: 31, width: 46, height: 58 },
  },
  nanobanana: {
    gradient: '',
    bgType: 'svg', bgOpacity: 0.85,
    svgGradientStops: [{ offset: 0, color: '#CBD03C' }, { offset: 1, color: '#DCCA7A' }],
    text: { left: 43, top: 52, width: 109, fontSize: 17 },
    logo: { type: 'img', src: '/assets/models/nanobanana-logo.png', left: 7, top: 43, width: 28, height: 28 },
  },
  flux: {
    gradient: 'linear-gradient(120.356deg, rgb(230, 15, 19) 1.0121%, rgb(169, 98, 98) 98.988%)',
    bgType: 'div', bgOpacity: 0.65,
    text: { left: 71, top: 51, width: 75, fontSize: 20 },
    logo: { type: 'color', src: '/assets/models/flux-icon.png', left: 28, top: 36, width: 38, height: 38 },
  },
  kling: {
    gradient: 'linear-gradient(120.356deg, rgb(27, 254, 39) 1.0121%, rgb(15, 105, 223) 98.988%)',
    bgType: 'div', bgOpacity: 0.65,
    text: { left: 69, top: 50, width: 75, fontSize: 20 },
    logo: { type: 'img', src: '/assets/models/kling-logo.png', left: 35, top: 42, width: 28, height: 28 },
  },
  veo31: {
    gradient: 'linear-gradient(120.356deg, rgb(113, 136, 227) 40.108%, rgb(226, 105, 78) 93.807%)',
    bgType: 'div', bgOpacity: 0.65,
    text: { left: 60, top: 49, width: 153, fontSize: 20 },
    logo: { type: 'img', src: '/assets/models/gemini-logo.png', left: 11, top: 30, width: 46, height: 58 },
  },
}

interface ModelCardProps {
  model: AIModel
  locked?: boolean
  onClick?: () => void
}

export function ModelCard({ model, locked, onClick }: ModelCardProps) {
  const cfg = CONFIGS[model.id]
  const isFav = useFavoritesStore((s) => s.isFavorite(model.id))
  const toggle = useFavoritesStore((s) => s.toggleFavorite)
  if (!cfg) return null

  return (
    <div
      className="h-[113px] w-[158px] cursor-pointer hover:scale-105 transition-transform duration-300 rounded-[20px] relative group will-change-transform"
      style={{ transform: 'translateZ(0)' }}
      onClick={locked ? undefined : onClick}
    >
      {/* Subtle outer glow on hover */}
      <div
        className="absolute -inset-[8px] rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${model.glowColors?.[0] || 'rgba(136,138,229,0.15)'}15, transparent 70%)` }}
      />
      <article className="relative size-full rounded-[20px] overflow-hidden" style={locked ? { filter: 'brightness(0.6)' } : undefined}>
        {/* Background — exact original */}
        {cfg.bgType === 'svg' ? (
          <svg className="absolute block h-[113px] left-0 top-0 w-[158px]" fill="none" preserveAspectRatio="none" viewBox="0 0 158 113" aria-hidden="true">
            <path d={SVG_CARD_PATH} fill={`url(#paint_${model.id})`} opacity={cfg.bgOpacity} />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id={`paint_${model.id}`} x1="-1.40025e-07" x2="163.546" y1="-1.08207" y2="94.6996">
                {cfg.svgGradientStops?.map((stop, i) => (<stop key={i} offset={stop.offset} stopColor={stop.color} />))}
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <div className="absolute h-[113px] left-0 rounded-[20px] top-0 w-[158px]" style={{ backgroundImage: cfg.gradient, opacity: cfg.bgOpacity }} />
        )}

        {/* Name — exact original className */}
        <span
          className="absolute font-manrope font-extrabold h-[29px] leading-[10px] text-white whitespace-pre-wrap"
          style={{ left: cfg.text.left, top: cfg.text.top, width: cfg.text.width, fontSize: cfg.text.fontSize }}
        >
          {model.name}
        </span>

        {/* Logo — exact original: mask for chatgpt, img+invert for others */}
        {cfg.logo.type === 'mask' ? (
          <div className="absolute bg-white" aria-hidden="true" style={{ left: cfg.logo.left, top: cfg.logo.top, width: cfg.logo.width, height: cfg.logo.height, maskImage: `url('${cfg.logo.src}')`, WebkitMaskImage: `url('${cfg.logo.src}')`, maskSize: cfg.logo.maskSize, WebkitMaskSize: cfg.logo.maskSize, maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: cfg.logo.maskPosition, WebkitMaskPosition: cfg.logo.maskPosition }} />
        ) : cfg.logo.type === 'color' ? (
          <img alt="" className="absolute max-w-none object-contain pointer-events-none" style={{ left: cfg.logo.left, top: cfg.logo.top, width: cfg.logo.width, height: cfg.logo.height }} src={cfg.logo.src} />
        ) : (
          <img alt="" className="absolute max-w-none object-cover pointer-events-none brightness-0 invert" style={{ left: cfg.logo.left, top: cfg.logo.top, width: cfg.logo.width, height: cfg.logo.height }} src={cfg.logo.src} />
        )}
      </article>

      {/* Favorite star */}
      {!locked && (
        <button
          onClick={(e) => { e.stopPropagation(); toggle(model.id) }}
          className="absolute top-[6px] left-[6px] z-[4] size-[24px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(0,0,0,0.5)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isFav ? 'filled' : 'empty'}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15, duration: 0.2 }}
            >
              <Star
                size={12}
                className={isFav ? 'text-[#f5a623]' : 'text-white/70'}
                fill={isFav ? '#f5a623' : 'none'}
              />
            </motion.div>
          </AnimatePresence>
        </button>
      )}

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 rounded-[20px] flex flex-col items-center justify-center z-[2] bg-[rgba(0,0,0,0.4)] backdrop-blur-[1px]">
          <button className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full cursor-pointer transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, rgba(91,91,214,0.7), rgba(124,92,191,0.7))', boxShadow: '0 2px 8px rgba(91,91,214,0.3)' }}>
            <Sparkles size={9} className="text-white" />
            <span className="font-manrope font-semibold text-[9px] text-white">Подписка</span>
          </button>
        </div>
      )}

      {/* NEW badge */}
      {isModelNew(model) && !locked && (
        <div className="absolute top-[6px] right-[6px] z-[3]">
          <div className="px-[6px] py-[2px] rounded-[6px] flex items-center gap-[3px]" style={{ background: 'linear-gradient(135deg, rgba(101,222,216,0.9) 0%, rgba(54,180,160,0.9) 100%)', boxShadow: '0 2px 8px rgba(101,222,216,0.4)' }}>
            <span className="font-manrope text-[8px] text-white tracking-[0.06em] font-extrabold">NEW</span>
          </div>
        </div>
      )}
    </div>
  )
}

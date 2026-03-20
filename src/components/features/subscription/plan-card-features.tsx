'use client'

import Image from 'next/image'
import { Check, Info } from 'lucide-react'
import { featureIconMap, MODEL_LOGOS, type PlanFeature } from './subscription-data'

const ALL_LOGOS = [
  MODEL_LOGOS.chatgpt, MODEL_LOGOS.claude, MODEL_LOGOS.gemini, MODEL_LOGOS.flux,
  MODEL_LOGOS.nanobanana, MODEL_LOGOS.sora, MODEL_LOGOS.kling, MODEL_LOGOS.veo,
]
const INVERT_INDICES = new Set([0, 3])

interface PlanCardFeaturesProps {
  pf: { limits: string[]; features: PlanFeature[] }
  isPro: boolean
  onShowModels: () => void
}

export function PlanCardFeatures({ pf, isPro, onShowModels }: PlanCardFeaturesProps) {
  return (
    <div className="flex flex-col gap-[12px] flex-1 relative z-10">
      {pf.limits.map((lim, i) => (
        <div key={`lim-${i}`} className="flex items-center gap-[8px]">
          <div className="shrink-0 size-[16px] rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
            <Check size={10} className={isPro ? 'text-[#888ae5]' : 'text-[rgba(255,255,255,0.5)]'} />
          </div>
          <span className={`font-manrope text-[13px] ${isPro ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.7)]'}`}>{lim}</span>
        </div>
      ))}

      <div className="w-full h-px bg-[rgba(255,255,255,0.06)] my-[4px]" />

      {pf.features.map((feat, i) => {
        const isAllModels = feat.text === 'Доступ ко всем моделям'
        const isAccent = feat.text.includes('Бесплатно') || isAllModels
        return (
          <div key={`feat-${i}`} className={`flex flex-col gap-[8px] ${isAllModels ? 'bg-[#888ae5]/10 p-[10px] rounded-[10px] border border-[#888ae5]/20 -mx-[10px] relative overflow-hidden' : ''}`}>
            {isAllModels && (
              <div className="absolute right-0 top-0 bottom-0 w-[80px] bg-gradient-to-l from-[#888ae5]/10 to-transparent pointer-events-none" />
            )}
            <div className="flex items-start gap-[8px] relative z-10">
              <div className="mt-[2px] shrink-0 size-[16px] relative">
                <Image src={featureIconMap[feat.icon]} alt="" width={16} height={16} className="object-contain" />
              </div>
              <span className={`font-manrope text-[12px] leading-[18px] ${isAllModels ? 'text-white font-bold' : isAccent ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'}`}>
                {feat.text}
                {feat.bold && <span className={isAccent ? 'text-[#888ae5] font-bold' : 'text-white font-bold'}>{feat.bold}</span>}
              </span>
            </div>
            {isAllModels && (
              <div className="flex items-center gap-[6px] pl-[24px] relative z-10 mt-[2px]">
                <div className="flex -space-x-[4px]">
                  {ALL_LOGOS.map((logo, idx) => (
                    <div key={idx} className="w-[20px] h-[20px] rounded-full bg-[#252336] border border-[#888ae5]/30 p-[3px] flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.4)]" style={{ zIndex: 10 - idx }}>
                      <Image src={logo} alt="" width={14} height={14} className="object-contain" style={INVERT_INDICES.has(idx) ? { filter: 'brightness(0) invert(1)' } : undefined} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

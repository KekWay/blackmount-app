'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import { getBasePrice } from '@/types/models'
import type { AIModel, ModelVersion } from '@/types'
import { MODEL_ASSETS } from '@/lib/assets'
import { APP_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'
import { useSubscriptionStore } from '@/stores/subscription'

interface ModelSelectorProps {
  model: AIModel
  selectedVersion: ModelVersion
  onSelectVersion: (version: ModelVersion) => void
}

export function ModelSelector({ model, selectedVersion, onSelectVersion }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isVersionLocked = useSubscriptionStore((s) => s.isVersionLocked)

  const assets = MODEL_ASSETS[model.id as ModelId]
  const logoSrc = assets ? ('colorLogo' in assets ? assets.colorLogo : null) : null

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded-xl px-2 py-1 transition-colors"
      >
        {logoSrc && (
          <Image src={logoSrc} alt={model.name} width={30} height={30} className="object-contain" />
        )}
        <div className="flex flex-col items-start">
          <span className="font-semibold text-lg text-white leading-tight">{model.name}</span>
          <span className="text-[11px] text-white/40 leading-tight">{selectedVersion.label}</span>
        </div>
        <CustomIcon
          src="/icons/arrow_down_icon.png"
          size={16}
          className={`opacity-40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] bg-popover rounded-2xl w-[280px] py-1.5 z-50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/[0.06]">
          <div className="px-3.5 py-1.5 border-b border-white/[0.06] mb-1">
            <p className="text-[11px] text-white/30 uppercase tracking-wider font-medium">
              Выберите модель {model.name}
            </p>
          </div>
          {model.versions.map((v) => {
            const locked = isVersionLocked(v.id)
            return (
              <button
                key={v.id}
                onClick={() => {
                  if (!locked) {
                    onSelectVersion(v)
                    setOpen(false)
                  }
                }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 transition-colors ${
                  locked
                    ? 'opacity-60 cursor-default'
                    : 'hover:bg-primary/[0.08] cursor-pointer'
                } ${v.id === selectedVersion.id && !locked ? 'bg-primary/10' : ''}`}
              >
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-white font-medium">{v.label}</span>
                    {locked && <img src="/assets/models/padlock_icon.png" alt="" className="size-[10px] object-contain brightness-0 invert opacity-35" />}
                  </div>
                  {v.description && (
                    <span className="text-[11px] text-white/30">{v.description}</span>
                  )}
                </div>
                {locked ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[rgba(91,91,214,0.5)] to-[rgba(124,92,191,0.5)] shrink-0">
                    <img src="/assets/models/stars_icon_2.png" alt="" className="size-[9px] object-contain brightness-0 invert" />
                    <span className="text-[9px] text-white font-semibold">Подписка</span>
                  </div>
                ) : (
                  <>
                    {v.price != null && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-white/50 font-semibold">{typeof v.price === 'object' ? `от ${getBasePrice(v.price)}` : v.price}</span>
                        <Image src={APP_ASSETS.coin} alt="" width={12} height={12} />
                      </div>
                    )}
                    {v.id === selectedVersion.id && (
                      <Check size={14} className="text-primary shrink-0" />
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

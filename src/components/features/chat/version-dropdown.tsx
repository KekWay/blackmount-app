'use client'

import { useState, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import { motion, AnimatePresence } from 'motion/react'
import { ModelIcon } from '@/components/shared/model-icon'
import { useSubscriptionStore } from '@/stores/subscription'
import { APP_ASSETS } from '@/lib/assets'
import type { AIModel, ModelVersion } from '@/types'
import { getBasePrice } from '@/types/models'

const imgXsCoin = APP_ASSETS.coin

interface VersionDropdownProps {
  currentModel: AIModel
  selectedVersion: ModelVersion
  onSelectVersion: (v: ModelVersion) => void
}

export function VersionDropdown({ currentModel, selectedVersion, onSelectVersion }: VersionDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const priceLabel = (v: ModelVersion) => {
    if (v.price == null) return null
    if (typeof v.price === 'number') return String(v.price)
    return `от ${getBasePrice(v.price)}`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[8px] cursor-pointer hover:bg-[rgba(255,255,255,0.05)] rounded-[12px] px-[8px] py-[4px] transition-colors"
      >
        <ModelIcon modelId={currentModel.id} size={30} />
        <div className="flex flex-col items-start">
          <p className="font-manrope font-extrabold leading-[22px] text-[18px] text-white">
            {currentModel.name}
          </p>
          <p className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.4)] leading-[14px]">
            {selectedVersion.label}
          </p>
        </div>
        <CustomIcon src="/icons/arrow_down_icon.png" size={16} className={`opacity-40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-[calc(100%+4px)] bg-[#1e1d26] rounded-[16px] w-[280px] py-[6px] z-50 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: 'spring', damping: 24, stiffness: 400 }}
          >
            <div className="px-[14px] py-[6px] border-b border-[rgba(255,255,255,0.06)] mb-[4px]">
              <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Выберите модель {currentModel.name}</p>
            </div>
            <div className="max-h-[200px] overflow-y-auto chat-scrollbar">
              {currentModel.versions.map((v) => {
                const vLocked = useSubscriptionStore.getState().isVersionLocked(v.id)
                const pl = priceLabel(v)
                return (
                  <button
                    key={v.id}
                    onClick={() => { if (!vLocked) { onSelectVersion(v); setOpen(false) } }}
                    className={`flex items-center gap-[10px] w-full px-[14px] py-[8px] transition-colors ${vLocked ? 'opacity-60 cursor-default' : 'hover:bg-[rgba(136,138,229,0.08)] cursor-pointer'} ${v.id === selectedVersion.id && !vLocked ? 'bg-[rgba(136,138,229,0.1)]' : ''}`}
                  >
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <div className="flex items-center gap-[6px]">
                        <span className="font-manrope font-medium text-[13px] text-white">{v.label}</span>
                        {vLocked && <img src="/assets/models/padlock_icon.png" alt="" className="size-[10px] object-contain brightness-0 invert opacity-35" />}
                      </div>
                      {v.description && (
                        <span className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.3)]">{v.description}</span>
                      )}
                    </div>
                    {vLocked ? (
                      <div
                        className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full shrink-0 cursor-pointer hover:brightness-110 transition-all"
                        style={{ background: 'linear-gradient(135deg, rgba(91,91,214,0.5), rgba(124,92,191,0.5))' }}
                        onClick={(e) => { e.stopPropagation(); window.location.href = '/profile?tab=subscription' }}
                      >
                        <img src="/assets/models/stars_icon_2.png" alt="" className="size-[9px] object-contain brightness-0 invert" />
                        <span className="font-manrope font-semibold text-[9px] text-white whitespace-nowrap">Подписка</span>
                      </div>
                    ) : (
                      <>
                        {pl != null && (
                          <div className="flex items-center gap-[3px] shrink-0">
                            <span className="font-manrope font-semibold text-[12px] text-[rgba(255,255,255,0.5)]">{pl}</span>
                            <div className="relative shrink-0 size-[12px]">
                              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
                            </div>
                          </div>
                        )}
                        {v.id === selectedVersion.id && (
                          <Check size={14} className="text-[#888ae5] shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { aiModels } from '@/data/ai-models'
import { getBasePrice } from '@/types/models'
import { IMG_COIN } from './profile-data'

export function PricingInfoOverlay({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bg-[#181722] rounded-[24px] w-[560px] max-w-[90vw] max-h-[80vh] overflow-hidden border border-[#888ae5]/20 shadow-[0_12px_48px_rgba(0,0,0,0.4)] flex flex-col" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <div className="px-[32px] pt-[32px] pb-[20px] shrink-0">
            <div className="flex items-center justify-between">
              <p className="font-manrope font-bold text-[22px] text-white">Стоимость генерации</p>
              <button onClick={onClose} aria-label="Закрыть" className="group bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer"><Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto chat-scrollbar px-[32px] pb-[32px]">
            <div className="rounded-[16px] overflow-hidden border border-[rgba(255,255,255,0.06)]">
              <div className="grid grid-cols-[1fr_1fr_80px] bg-[rgba(255,255,255,0.04)] px-[16px] py-[10px]">
                <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Модель</span>
                <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Версия</span>
                <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider text-right">Цена</span>
              </div>
              {aiModels.map((m) => (
                m.versions.map((v, vi) => (
                  <div key={v.id} className={`grid grid-cols-[1fr_1fr_80px] px-[16px] py-[10px] ${vi === 0 && m.id !== 'chatgpt' ? 'border-t border-[rgba(255,255,255,0.06)]' : ''} hover:bg-[rgba(136,138,229,0.04)] transition-colors`}>
                    <span className="font-manrope font-medium text-[13px] text-white">{vi === 0 ? m.name : ''}</span>
                    <span className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.6)]">{v.label}</span>
                    <div className="flex items-center gap-[4px] justify-end">
                      <span className="font-manrope font-semibold text-[13px] text-white">{typeof v.price === 'object' ? `от ${getBasePrice(v.price)}` : v.price}</span>
                      <div className="relative shrink-0 size-[12px]"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

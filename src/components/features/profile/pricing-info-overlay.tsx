'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { aiModels } from '@/data/ai-models'
import { IMG_COIN } from './profile-data'

export function PricingInfoOverlay({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bg-[#1e1d26] rounded-[20px] w-[560px] max-h-[80vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
          <div className="px-[28px] py-[22px]">
            <div className="flex items-center justify-between mb-[20px]">
              <p className="font-manrope font-extrabold text-[18px] text-white">Стоимость генерации</p>
              <button onClick={onClose} className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <div className="rounded-[12px] overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_80px] gap-[1px] bg-[rgba(255,255,255,0.04)] px-[16px] py-[10px]">
                <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Модель</span>
                <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Версия</span>
                <span className="font-manrope font-semibold text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider text-right">Цена</span>
              </div>
              {aiModels.map((m) => (
                m.versions.map((v, vi) => (
                  <div key={v.id} className={`grid grid-cols-[1fr_1fr_80px] px-[16px] py-[8px] ${vi === 0 && m.id !== 'chatgpt' ? 'border-t border-[rgba(255,255,255,0.04)]' : ''} hover:bg-[rgba(255,255,255,0.02)]`}>
                    <span className="font-manrope font-medium text-[12px] text-white">{vi === 0 ? m.name : ''}</span>
                    <span className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.6)]">{v.label}</span>
                    <div className="flex items-center gap-[3px] justify-end">
                      <span className="font-manrope font-semibold text-[12px] text-white">{v.price}</span>
                      <div className="relative shrink-0 size-[11px]"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>
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

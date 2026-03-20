'use client'

import Image from 'next/image'
import { X, Zap, Layers } from 'lucide-react'
import { motion } from 'motion/react'
import { aiModels } from '@/data/ai-models'
import { COIN_IMG } from './subscription-data'
import { LOCKED_MODEL_IDS, LOCKED_VERSION_IDS } from '@/stores/subscription'

const catColors: Record<string, string> = { text: '#888ae5', image: '#ef4444', video: '#22d3ee' }
const catLabels: Record<string, string> = { text: 'Текст', image: 'Изображение', video: 'Видео' }

export function ModelsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] p-[16px]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    >
      <motion.div
        className="bg-[#19181e] rounded-[20px] w-[560px] max-w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.5)] chat-scrollbar"
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}
      >
        <ModelsOverlayHeader onClose={onClose} />
        <ModelsOverlayLegend />
        <ModelsOverlayList />
      </motion.div>
    </motion.div>
  )
}

function ModelsOverlayHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-[24px] pt-[24px] pb-[16px] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between sticky top-0 bg-[#19181e] z-10 rounded-t-[20px]">
      <div className="flex items-center gap-[10px]">
        <div className="size-[32px] rounded-[10px] bg-[#888ae5]/15 flex items-center justify-center">
          <Layers size={16} className="text-[#888ae5]" />
        </div>
        <div>
          <h2 className="text-[16px] text-white font-manrope font-extrabold">Доступ к моделям</h2>
          <p className="text-[11px] text-[rgba(255,255,255,0.35)] font-manrope">{aiModels.length} нейросетей</p>
        </div>
      </div>
      <button onClick={onClose} className="size-[32px] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
        <X size={16} className="text-[rgba(255,255,255,0.5)]" />
      </button>
    </div>
  )
}

function ModelsOverlayLegend() {
  return (
    <div className="px-[24px] pt-[14px] pb-[10px] flex items-center gap-[16px] border-b border-[rgba(255,255,255,0.04)]">
      {[
        { color: '#6bc085', label: 'Бесплатно' },
        { color: '#888ae5', label: 'По подписке PRO' },
        { color: '#ef4444', label: 'Полностью PRO' },
      ].map((l) => (
        <div key={l.label} className="flex items-center gap-[6px]">
          <div className="size-[8px] rounded-full" style={{ background: l.color }} />
          <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-manrope font-semibold">{l.label}</span>
        </div>
      ))}
    </div>
  )
}

function ModelsOverlayList() {
  return (
    <div className="px-[24px] py-[16px] flex flex-col gap-[12px]">
      {aiModels.map((model) => {
        const isFullyLocked = LOCKED_MODEL_IDS.has(model.id)
        const catColor = catColors[model.category] || '#888ae5'
        return (
          <div key={model.id} className="rounded-[14px] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:bg-[rgba(255,255,255,0.04)] transition-all">
            <div className="px-[16px] py-[12px] flex items-center gap-[12px]">
              <div className="size-[36px] rounded-[10px] flex items-center justify-center" style={{ backgroundImage: model.gradient }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px]">
                  <p className="text-[14px] text-white font-manrope font-extrabold">{model.name}</p>
                  <span className="text-[9px] font-manrope px-[6px] py-[2px] rounded-[4px] border font-bold" style={{ color: catColor, borderColor: `${catColor}30`, backgroundColor: `${catColor}10` }}>{catLabels[model.category]}</span>
                  {isFullyLocked && <span className="text-[9px] font-manrope px-[6px] py-[2px] rounded-[4px] bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 font-bold">Только PRO</span>}
                </div>
                <p className="text-[11px] text-[rgba(255,255,255,0.35)] font-manrope mt-[2px]">{model.versions.length} {model.versions.length === 1 ? 'версия' : model.versions.length < 5 ? 'версии' : 'версий'}</p>
              </div>
            </div>
            <div className="px-[16px] pb-[12px] flex flex-col gap-[4px]">
              {model.versions.map((v) => {
                const isLocked = LOCKED_VERSION_IDS.has(v.id)
                return (
                  <div key={v.id} className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.015)]">
                    <div className={`size-[7px] rounded-full shrink-0 ${isLocked ? 'bg-[#888ae5]' : 'bg-[#6bc085]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-[6px]">
                        <span className="text-[12px] text-white font-manrope font-semibold">{v.label}</span>
                        {v.description && <span className="text-[10px] text-[rgba(255,255,255,0.3)] font-manrope">· {v.description}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px] shrink-0">
                      <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-manrope font-semibold">{v.price}{'\u20BD'}/запрос</span>
                      {isLocked ? (
                        <span className="text-[8px] font-manrope px-[5px] py-[1px] rounded-[3px] bg-[#888ae5]/15 text-[#888ae5] font-bold">PRO</span>
                      ) : (
                        <span className="text-[8px] font-manrope px-[5px] py-[1px] rounded-[3px] bg-[#6bc085]/15 text-[#6bc085] font-bold">FREE</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

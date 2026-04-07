'use client'

import { Layers } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { aiModels } from '@/data/ai-models'
import { getBasePrice } from '@/types/models'
import { MODEL_ASSETS } from '@/lib/assets'

const lockedVersionIds = new Set(['chatgpt-5.2', 'claude-opus-4.5', 'gemini-3-pro', 'nb-pro', 'flux-1.1-pro-ultra', 'kling-2.6', 'veo-3.1-quality', 'veo-3.1-fast'])
const lockedModelIds = new Set(['veo31'])
const catColors: Record<string, string> = { text: '#888ae5', image: '#ef4444', video: '#22d3ee' }
const catLabels: Record<string, string> = { text: 'Текст', image: 'Изображение', video: 'Видео' }

type ModelId = keyof typeof MODEL_ASSETS

export function AllModelsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] p-[16px]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    >
      <motion.div
        className="bg-[#19181e] rounded-[20px] w-[560px] max-w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.5)] chat-scrollbar"
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}
      >
        <AllModelsHeader onClose={onClose} />
        <AllModelsLegend />
        <AllModelsList />
      </motion.div>
    </motion.div>
  )
}

function AllModelsHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-[24px] pt-[24px] pb-[16px] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between sticky top-0 bg-[#19181e] z-10 rounded-t-[20px]">
      <div className="flex items-center gap-[10px]">
        <div className="size-[32px] rounded-[10px] bg-[#888ae5]/15 flex items-center justify-center">
          <Layers size={16} className="text-[#888ae5]" />
        </div>
        <div>
          <h2 className="text-[16px] text-white font-manrope font-extrabold">Доступ к моделям</h2>
          <p className="text-[11px] text-[rgba(255,255,255,0.35)] font-manrope">{aiModels.length} нейросетей · бесплатные и PRO версии</p>
        </div>
      </div>
      <button onClick={onClose} className="group size-[32px] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
        <Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
      </button>
    </div>
  )
}

function AllModelsLegend() {
  return (
    <div className="px-[24px] pt-[14px] pb-[10px] flex items-center gap-[16px] border-b border-[rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-[6px]">
        <div className="size-[8px] rounded-full bg-[#6bc085]" />
        <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-manrope font-semibold">Бесплатно</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <div className="size-[8px] rounded-full bg-[#888ae5]" />
        <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-manrope font-semibold">По подписке PRO</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <div className="size-[8px] rounded-full bg-[#ef4444]" />
        <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-manrope font-semibold">Полностью PRO</span>
      </div>
    </div>
  )
}

function AllModelsList() {
  return (
    <div className="px-[24px] py-[16px] flex flex-col gap-[12px]">
      {aiModels.map((model) => {
        const isFullyLocked = lockedModelIds.has(model.id)
        const catColor = catColors[model.category] || '#888ae5'
        const assets = MODEL_ASSETS[model.id as ModelId]
        const colorLogo = assets && 'colorLogo' in assets ? assets.colorLogo : null
        const forceWhite = model.id === 'chatgpt' || model.id === 'flux'
        const maskImage = assets && 'maskImage' in assets ? assets.maskImage : null

        const renderLogo = () => {
          if (maskImage) {
            return (
              <div className="size-[36px] rounded-[10px] bg-[#252336] flex items-center justify-center p-[5px]">
                <div style={{ width: 22, height: 22, backgroundColor: forceWhite ? '#ffffff' : '#6a9b6c', maskImage: `url('${maskImage}')`, WebkitMaskImage: `url('${maskImage}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
              </div>
            )
          }
          if (colorLogo) {
            return (
              <div className="size-[36px] rounded-[10px] bg-[#252336] flex items-center justify-center p-[5px]">
                <img alt="" src={colorLogo} className="size-[22px] object-contain" style={forceWhite ? { filter: 'brightness(0) invert(1)' } : undefined} />
              </div>
            )
          }
          return <div className="size-[36px] rounded-[10px]" style={{ backgroundImage: model.gradient }} />
        }

        return (
          <div key={model.id} className="rounded-[14px] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:bg-[rgba(255,255,255,0.04)] transition-all">
            <div className="px-[16px] py-[12px] flex items-center gap-[12px]">
              {renderLogo()}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px]">
                  <p className="text-[14px] text-white font-manrope font-extrabold">{model.name}</p>
                  <span className="text-[9px] font-manrope px-[6px] py-[2px] rounded-[4px] border font-bold" style={{ color: catColor, borderColor: `${catColor}30`, backgroundColor: `${catColor}10` }}>{catLabels[model.category]}</span>
                  {isFullyLocked && (
                    <span className="text-[9px] font-manrope px-[6px] py-[2px] rounded-[4px] bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 font-bold">Только PRO</span>
                  )}
                </div>
                <p className="text-[11px] text-[rgba(255,255,255,0.35)] font-manrope mt-[2px]">{model.versions.length} {model.versions.length === 1 ? 'версия' : model.versions.length < 5 ? 'версии' : 'версий'}</p>
              </div>
            </div>
            <div className="px-[16px] pb-[12px] flex flex-col gap-[4px]">
              {model.versions.map((v) => {
                const isLocked = lockedVersionIds.has(v.id)
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
                      <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-manrope font-semibold">{typeof v.price === 'object' ? `от ${getBasePrice(v.price)}` : v.price} ₿/запрос</span>
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

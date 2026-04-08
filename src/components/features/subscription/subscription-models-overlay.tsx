'use client'

import { motion } from 'motion/react'
import { Zap } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'
import { aiModels } from '@/data/ai-models'
import { getBasePrice } from '@/types/models'
import { ModelIcon } from '@/components/shared/model-icon'
import { imgCoin } from './subscription-data'

const catColors: Record<string, string> = { text: '#888ae5', image: '#ef4444', video: '#22d3ee' }
const catLabels: Record<string, string> = { text: 'Текст', image: 'Изображения', video: 'Видео' }

export function AllModelsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[250] flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-[12px] p-[24px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#111018] rounded-[28px] w-full max-w-[900px] h-[85vh] flex flex-col border border-[rgba(255,255,255,0.08)] shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden" initial={{ scale: 0.96, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 p-[32px] border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#888ae5] opacity-[0.08] blur-[80px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="flex items-center gap-[20px] relative z-10">
            <div className="size-[56px] rounded-[16px] bg-gradient-to-br from-[#888ae5] to-[#5b5bd6] flex items-center justify-center shadow-[0_8px_24px_rgba(136,138,229,0.3)]"><CustomIcon src="/icons/versions_icon.png" size={28} /></div>
            <div>
              <h2 className="text-[28px] text-white font-manrope font-extrabold">Доступные нейросети</h2>
              <p className="text-[14px] text-[rgba(255,255,255,0.5)] font-manrope mt-[4px]">Более 30 передовых ИИ-моделей в одной подписке</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="group size-[44px] rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer relative z-10"><Image src="/icons/close_icon.png" alt="" width={16} height={16} className="invert opacity-60 group-hover:opacity-100 transition-opacity duration-200" /></button>
        </div>
        <div className="flex-1 overflow-y-auto chat-scrollbar p-[32px] bg-[#111018]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {aiModels.map((model) => {
              const catColor = catColors[model.category] || '#888ae5'
              return (
                <div key={model.id} className="rounded-[20px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] overflow-hidden hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.1)] transition-all flex flex-col group">
                  <div className="p-[20px] flex items-start gap-[16px] border-b border-[rgba(255,255,255,0.03)]">
                    <div className="size-[48px] rounded-[14px] bg-[#252336] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shadow-inner overflow-hidden"><ModelIcon modelId={model.id} size={28} /></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-[8px] mb-[6px]">
                        <h3 className="text-[16px] text-white font-manrope leading-tight font-extrabold">{model.name}</h3>
                        <span className="text-[10px] font-manrope px-[8px] py-[3px] rounded-[6px] uppercase tracking-wider font-extrabold" style={{ color: catColor, backgroundColor: `${catColor}15` }}>{catLabels[model.category]}</span>
                      </div>
                      <p className="text-[12px] text-[rgba(255,255,255,0.4)] font-manrope line-clamp-2">{model.versions.length} версий доступно</p>
                    </div>
                  </div>
                  <div className="p-[12px] flex flex-col gap-[6px] bg-[rgba(0,0,0,0.1)] flex-1">
                    {model.versions.map((v) => {
                      const isFree = getBasePrice(v.price) === 1
                      return (
                        <div key={v.id} className="flex items-center justify-between px-[12px] py-[8px] rounded-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                          <div className="flex items-center gap-[8px]"><Zap size={12} className={isFree ? 'text-[#6bc085]' : 'text-[#888ae5]'} /><span className="text-[13px] text-[rgba(255,255,255,0.9)] font-manrope font-medium">{v.label}</span></div>
                          <div className="flex items-center gap-[4px] bg-[rgba(255,255,255,0.05)] px-[8px] py-[4px] rounded-[6px]"><span className="text-[11px] text-white font-manrope font-bold">{typeof v.price === 'object' ? `от ${getBasePrice(v.price)}` : v.price}</span><img src={imgCoin} alt="" className="size-[10px]" /></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

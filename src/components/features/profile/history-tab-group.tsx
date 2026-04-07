'use client'

import { ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import { motion, AnimatePresence } from 'motion/react'
import { MODEL_ASSETS } from '@/lib/assets'
import { IMG_COIN } from './profile-data'
import { getModelIconForLabel, type HistoryItem } from './history-tab-utils'

type ModelId = keyof typeof MODEL_ASSETS

export function HistoryTabGroup({ dateLabel, items, isExpanded, onToggle }: {
  dateLabel: string
  items: HistoryItem[]
  isExpanded: boolean
  onToggle: () => void
}) {
  const groupSpent = items.filter(i => i.type === 'spent').reduce((s, i) => s + Math.abs(i.amount), 0)
  const groupTopup = items.filter(i => i.type === 'topup').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-[24px] py-[14px] cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors">
        <div className="flex items-center gap-[10px]">
          <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
            <CustomIcon src="/icons/arrow_down_icon.png" size={14} className="opacity-30" />
          </motion.div>
          <span className="font-manrope font-semibold text-[14px] text-[#b0b0b0]">{dateLabel}</span>
          <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.2)]">{items.length} операц.</span>
        </div>
        <div className="flex items-center gap-[10px]">
          {groupTopup > 0 && (
            <div className="flex items-center gap-[4px]">
              <ArrowDownLeft size={11} className="text-[#6bc085]" />
              <span className="font-manrope font-extrabold text-[12px] text-[#6bc085]">+{groupTopup}</span>
              <div className="relative shrink-0 size-[10px]"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>
            </div>
          )}
          {groupSpent > 0 && (
            <div className="flex items-center gap-[4px]">
              <ArrowUpRight size={11} className="text-[#f87171]" />
              <span className="font-manrope font-extrabold text-[12px] text-[#f87171]">{'\u2212'}{groupSpent}</span>
              <div className="relative shrink-0 size-[10px]"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>
            </div>
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="border-t border-[rgba(255,255,255,0.04)]">
              {items.map((item, i) => (
                <HistoryItemRow key={item.id} item={item} isLast={i >= items.length - 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HistoryItemRow({ item, isLast }: { item: HistoryItem; isLast: boolean }) {
  const model = item.type === 'spent' ? getModelIconForLabel(item.label) : null
  const isTopup = item.type === 'topup'
  const timeStr = item.date.split(' ')[1] || ''
  const assets = model ? MODEL_ASSETS[model.id as ModelId] : null
  const colorLogo = assets && 'colorLogo' in assets ? assets.colorLogo : null
  const maskImage = assets && 'maskImage' in assets ? assets.maskImage : null

  return (
    <div className={`flex items-center gap-[14px] px-[24px] py-[13px] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${!isLast ? 'border-b border-[rgba(255,255,255,0.03)]' : ''}`}>
      <div className="shrink-0 size-[30px] flex items-center justify-center">
        {isTopup ? (
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
          </div>
        ) : maskImage ? (
          <div style={{ width: 22, height: 22, backgroundColor: '#6a9b6c', maskImage: `url('${maskImage}')`, WebkitMaskImage: `url('${maskImage}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
        ) : colorLogo ? (
          <img alt="" className="max-w-none object-contain pointer-events-none" style={{ width: 22, height: 22 }} src={colorLogo} />
        ) : (
          <Zap size={18} className="text-[rgba(255,255,255,0.35)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-manrope font-extrabold leading-[22.5px] text-[14px] text-white truncate">{item.label}</p>
        <p className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.3)] leading-[16px]">
          {isTopup ? 'Пополнение баланса' : model ? (model.category === 'text' ? 'Текстовая модель' : model.category === 'image' ? 'Генерация изображений' : 'Генерация видео') : 'Списание'}
        </p>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        <p className={`font-manrope font-extrabold leading-[24px] text-[15px] ${isTopup ? 'text-[#6bc085]' : 'text-white'}`}>
          {isTopup ? `+${item.amount}` : item.amount}
        </p>
        <div className="relative shrink-0 size-[14px]">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
        </div>
        <p className="font-manrope font-semibold leading-[16.5px] text-[11px] text-[#b0b0b0] ml-[4px] w-[56px] text-right">{timeStr}</p>
      </div>
    </div>
  )
}

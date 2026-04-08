'use client'

import Image from 'next/image'
import { CustomIcon } from '@/components/shared/custom-icon'
import { motion } from 'motion/react'
import type { ArenaModel } from '@/data/arena-models'
import type { ModelResponse } from './arena-data'
import { IMG_COIN } from './arena-data'
import { MIcon } from './arena-micon'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'
import { ShareIcon } from '@/components/shared/icons'

interface Props {
  winnerResponse: ModelResponse
  prompt: string
  savedIds: Set<string>
  ratedId: string | null
  onSave: (id: string) => void
  onRate: (id: string) => void
  onReset: () => void
  onGoChat: (m: ArenaModel) => void
  onShare: () => void
}

export function ArenaWinnerCard({ winnerResponse, prompt, savedIds, ratedId, onSave, onRate, onReset, onGoChat, onShare }: Props) {
  const isSaved = savedIds.has(winnerResponse.model.id)

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="w-full max-w-[720px] flex-1 rounded-[20px] overflow-hidden flex flex-col relative"
      style={{ background: 'linear-gradient(180deg, rgba(136,138,229,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(136,138,229,0.15)', boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,181,253,0.3), transparent)' }} />
      <div className="flex items-center justify-between px-[20px] py-[14px] border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-[10px]">
          <MIcon model={winnerResponse.model} size={28} />
          <span className="text-[15px] text-white font-semibold">{winnerResponse.model.name}</span>
          <span className="text-[9px] text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.05)] px-[6px] py-[2px] rounded-[4px]">{winnerResponse.model.price}<img alt="" src={IMG_COIN} className="size-[9px] inline ml-[2px]" /></span>
        </div>
      </div>
      <div className="flex-1 px-[20px] py-[16px] overflow-y-auto chat-scrollbar">
        <MarkdownRenderer content={winnerResponse.text} />
      </div>
      <div className="px-[20px] py-[12px] border-t border-[rgba(255,255,255,0.05)] flex items-center gap-[8px] flex-wrap">
        <button onClick={() => onSave(winnerResponse.model.id)} className={`flex items-center gap-[5px] px-[12px] py-[7px] rounded-[10px] text-[11px] transition-all cursor-pointer ${isSaved ? 'bg-[rgba(74,222,128,0.08)] text-[#4ade80] border border-[rgba(74,222,128,0.15)]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] border border-transparent'}`}>
          {isSaved ? <CustomIcon src="/icons/chekmark_icon.png" size={12} /> : <Image src="/icons/dowland_icon.png" alt="" width={12} height={12} className="brightness-0 invert opacity-40" />}
          {isSaved ? 'Сохранено' : 'Сохранить'}
        </button>
        <button onClick={onShare} className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-[10px] bg-[rgba(255,255,255,0.04)] text-[11px] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer border border-transparent font-medium">
          <ShareIcon size={12} /> Поделиться
        </button>
        <div className="flex items-center gap-[4px]">
          <button onClick={() => onRate('up')} className={`group flex items-center gap-[3px] px-[10px] py-[7px] rounded-[10px] text-[11px] transition-all cursor-pointer border ${ratedId === 'up' ? 'bg-[rgba(74,222,128,0.08)] text-[#4ade80] border-[rgba(74,222,128,0.15)]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] border-transparent'}`}>
            <Image src="/icons/like_icon.png" alt="" width={11} height={11} className={`transition-all duration-200 ${ratedId === 'up' ? '[filter:brightness(0)_saturate(100%)_invert(73%)_sepia(57%)_saturate(497%)_hue-rotate(93deg)_brightness(98%)_contrast(92%)]' : 'brightness-0 invert opacity-30 group-hover:opacity-100'}`} />
          </button>
          <button onClick={() => onRate('down')} className={`group flex items-center gap-[3px] px-[10px] py-[7px] rounded-[10px] text-[11px] transition-all cursor-pointer border ${ratedId === 'down' ? 'bg-[rgba(248,113,113,0.08)] text-[#f87171] border-[rgba(248,113,113,0.15)]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] border-transparent'}`}>
            <Image src="/icons/dislike_icon.png" alt="" width={11} height={11} className={`transition-all duration-200 ${ratedId === 'down' ? '[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]' : 'brightness-0 invert opacity-30 group-hover:opacity-100'}`} />
          </button>
        </div>
        <div className="flex items-center gap-[6px] ml-auto">
          <button onClick={onReset} className="group flex items-center gap-[5px] px-[12px] py-[7px] rounded-[10px] bg-[rgba(255,255,255,0.04)] text-[11px] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer border border-transparent font-medium">
            <Image src="/icons/redo_icon.png" alt="" width={11} height={11} className="brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity duration-200" /> Новая битва
          </button>
          <motion.button onClick={() => onGoChat(winnerResponse.model)} className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[10px] bg-[#888ae5] hover:bg-[#9a9cf0] text-[12px] text-white transition-colors cursor-pointer font-semibold shadow-[0_2px_12px_rgba(136,138,229,0.3)]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Продолжить в чате
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

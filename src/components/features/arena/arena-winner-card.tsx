'use client'

import { Check, Save, ThumbsUp, ThumbsDown, MessageSquare, ArrowRight, RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import type { ArenaModel } from '@/data/arena-models'
import type { ModelResponse } from './arena-data'
import { IMG_COIN, IMG_SHARE_MASK } from './arena-data'
import { MIcon } from './arena-micon'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'

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
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 400, damping: 15 }} className="bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.2)] px-[8px] py-[2px] rounded-[6px] flex items-center gap-[3px]">
            <div className="size-[5px] rounded-full bg-[#4ade80]" />
            <span className="text-[9px] text-[#4ade80] font-semibold">ПОБЕДИТЕЛЬ</span>
          </motion.div>
        </div>
      </div>
      <div className="flex-1 px-[20px] py-[16px] overflow-y-auto chat-scrollbar">
        <MarkdownRenderer content={winnerResponse.text} />
      </div>
      <div className="px-[20px] py-[12px] border-t border-[rgba(255,255,255,0.05)] flex items-center gap-[8px] flex-wrap">
        <button onClick={() => onSave(winnerResponse.model.id)} className={`flex items-center gap-[5px] px-[12px] py-[7px] rounded-[10px] text-[11px] transition-all cursor-pointer ${isSaved ? 'bg-[rgba(74,222,128,0.08)] text-[#4ade80] border border-[rgba(74,222,128,0.15)]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] border border-transparent'}`}>
          {isSaved ? <Check size={12} /> : <Save size={12} />}
          {isSaved ? 'Сохранено' : 'Сохранить'}
        </button>
        <button onClick={onShare} className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-[10px] bg-[rgba(255,255,255,0.04)] text-[11px] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer border border-transparent font-medium">
          <div className="w-[12px] h-[12px]" style={{ backgroundColor: 'currentColor', maskImage: `url('${IMG_SHARE_MASK}')`, WebkitMaskImage: `url('${IMG_SHARE_MASK}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} /> Поделиться
        </button>
        <div className="flex items-center gap-[4px]">
          <button onClick={() => onRate('up')} className={`flex items-center gap-[3px] px-[10px] py-[7px] rounded-[10px] text-[11px] transition-all cursor-pointer border ${ratedId === 'up' ? 'bg-[rgba(74,222,128,0.08)] text-[#4ade80] border-[rgba(74,222,128,0.15)]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] border-transparent'}`}>
            <ThumbsUp size={11} />
          </button>
          <button onClick={() => onRate('down')} className={`flex items-center gap-[3px] px-[10px] py-[7px] rounded-[10px] text-[11px] transition-all cursor-pointer border ${ratedId === 'down' ? 'bg-[rgba(248,113,113,0.08)] text-[#f87171] border-[rgba(248,113,113,0.15)]' : 'bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] border-transparent'}`}>
            <ThumbsDown size={11} />
          </button>
        </div>
        <div className="flex items-center gap-[6px] ml-auto">
          <button onClick={onReset} className="flex items-center gap-[5px] px-[12px] py-[7px] rounded-[10px] bg-[rgba(255,255,255,0.04)] text-[11px] text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer border border-transparent font-medium">
            <RotateCcw size={11} /> Новая битва
          </button>
          <motion.button onClick={() => onGoChat(winnerResponse.model)} className="flex items-center gap-[5px] px-[14px] py-[7px] rounded-[10px] bg-[#888ae5] hover:bg-[#9a9cf0] text-[12px] text-white transition-colors cursor-pointer font-semibold shadow-[0_2px_12px_rgba(136,138,229,0.3)]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <MessageSquare size={12} /> Продолжить в чате <ArrowRight size={11} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

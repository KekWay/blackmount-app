'use client'

import { X, Sparkles, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { getResetTimeString } from '@/stores/request-limiter'

interface ModalLimitReachedProps {
  show: boolean
  onClose: () => void
  hasSub: boolean
  dailyLimit: number
}

export function ModalLimitReached({ show, onClose, hasSub, dailyLimit }: ModalLimitReachedProps) {
  const router = useRouter()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[8px]" />
          <motion.div
            className="relative w-[400px] max-w-[90vw] overflow-hidden rounded-[20px]"
            initial={{ scale: 0.92, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#14131c', border: '1px solid rgba(136,138,229,0.12)', boxShadow: '0 0 0 1px rgba(136,138,229,0.06), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px rgba(136,138,229,0.06)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(136,138,229,0.4) 50%, transparent 95%)' }} />
            <div className="flex justify-end pt-[14px] pr-[14px]">
              <button onClick={onClose} className="size-[30px] rounded-[10px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.12)] flex items-center justify-center cursor-pointer transition-colors">
                <X size={14} className="text-[rgba(255,255,255,0.35)]" />
              </button>
            </div>
            <div className="flex flex-col items-center px-[36px] pb-[24px]">
              <div className="relative mb-[20px]">
                <div className="absolute -inset-[12px] rounded-full opacity-40 blur-[20px]" style={{ background: 'radial-gradient(circle, rgba(136,138,229,0.5), transparent 70%)' }} />
                <div className="relative size-[56px] flex items-center justify-center rounded-[16px]" style={{ background: 'linear-gradient(135deg, rgba(136,138,229,0.12), rgba(91,91,214,0.08))', border: '1px solid rgba(136,138,229,0.15)' }}>
                  <Clock size={24} className="text-[#888ae5]" />
                </div>
              </div>
              <p className="text-[18px] text-white mb-[8px] text-center font-bold">Лимит запросов исчерпан</p>
              <p className="text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px] mb-[6px]">
                {hasSub
                  ? <>Вы использовали все <span className="text-[#c4b5fd] font-semibold">{dailyLimit}</span> запросов на сегодня.</>
                  : <>Бесплатный план ограничен <span className="text-[#c4b5fd] font-semibold">{dailyLimit} запросами</span> в день. Оформите подписку для 50 запросов в день.</>
                }
              </p>
              <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-[8px] bg-[rgba(136,138,229,0.06)] border border-[rgba(136,138,229,0.1)]">
                <div className="size-[5px] rounded-full bg-[#888ae5] animate-pulse" />
                <span className="text-[11px] text-[rgba(255,255,255,0.35)] font-medium">Обновится {getResetTimeString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-[8px] px-[36px] pb-[28px]">
              {!hasSub && (
                <button
                  onClick={() => { onClose(); router.push('/profile?tab=subscription') }}
                  className="w-full h-[46px] rounded-[12px] cursor-pointer transition-all flex items-center justify-center gap-[8px] hover:brightness-110 active:scale-[0.98]"
                  style={{ background: '#888ae5', boxShadow: '0 2px 12px rgba(136,138,229,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                >
                  <Sparkles size={15} className="text-white" />
                  <span className="text-[14px] text-white font-bold">Оформить подписку</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full h-[40px] rounded-[12px] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(136,138,229,0.08)] border border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors active:scale-[0.98]"
              >
                <span className="text-[13px] text-[rgba(255,255,255,0.4)] font-medium">Понятно</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

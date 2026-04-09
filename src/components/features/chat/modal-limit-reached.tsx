'use client'

import { Clock } from 'lucide-react'
import Image from 'next/image'
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
            role="dialog"
            aria-modal="true"
            className="relative w-[400px] max-w-[90vw] overflow-hidden rounded-[20px] bg-[#14131c] border border-[rgba(136,138,229,0.12)] shadow-[0_0_0_1px_rgba(136,138,229,0.06),0_24px_64px_rgba(0,0,0,0.55),0_0_80px_rgba(136,138,229,0.06)]"
            initial={{ scale: 0.92, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent_5%,rgba(136,138,229,0.4)_50%,transparent_95%)]" />
            <div className="flex justify-end pt-[14px] pr-[14px]">
              <button onClick={onClose} aria-label="Закрыть" className="group bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer">
                <Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
              </button>
            </div>
            <div className="flex flex-col items-center px-[36px] pb-[24px]">
              <div className="relative mb-[20px]">
                <div className="absolute -inset-[12px] rounded-full opacity-40 blur-[20px] bg-[radial-gradient(circle,rgba(136,138,229,0.5),transparent_70%)]" />
                <div className="relative size-[56px] flex items-center justify-center rounded-[16px] bg-gradient-to-br from-[rgba(136,138,229,0.12)] to-[rgba(91,91,214,0.08)] border border-[rgba(136,138,229,0.15)]">
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
                  className="w-full h-[46px] rounded-[12px] cursor-pointer transition-all flex items-center justify-center gap-[8px] hover:brightness-110 active:scale-[0.98] bg-[#888ae5] shadow-[0_2px_12px_rgba(136,138,229,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
                >
                  <Image src="/assets/models/stars_icon_2.png" alt="" width={15} height={15} className="brightness-0 invert" />
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

'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { APP_ASSETS } from '@/lib/assets'
import type { ModelVersion } from '@/types'

const imgXsCoin = APP_ASSETS.coin

interface ModalLowBalanceProps {
  show: boolean
  onClose: () => void
  selectedVersion: ModelVersion
  dynamicCost: number
  balance: number
}

export function ModalLowBalance({ show, onClose, selectedVersion, dynamicCost, balance }: ModalLowBalanceProps) {
  const router = useRouter()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.65)] backdrop-blur-[6px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#1a1a24] rounded-[24px] w-[420px] max-w-[90vw] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center pt-[32px] pb-[20px] px-[32px]">
              <div className="relative size-[56px] mb-[16px]">
                <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(199,168,45,0.15) 0%, transparent 70%)' }} />
              </div>
              <p className="font-manrope font-extrabold text-[20px] text-white mb-[6px]">Недостаточно айкоинов</p>
              <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px] mb-[6px]">
                Для запроса к <span className="text-white">{selectedVersion.label}</span> нужно <span className="text-white">{dynamicCost}</span> айкоинов.
              </p>
              <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px]">
                Ваш баланс: <span className="text-[#c7a82d]">{balance}</span> айкоинов
              </p>
            </div>
            <div className="flex flex-col gap-[8px] px-[32px] pb-[28px]">
              <button
                onClick={() => { onClose(); router.push('/profile?tab=topup') }}
                className="w-full h-[48px] rounded-[14px] cursor-pointer transition-colors flex items-center justify-center gap-[8px]"
                style={{ backgroundImage: 'linear-gradient(90deg, rgba(187,170,76,0.5) 0%, rgba(199,168,45,0.8) 50%, rgba(187,170,76,0.5) 100%)' }}
              >
                <img alt="" src={imgXsCoin} className="size-[18px] object-contain brightness-0 invert" />
                <span className="font-manrope font-black text-[15px] text-white">Пополнить баланс</span>
              </button>
              <button
                onClick={onClose}
                className="w-full h-[42px] rounded-[12px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors"
              >
                <span className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.5)]">Отмена</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

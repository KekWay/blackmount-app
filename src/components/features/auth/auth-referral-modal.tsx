'use client'

import { Check } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

interface AuthReferralModalProps {
  open: boolean
  referralCode: string
  onChange: (value: string) => void
  onClose: () => void
}

export function AuthReferralModal({
  open,
  referralCode,
  onChange,
  onClose,
}: AuthReferralModalProps) {
  const showReferralCheck = referralCode.length >= 4 && /^[A-Z0-9]{4,20}$/.test(referralCode)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <motion.div
            className="relative bg-[#19181e] rounded-[20px] w-[300px] shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[20px] pt-[20px] pb-[12px]">
              <p className="font-manrope font-bold text-[16px] text-white">Код приглашения</p>
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="group size-[28px] rounded-full bg-[rgba(57,55,91,0.6)] flex items-center justify-center cursor-pointer hover:bg-[rgba(57,55,91,0.9)] transition-colors"
              >
                <Image src="/icons/close_icon.png" alt="" width={9} height={9} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
              </button>
            </div>
            <div className="px-[20px] pb-[20px]">
              <p className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.4)] mb-[12px]">
                Введите код, полученный от друга
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Например: FRIEND2024"
                  maxLength={20}
                  autoFocus
                  className="w-full bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors pr-[36px]"
                />
                {showReferralCheck && (
                  <Check size={14} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#6bc085]" />
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#888ae5] hover:bg-[#7577d4] rounded-[15px] h-[32px] mt-[12px] cursor-pointer transition-colors"
              >
                <span className="font-manrope font-bold text-[12px] text-white">Готово</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

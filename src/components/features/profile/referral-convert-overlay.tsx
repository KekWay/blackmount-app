'use client'

import { useState } from 'react'
import Image from 'next/image'
import { APP_ASSETS } from '@/lib/assets'
import { motion } from 'motion/react'
import { IMG_COIN } from './profile-data'
import { useReferralStore } from '@/stores/referral-store'

const CONVERT_MIN = 100
const CONVERT_BALANCE = 1000

export function ReferralConvertOverlay({ onClose }: { onClose: () => void }) {
  const [convertAmount, setConvertAmount] = useState('200')
  const [convertDone, setConvertDone] = useState(false)
  const createConversion = useReferralStore((s) => s.createConversion)
  const amount = parseFloat(convertAmount || '0')
  const convertedCoins = Math.round(amount * 1.275)
  const amountTooLow = convertAmount.trim() !== '' && amount < CONVERT_MIN
  const amountTooHigh = convertAmount.trim() !== '' && amount > CONVERT_BALANCE
  const isFormValid = convertAmount.trim() !== '' && amount >= CONVERT_MIN && amount <= CONVERT_BALANCE

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#181722] rounded-[24px] w-[460px] max-w-[90vw] overflow-hidden border border-[#888ae5]/20 shadow-[0_12px_48px_rgba(0,0,0,0.4)]" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {!convertDone ? (
          <div className="px-[32px] py-[32px]">
            <div className="flex items-center justify-between mb-[24px]">
              <p className="font-manrope font-bold text-[22px] text-white">Конвертация в айкоины</p>
              <button onClick={onClose} aria-label="Закрыть" className="group bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer"><Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" /></button>
            </div>
            <div className="border border-[#888ae5]/30 bg-[#888ae5]/5 rounded-[16px] px-[20px] py-[16px] flex items-center gap-[16px] mb-[24px]">
              <div className="bg-[#888ae5]/20 p-[10px] rounded-[12px]"><img src={APP_ASSETS.wallet1} alt="" className="size-[20px] object-contain brightness-0 invert" /></div>
              <div><p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)]">Доступно для конвертации</p><p className="font-manrope font-black text-[20px] text-white">1000{'\u20BD'}</p></div>
            </div>
            <div className="mb-[20px]">
              <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Сумма ({'\u20BD'})</p>
              <input type="number" value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} placeholder="0 \u20BD" className={`w-full bg-[rgba(57,55,91,0.5)] border focus:ring-0 transition-colors rounded-[14px] px-[16px] py-[14px] font-manrope font-bold text-[16px] text-white placeholder-[#898787] outline-none ${amountTooLow || amountTooHigh ? 'border-[#f87171]/50' : 'border-transparent'}`} />
              {amountTooLow && <p className="font-manrope text-[11px] text-[#f87171] mt-[6px]">Минимальная сумма — {CONVERT_MIN}{'\u20BD'}</p>}
              {amountTooHigh && <p className="font-manrope text-[11px] text-[#f87171] mt-[6px]">Максимальная сумма — {CONVERT_BALANCE}{'\u20BD'}</p>}
            </div>
            <div className="mb-[32px]">
              <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Вы получите</p>
              <div className="bg-[#121118]/80 border border-[#888ae5]/20 rounded-[14px] px-[16px] py-[14px] flex items-center gap-[10px]">
                <div className="relative shrink-0 size-[24px] drop-shadow-md"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>
                <span className="font-manrope font-black text-[16px] text-white">{convertedCoins} <span className="font-medium text-[14px] text-[rgba(255,255,255,0.5)]">айкоинов</span></span>
              </div>
            </div>
            <button onClick={() => { createConversion(amount, convertedCoins); setConvertDone(true) }} disabled={!isFormValid} className={`w-full rounded-[14px] py-[16px] transition-colors shadow-[0_4px_16px_rgba(136,138,229,0.25)] ${isFormValid ? 'bg-[#888ae5] hover:bg-[#9a9cf0] cursor-pointer' : 'bg-[rgba(136,138,229,0.3)] cursor-not-allowed'}`}><span className="font-manrope font-bold text-[15px] text-white">Конвертировать</span></button>
          </div>
        ) : (
          <div className="px-[32px] py-[48px] flex flex-col items-center">
            <div className="bg-[#121118]/50 rounded-[20px] px-[32px] py-[32px] flex flex-col items-center mb-[24px] w-full relative overflow-hidden">
              <div className="mb-[20px] relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"><div className="relative size-[64px]"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div></div>
              <p className="font-manrope font-black text-[22px] text-white mb-[8px] text-center relative z-10">Зачислено {convertedCoins} айкоинов</p>
              <p className="font-manrope font-medium text-[13px] text-[#6bc085] bg-[#6bc085]/10 px-[12px] py-[4px] rounded-full relative z-10">Конвертация прошла успешно!</p>
            </div>
            <button onClick={onClose} className="w-full bg-white/5 hover:bg-white/10 rounded-[14px] py-[14px] cursor-pointer transition-colors"><span className="font-manrope font-bold text-[14px] text-white">Закрыть</span></button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

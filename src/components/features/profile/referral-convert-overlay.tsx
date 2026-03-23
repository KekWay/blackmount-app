'use client'

import { useState } from 'react'
import { X, Wallet } from 'lucide-react'
import { motion } from 'motion/react'
import { IMG_COIN } from './profile-data'

export function ReferralConvertOverlay({ onClose }: { onClose: () => void }) {
  const [convertAmount, setConvertAmount] = useState('200')
  const [convertDone, setConvertDone] = useState(false)
  const convertedCoins = Math.round(parseFloat(convertAmount || '0') * 1.275)

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#181722] rounded-[24px] w-[460px] max-w-[90vw] overflow-hidden border border-[#888ae5]/20 shadow-[0_12px_48px_rgba(0,0,0,0.4)]" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {!convertDone ? (
          <div className="px-[32px] py-[32px]">
            <div className="flex items-center justify-between mb-[24px]">
              <p className="font-manrope font-bold text-[22px] text-white">Конвертация в айкоины</p>
              <button onClick={onClose} className="text-[rgba(255,255,255,0.4)] hover:text-white bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <div className="border border-[#888ae5]/30 bg-[#888ae5]/5 rounded-[16px] px-[20px] py-[16px] flex items-center gap-[16px] mb-[24px]">
              <div className="bg-[#888ae5]/20 p-[10px] rounded-[12px]"><Wallet size={20} className="text-[#888ae5]" /></div>
              <div><p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)]">Доступно для конвертации</p><p className="font-manrope font-black text-[20px] text-white">1000{'\u20BD'}</p></div>
            </div>
            <div className="mb-[20px]">
              <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Сумма ({'\u20BD'})</p>
              <input type="number" value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} placeholder="0 \u20BD" className="w-full bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] focus:border-[#888ae5] transition-colors rounded-[14px] px-[16px] py-[14px] font-manrope font-bold text-[16px] text-white placeholder-[#898787] outline-none" />
            </div>
            <div className="mb-[32px]">
              <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Вы получите</p>
              <div className="bg-[#121118]/80 border border-[#888ae5]/20 rounded-[14px] px-[16px] py-[14px] flex items-center gap-[10px]">
                <div className="relative shrink-0 size-[24px] drop-shadow-md"><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>
                <span className="font-manrope font-black text-[16px] text-white">{convertedCoins} <span className="font-medium text-[14px] text-[rgba(255,255,255,0.5)]">айкоинов</span></span>
              </div>
            </div>
            <button onClick={() => setConvertDone(true)} className="w-full bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[14px] py-[16px] cursor-pointer transition-colors shadow-[0_4px_16px_rgba(136,138,229,0.25)]"><span className="font-manrope font-bold text-[15px] text-white">Конвертировать</span></button>
          </div>
        ) : (
          <div className="px-[32px] py-[48px] flex flex-col items-center">
            <div className="bg-[#121118]/50 border border-[#6bc085]/20 rounded-[20px] px-[32px] py-[32px] flex flex-col items-center mb-[24px] w-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#6bc085]/10 blur-[50px] rounded-full" />
              <div className="flex gap-[8px] mb-[20px] relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">{[1,2,3].map((ii) => (<div key={ii} className={`relative size-[56px] ${ii === 2 ? 'scale-125 z-10 -mt-[10px]' : ''}`}><img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} /></div>))}</div>
              <p className="font-manrope font-black text-[22px] text-white mb-[8px] text-center relative z-10">Зачислено {convertedCoins} айкоинов</p>
              <p className="font-manrope font-medium text-[13px] text-[#6bc085] bg-[#6bc085]/10 px-[12px] py-[4px] rounded-full relative z-10">Конвертация прошла успешно!</p>
            </div>
            <button onClick={onClose} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-[14px] py-[14px] cursor-pointer transition-colors"><span className="font-manrope font-bold text-[14px] text-white">Закрыть</span></button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

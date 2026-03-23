'use client'

import { useState } from 'react'
import { X, Wallet, CreditCard, Zap, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

export function ReferralWithdrawOverlay({ onClose }: { onClose: () => void }) {
  const [withdrawDone, setWithdrawDone] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawCard, setWithdrawCard] = useState('')
  const [withdrawBank, setWithdrawBank] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'sbp'>('card')
  const router = useRouter()

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#19181e] rounded-[20px] w-[420px] max-w-[90vw] overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        {!withdrawDone ? (
          <div className="px-[32px] py-[28px]">
            <div className="flex items-center justify-between mb-[24px]">
              <p className="font-manrope font-extrabold text-[20px] text-white">Вывод средств</p>
              <button onClick={onClose} className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <div className="border-2 border-[#39375b] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] mb-[20px]">
              <Wallet size={20} className="text-[rgba(255,255,255,0.5)]" />
              <div><p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.5)]">Баланс</p><p className="font-manrope font-black text-[18px] text-white">1000{'\u20BD'}</p></div>
            </div>
            <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Введите сумму</p>
            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="От 500 руб" className="w-full bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] focus:border-[#888ae5] rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[18px]" />
            <div className="flex flex-col mb-[18px]">
              <button onClick={() => setWithdrawMethod('card')} className="flex items-center justify-between py-[12px] border-b border-white/5 cursor-pointer">
                <div className="flex items-center gap-[12px]"><CreditCard size={18} className="text-[rgba(255,255,255,0.5)]" /><span className="font-manrope font-bold text-[14px] text-white">Банковская карта</span></div>
                <div className={`size-[20px] rounded-full border-2 flex items-center justify-center ${withdrawMethod === 'card' ? 'border-[#888ae5] bg-[#888ae5]' : 'border-white/20'}`}>{withdrawMethod === 'card' && <Check size={10} className="text-white" />}</div>
              </button>
              <button onClick={() => setWithdrawMethod('sbp')} className="flex items-center justify-between py-[12px] cursor-pointer">
                <div className="flex items-center gap-[12px]"><Zap size={18} className="text-[rgba(255,255,255,0.5)]" /><span className="font-manrope font-bold text-[14px] text-white">СБП</span></div>
                <div className={`size-[20px] rounded-full border-2 flex items-center justify-center ${withdrawMethod === 'sbp' ? 'border-[#888ae5] bg-[#888ae5]' : 'border-white/20'}`}>{withdrawMethod === 'sbp' && <Check size={10} className="text-white" />}</div>
              </button>
            </div>
            <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Введите номер карты</p>
            <input value={withdrawCard} onChange={(e) => setWithdrawCard(e.target.value)} placeholder="0000 0000 0000 0000" className="w-full bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] focus:border-[#888ae5] rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[14px]" />
            <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Название банка</p>
            <input value={withdrawBank} onChange={(e) => setWithdrawBank(e.target.value)} placeholder="Сбербанк" className="w-full bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] focus:border-[#888ae5] rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[24px]" />
            <button onClick={() => setWithdrawDone(true)} className="w-full bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] py-[14px] cursor-pointer transition-colors"><span className="font-manrope font-extrabold text-[16px] text-white">Отправить заявку</span></button>
          </div>
        ) : (
          <div className="px-[32px] py-[40px] flex flex-col items-center">
            <div className="bg-[#121118]/80 rounded-[14px] px-[32px] py-[28px] flex flex-col items-center mb-[20px] w-full">
              <div className="text-[#38bdf8] mb-[14px]"><svg width="50" height="50" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              <p className="font-manrope font-extrabold text-[16px] text-white text-center mb-[12px] leading-[22px]">Заявка была успешно отправлена!</p>
              <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)] text-center leading-[18px] mb-[6px]">Обработка запроса занимает 24-72 часа</p>
              <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)] text-center leading-[18px]">Ответ будет прислан в чат бота</p>
            </div>
            <button onClick={() => { onClose(); router.push('/'); }} className="w-full bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] py-[12px] cursor-pointer transition-colors"><span className="font-manrope font-extrabold text-[14px] text-white">Вернуться в главное меню</span></button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

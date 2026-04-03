'use client'

import { useState } from 'react'
import { X, CreditCard, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1-')
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  let result = '+7'
  if (digits.length > 1) result += ' (' + digits.slice(1, 4)
  if (digits.length > 4) result += ') ' + digits.slice(4, 7)
  if (digits.length > 7) result += '-' + digits.slice(7, 9)
  if (digits.length > 9) result += '-' + digits.slice(9, 11)
  return result
}

function isCardValid(value: string): boolean {
  return value.replace(/\D/g, '').length === 16
}

function isPhoneValid(value: string): boolean {
  return value.replace(/\D/g, '').length === 11
}

export function ReferralWithdrawOverlay({ onClose }: { onClose: () => void }) {
  const [withdrawDone, setWithdrawDone] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawCard, setWithdrawCard] = useState('')
  const [withdrawPhone, setWithdrawPhone] = useState('')
  const [withdrawBank, setWithdrawBank] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'sbp'>('card')
  const router = useRouter()

  const isFormValid =
    withdrawAmount.trim() !== '' &&
    parseFloat(withdrawAmount) >= 500 &&
    withdrawBank.trim() !== '' &&
    (withdrawMethod === 'card' ? isCardValid(withdrawCard) : isPhoneValid(withdrawPhone))

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawCard(formatCardNumber(e.target.value))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const digits = raw.startsWith('7') ? raw : raw.startsWith('8') ? '7' + raw.slice(1) : '7' + raw
    setWithdrawPhone(formatPhone(digits))
  }

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#19181e] rounded-[20px] w-[420px] max-w-[90vw] overflow-hidden max-h-[90vh] overflow-y-auto chat-scrollbar shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        {!withdrawDone ? (
          <div className="px-[32px] py-[28px]">
            <div className="flex items-center justify-between mb-[24px]">
              <p className="font-manrope font-extrabold text-[20px] text-white">Вывод средств</p>
              <button onClick={onClose} className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <div className="rounded-[12px] px-[16px] py-[12px] flex items-center gap-[12px] mb-[20px] bg-[rgba(57,55,91,0.4)]">
              <img src={APP_ASSETS.wallet1} alt="" className="size-[20px] object-contain brightness-0 invert" />
              <div><p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.5)]">Баланс</p><p className="font-manrope font-black text-[18px] text-white">1000{'\u20BD'}</p></div>
            </div>
            <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Введите сумму</p>
            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="От 500 руб" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[18px]" />
            <div className="flex flex-col mb-[18px]">
              <button onClick={() => setWithdrawMethod('card')} className="flex items-center justify-between py-[12px] border-b border-white/5 cursor-pointer">
                <div className="flex items-center gap-[12px]"><CreditCard size={18} className="text-[rgba(255,255,255,0.5)]" /><span className="font-manrope font-bold text-[14px] text-white">Банковская карта</span></div>
                <div className={`size-[20px] rounded-full border-2 flex items-center justify-center ${withdrawMethod === 'card' ? 'border-[#888ae5] bg-[#888ae5]' : 'border-white/20'}`}>{withdrawMethod === 'card' && <Check size={10} className="text-white" />}</div>
              </button>
              <button onClick={() => setWithdrawMethod('sbp')} className="flex items-center justify-between py-[12px] cursor-pointer">
                <div className="flex items-center gap-[12px]"><img src={APP_ASSETS.sbpLogo} alt="СБП" className="size-[18px] object-contain" /><span className="font-manrope font-bold text-[14px] text-white">СБП</span></div>
                <div className={`size-[20px] rounded-full border-2 flex items-center justify-center ${withdrawMethod === 'sbp' ? 'border-[#888ae5] bg-[#888ae5]' : 'border-white/20'}`}>{withdrawMethod === 'sbp' && <Check size={10} className="text-white" />}</div>
              </button>
            </div>
            {withdrawMethod === 'card' ? (
              <>
                <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Номер карты</p>
                <input value={withdrawCard} onChange={handleCardChange} placeholder="0000-0000-0000-0000" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[14px]" />
              </>
            ) : (
              <>
                <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Номер телефона</p>
                <input value={withdrawPhone} onChange={handlePhoneChange} placeholder="+7 (___) ___-__-__" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[14px]" />
              </>
            )}
            <p className="font-manrope font-extrabold text-[15px] text-white mb-[8px]">Название банка</p>
            <input value={withdrawBank} onChange={(e) => setWithdrawBank(e.target.value)} placeholder="Сбербанк" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[10px] px-[16px] py-[12px] font-manrope font-medium text-[14px] text-white placeholder-[#898787] outline-none transition-colors mb-[24px]" />
            <button onClick={() => setWithdrawDone(true)} disabled={!isFormValid} className={`w-full rounded-[12px] py-[14px] transition-colors ${isFormValid ? 'bg-[#888ae5] hover:bg-[#9a9cf0] cursor-pointer' : 'bg-[rgba(136,138,229,0.3)] cursor-not-allowed'}`}><span className="font-manrope font-extrabold text-[16px] text-white">Отправить заявку</span></button>
          </div>
        ) : (
          <div className="px-[32px] py-[40px] flex flex-col items-center">
            <div className="bg-[#121118]/80 rounded-[14px] px-[32px] py-[28px] flex flex-col items-center mb-[20px] w-full">
              <div className="mb-[14px]"><img src={APP_ASSETS.rocketIcon} alt="" className="size-[50px] object-contain" /></div>
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

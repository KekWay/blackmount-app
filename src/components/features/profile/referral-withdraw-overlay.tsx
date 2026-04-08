'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { useReferralStore } from '@/stores/referral-store'

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

const WITHDRAW_MIN = 500
const WITHDRAW_BALANCE = 1000

export function ReferralWithdrawOverlay({ onClose }: { onClose: () => void }) {
  const [withdrawDone, setWithdrawDone] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawCard, setWithdrawCard] = useState('')
  const [withdrawPhone, setWithdrawPhone] = useState('')
  const [withdrawBank, setWithdrawBank] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'sbp'>('card')
  const router = useRouter()
  const createWithdrawal = useReferralStore((s) => s.createWithdrawal)

  const amount = parseFloat(withdrawAmount || '0')
  const amountTooLow = withdrawAmount.trim() !== '' && amount < WITHDRAW_MIN
  const amountTooHigh = withdrawAmount.trim() !== '' && amount > WITHDRAW_BALANCE

  const isFormValid =
    withdrawAmount.trim() !== '' &&
    amount >= WITHDRAW_MIN &&
    amount <= WITHDRAW_BALANCE &&
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
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#181722] rounded-[24px] w-[460px] max-w-[90vw] overflow-hidden max-h-[90vh] overflow-y-auto chat-scrollbar border border-[#888ae5]/20 shadow-[0_12px_48px_rgba(0,0,0,0.4)]" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {!withdrawDone ? (
          <div className="px-[32px] py-[32px]">
            <div className="flex items-center justify-between mb-[24px]">
              <p className="font-manrope font-bold text-[22px] text-white">Вывод средств</p>
              <button onClick={onClose} aria-label="Закрыть" className="group bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer"><Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" /></button>
            </div>
            <div className="border border-[#888ae5]/30 bg-[#888ae5]/5 rounded-[16px] px-[20px] py-[16px] flex items-center gap-[16px] mb-[24px]">
              <div className="bg-[#888ae5]/20 p-[10px] rounded-[12px]"><img src={APP_ASSETS.wallet1} alt="" className="size-[20px] object-contain brightness-0 invert" /></div>
              <div><p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)]">Доступно для вывода</p><p className="font-manrope font-black text-[20px] text-white">1000{'\u20BD'}</p></div>
            </div>
            <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Сумма ({'\u20BD'})</p>
            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder={`От ${WITHDRAW_MIN} руб`} className={`w-full bg-[rgba(57,55,91,0.5)] border rounded-[14px] px-[16px] py-[14px] font-manrope font-bold text-[16px] text-white placeholder-[#898787] outline-none transition-colors ${amountTooLow || amountTooHigh ? 'border-[#f87171]/50' : 'border-transparent'}`} />
            {amountTooLow && <p className="font-manrope text-[11px] text-[#f87171] mt-[6px]">Минимальная сумма — {WITHDRAW_MIN}{'\u20BD'}</p>}
            {amountTooHigh && <p className="font-manrope text-[11px] text-[#f87171] mt-[6px]">Максимальная сумма — {WITHDRAW_BALANCE}{'\u20BD'}</p>}
            <div className="mb-[20px]" />
            <div className="flex flex-col mb-[20px]">
              <button onClick={() => setWithdrawMethod('card')} className="flex items-center justify-between py-[12px] border-b border-white/5 cursor-pointer">
                <div className="flex items-center gap-[12px]"><CreditCard size={18} className="text-[rgba(255,255,255,0.5)]" /><span className="font-manrope font-bold text-[14px] text-white">Банковская карта</span></div>
                <div className={`size-[20px] rounded-full border-2 flex items-center justify-center ${withdrawMethod === 'card' ? 'border-[#888ae5] bg-[#888ae5]' : 'border-white/20'}`}>{withdrawMethod === 'card' && <CustomIcon src="/icons/chekmark_icon.png" size={10} />}</div>
              </button>
              <button onClick={() => setWithdrawMethod('sbp')} className="flex items-center justify-between py-[12px] cursor-pointer">
                <div className="flex items-center gap-[12px]"><img src={APP_ASSETS.sbpLogo} alt="СБП" className="size-[18px] object-contain" /><span className="font-manrope font-bold text-[14px] text-white">СБП</span></div>
                <div className={`size-[20px] rounded-full border-2 flex items-center justify-center ${withdrawMethod === 'sbp' ? 'border-[#888ae5] bg-[#888ae5]' : 'border-white/20'}`}>{withdrawMethod === 'sbp' && <CustomIcon src="/icons/chekmark_icon.png" size={10} />}</div>
              </button>
            </div>
            {withdrawMethod === 'card' ? (
              <>
                <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Номер карты</p>
                <input value={withdrawCard} onChange={handleCardChange} placeholder="0000-0000-0000-0000" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[14px] px-[16px] py-[14px] font-manrope font-bold text-[16px] text-white placeholder-[#898787] outline-none transition-colors mb-[14px]" />
              </>
            ) : (
              <>
                <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Номер телефона</p>
                <input value={withdrawPhone} onChange={handlePhoneChange} placeholder="+7 (___) ___-__-__" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[14px] px-[16px] py-[14px] font-manrope font-bold text-[16px] text-white placeholder-[#898787] outline-none transition-colors mb-[14px]" />
              </>
            )}
            <p className="font-manrope font-bold text-[13px] text-white mb-[8px]">Название банка</p>
            <input value={withdrawBank} onChange={(e) => setWithdrawBank(e.target.value)} placeholder="Сбербанк" className="w-full bg-[rgba(57,55,91,0.5)] border-none rounded-[14px] px-[16px] py-[14px] font-manrope font-bold text-[16px] text-white placeholder-[#898787] outline-none transition-colors mb-[32px]" />
            <button onClick={() => { const details = withdrawMethod === 'card' ? withdrawCard : withdrawPhone; createWithdrawal(amount, withdrawMethod, details); setWithdrawDone(true) }} disabled={!isFormValid} className={`w-full rounded-[14px] py-[16px] transition-colors shadow-[0_4px_16px_rgba(136,138,229,0.25)] ${isFormValid ? 'bg-[#888ae5] hover:bg-[#9a9cf0] cursor-pointer' : 'bg-[rgba(136,138,229,0.3)] cursor-not-allowed'}`}><span className="font-manrope font-bold text-[15px] text-white">Отправить заявку</span></button>
          </div>
        ) : (
          <div className="px-[32px] py-[48px] flex flex-col items-center">
            <div className="bg-[#121118]/50 rounded-[20px] px-[32px] py-[32px] flex flex-col items-center mb-[24px] w-full relative overflow-hidden">
              <div className="mb-[20px] relative z-10"><img src={APP_ASSETS.rocketIcon} alt="" className="size-[64px] object-contain" /></div>
              <p className="font-manrope font-black text-[22px] text-white mb-[8px] text-center relative z-10">Заявка создана</p>
              <p className="font-manrope font-medium text-[13px] text-[#f5a623] bg-[#f5a623]/10 px-[12px] py-[4px] rounded-full relative z-10 mb-[12px]">На проверке</p>
              <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)] text-center leading-[18px] relative z-10">Обычно обработка занимает до 24 часов</p>
            </div>
            <div className="flex flex-col gap-[8px] w-full">
              <button onClick={() => { onClose(); router.push('/support') }} className="w-full bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[14px] py-[14px] cursor-pointer transition-colors shadow-[0_4px_12px_rgba(136,138,229,0.25)]"><span className="font-manrope font-bold text-[14px] text-white">Написать в поддержку</span></button>
              <button onClick={onClose} className="w-full bg-white/5 hover:bg-white/10 rounded-[14px] py-[14px] cursor-pointer transition-colors"><span className="font-manrope font-bold text-[14px] text-white">Закрыть</span></button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

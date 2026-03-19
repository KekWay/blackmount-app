'use client'

import { X, Lock, Sparkles, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { APP_ASSETS } from '@/lib/assets'
import { getResetTimeString } from '@/stores/request-limiter'
import type { ModelVersion } from '@/types'

const imgXsCoin = APP_ASSETS.coin

interface ChatModalsProps {
  showLowBalance: boolean
  setShowLowBalance: (v: boolean) => void
  showLimitReached: boolean
  setShowLimitReached: (v: boolean) => void
  showAuthGate: boolean
  setShowAuthGate: (v: boolean) => void
  selectedVersion: ModelVersion
  dynamicCost: number
  balance: number
  hasSub: boolean
  dailyLimit: number
}

export function ChatModals({
  showLowBalance, setShowLowBalance,
  showLimitReached, setShowLimitReached,
  showAuthGate, setShowAuthGate,
  selectedVersion, dynamicCost, balance, hasSub, dailyLimit,
}: ChatModalsProps) {
  const router = useRouter()

  return (
    <>
      {/* Insufficient Balance Modal */}
      <AnimatePresence>
        {showLowBalance && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.65)] backdrop-blur-[6px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLowBalance(false)}
          >
            <motion.div
              className="bg-[#1a1a24] rounded-[24px] w-[420px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center pt-[32px] pb-[20px] px-[32px]">
                <div className="relative size-[56px] mb-[16px]">
                  <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
                  <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(199,168,45,0.15) 0%, transparent 70%)' }} />
                </div>
                <p className="font-['Inter',sans-serif] font-extrabold text-[20px] text-white mb-[6px]">Недостаточно айкоинов</p>
                <p className="font-['Inter',sans-serif] font-normal text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px] mb-[6px]">
                  Для запроса к <span className="text-white">{selectedVersion.label}</span> нужно <span className="text-white">{dynamicCost}</span> айкоинов.
                </p>
                <p className="font-['Inter',sans-serif] font-normal text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px]">
                  Ваш баланс: <span className="text-[#c7a82d]">{balance}</span> айкоинов
                </p>
              </div>
              <div className="flex flex-col gap-[8px] px-[32px] pb-[28px]">
                <button
                  onClick={() => { setShowLowBalance(false); router.push('/profile?tab=topup') }}
                  className="w-full h-[48px] rounded-[14px] cursor-pointer transition-colors flex items-center justify-center gap-[8px]"
                  style={{ backgroundImage: 'linear-gradient(90deg, rgba(187,170,76,0.5) 0%, rgba(199,168,45,0.8) 50%, rgba(187,170,76,0.5) 100%)' }}
                >
                  <img alt="" src={imgXsCoin} className="size-[18px] object-contain brightness-0 invert" />
                  <span className="font-['Inter',sans-serif] font-black text-[15px] text-white">Пополнить баланс</span>
                </button>
                <button
                  onClick={() => setShowLowBalance(false)}
                  className="w-full h-[42px] rounded-[12px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors"
                >
                  <span className="font-['Inter',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.5)]">Отмена</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Limit Reached Modal */}
      <AnimatePresence>
        {showLimitReached && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLimitReached(false)}
          >
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[8px]" />
            <motion.div
              className="relative w-[400px] overflow-hidden rounded-[20px]"
              initial={{ scale: 0.92, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#14131c', border: '1px solid rgba(136,138,229,0.12)', boxShadow: '0 0 0 1px rgba(136,138,229,0.06), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px rgba(136,138,229,0.06)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(136,138,229,0.4) 50%, transparent 95%)' }} />
              <div className="flex justify-end pt-[14px] pr-[14px]">
                <button onClick={() => setShowLimitReached(false)} className="size-[30px] rounded-[10px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.12)] flex items-center justify-center cursor-pointer transition-colors">
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
                    onClick={() => { setShowLimitReached(false); router.push('/profile?tab=subscription') }}
                    className="w-full h-[46px] rounded-[12px] cursor-pointer transition-all flex items-center justify-center gap-[8px] hover:brightness-110 active:scale-[0.98]"
                    style={{ background: '#888ae5', boxShadow: '0 2px 12px rgba(136,138,229,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }}
                  >
                    <Sparkles size={15} className="text-white" />
                    <span className="text-[14px] text-white font-bold">Оформить подписку</span>
                  </button>
                )}
                <button
                  onClick={() => setShowLimitReached(false)}
                  className="w-full h-[40px] rounded-[12px] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(136,138,229,0.08)] border border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors active:scale-[0.98]"
                >
                  <span className="text-[13px] text-[rgba(255,255,255,0.4)] font-medium">Понятно</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Gate Modal */}
      <AnimatePresence>
        {showAuthGate && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[6px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAuthGate(false)}
          >
            <motion.div
              className="relative rounded-[20px] p-[32px] max-w-[400px] w-[90vw]"
              style={{ background: '#1e1d2a', border: '1px solid rgba(136,138,229,0.15)' }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAuthGate(false)}
                className="absolute top-[12px] right-[12px] size-[32px] rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={14} className="text-[rgba(255,255,255,0.5)]" />
              </button>
              <div className="flex flex-col items-center text-center gap-[16px]">
                <div className="size-[56px] rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(136,138,229,0.2), rgba(136,138,229,0.05))' }}>
                  <Lock size={24} className="text-[#888ae5]" />
                </div>
                <div>
                  <p className="text-white text-[18px] mb-[6px] font-semibold">Войдите, чтобы генерировать</p>
                  <p className="text-[rgba(255,255,255,0.45)] text-[13px] leading-relaxed">
                    Вы можете просматривать чаты нейросетей, но для отправки запросов необходимо авторизоваться.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/auth')}
                  className="w-full py-[12px] rounded-[12px] text-white text-[14px] cursor-pointer transition-all hover:brightness-110 font-semibold"
                  style={{ background: 'linear-gradient(135deg, #888ae5, #6a6bc5)' }}
                >
                  Войти
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

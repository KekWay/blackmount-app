'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'

interface ModalAuthGateProps {
  show: boolean
  onClose: () => void
}

export function ModalAuthGate({ show, onClose }: ModalAuthGateProps) {
  const router = useRouter()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[6px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative rounded-[20px] p-[32px] max-w-[400px] w-[90vw]"
            style={{ background: '#1e1d2a', border: '1px solid rgba(136,138,229,0.15)' }}
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="group absolute top-[12px] right-[12px] bg-white/5 hover:bg-white/10 p-[8px] rounded-[10px] transition-colors cursor-pointer"
            >
              <Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
            </button>
            <div className="flex flex-col items-center text-center gap-[16px]">
              <div className="size-[56px] rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(136,138,229,0.2), rgba(136,138,229,0.05))' }}>
                <img src="/assets/models/padlock_icon.png" alt="" className="size-[24px] object-contain [filter:brightness(0)_saturate(100%)_invert(55%)_sepia(50%)_saturate(600%)_hue-rotate(210deg)]" />
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
  )
}

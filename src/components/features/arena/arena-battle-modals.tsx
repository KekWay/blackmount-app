'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

interface ArenaPromptOverlayProps {
  open: boolean
  currentPrompt: string
  onClose: () => void
}

export function ArenaPromptOverlay({ open, currentPrompt, onClose }: ArenaPromptOverlayProps) {
  return (
    <AnimatePresence>
      {open && currentPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-[40] flex items-start justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mt-[40px] mx-[20px] w-full max-w-[560px] max-h-[70%] rounded-[16px] bg-[#1e1b2e] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[18px] py-[12px]">
              <span className="text-[13px] text-[rgba(255,255,255,0.5)] font-medium">Ваш запрос</span>
              <button onClick={onClose} aria-label="Закрыть" className="group transition-colors cursor-pointer p-[4px] rounded-[6px] hover:bg-[rgba(255,255,255,0.06)]">
                <Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto chat-scrollbar px-[18px] py-[14px]">
              <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-[22px] whitespace-pre-wrap">{currentPrompt}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ArenaLeaveGuardModalProps {
  pendingHref: string | null
  onStay: () => void
  onLeave: () => void
}

export function ArenaLeaveGuardModal({ pendingHref, onStay, onLeave }: ArenaLeaveGuardModalProps) {
  return (
    <AnimatePresence>
      {pendingHref && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-[4px]"
          onClick={onStay}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-[380px] rounded-[16px] bg-[#1e1b2e] shadow-2xl p-[24px] flex flex-col items-center gap-[16px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-[45px]" style={{ backgroundColor: '#f87171', maskImage: "url('/assets/models/warning-arena.png')", WebkitMaskImage: "url('/assets/models/warning-arena.png')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
            <h3 className="text-[16px] text-white font-semibold text-center">Покинуть арену?</h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px]">
              Результаты текущей битвы будут потеряны. Вы уверены, что хотите уйти?
            </p>
            <div className="flex items-center gap-[10px] w-full mt-[4px]">
              <button onClick={onStay} className="flex-1 h-[40px] rounded-[10px] bg-[rgba(255,255,255,0.06)] text-[13px] text-[rgba(255,255,255,0.6)] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                Остаться
              </button>
              <button onClick={onLeave} className="flex-1 h-[40px] rounded-[10px] bg-[#dc2626] text-[13px] text-white font-medium hover:bg-[#ef4444] transition-colors cursor-pointer">
                Покинуть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

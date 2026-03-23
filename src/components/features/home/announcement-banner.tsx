'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: 'auto', opacity: 1, marginBottom: 20 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div
            className="relative rounded-[16px] px-[20px] py-[14px] flex items-center gap-[14px] overflow-hidden"
            style={{
              background: 'linear-gradient(177deg, rgba(136,138,229,0.12) 0%, rgba(107,72,207,0.08) 50%, rgba(136,138,229,0.06) 100%)',
              border: '0.8px solid rgba(136,138,229,0.18)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(136,138,229,0.5)] to-transparent" />

            <div className="absolute left-[-6px] top-[-20px] hidden sm:flex items-center justify-center w-[107px] h-[91px]">
              <div className="rotate-[-38.53deg]">
                <div className="bg-[rgba(136,138,229,0.2)] flex font-manrope font-bold h-[19px] items-center rounded-[6px] text-[10px] tracking-[0.4px] whitespace-nowrap overflow-hidden w-[122px]">
                  <div className="flex items-center gap-[16px]" style={{ animation: 'bannerMarquee 4s linear infinite' }}>
                    <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
                    <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
                    <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
                    <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 ml-0 sm:ml-[60px]">
              <p className="text-[13px] text-[rgba(255,255,255,0.85)] font-manrope leading-[19px] font-semibold">
                Добавлена модель <span className="text-white font-extrabold">ChatGPT 5.4</span> — новейшая версия с улучшенным рассуждением и скоростью
              </p>
            </div>

            <button
              onClick={() => router.push('/chat/chatgpt')}
              className="hidden sm:flex shrink-0 items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] text-[12px] text-white cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] font-manrope font-bold shadow-[0_2px_10px_rgba(136,138,229,0.35)]"
              style={{ background: 'linear-gradient(103.2deg, rgb(101,222,216) 8%, rgb(54,120,117) 100%)' }}
            >
              Попробовать
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss announcement"
              className="shrink-0 size-[28px] rounded-[8px] flex items-center justify-center text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

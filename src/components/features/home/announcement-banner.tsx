'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  if (dismissed) return null

  return (
    <div
      className="relative rounded-[20px] px-[40px] py-[14px] flex items-center gap-[14px] overflow-hidden mb-[24px]"
      style={{
        background: 'linear-gradient(90deg, rgba(136,138,229,0.08) 0%, rgba(101,222,216,0.06) 100%)',
        border: '1px solid rgba(136,138,229,0.12)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(136,138,229,0.4), transparent)',
        }}
      />

      {/* НОВОЕ badge */}
      <div className="absolute -left-[6px] -top-[20px] flex items-center justify-center w-[107px] h-[91px]">
        <div className="-rotate-[38deg]">
          <div className="bg-[rgba(136,138,229,0.2)] flex font-['Manrope',sans-serif] font-bold h-[19px] items-center rounded-[6px] text-[10px] tracking-wide whitespace-nowrap overflow-hidden w-[122px]">
            <div
              className="flex items-center gap-[16px]"
              style={{ animation: 'bannerMarquee 4s linear infinite' }}
            >
              <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
              <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
              <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
              <span className="text-[#65ded8] shrink-0">НОВОЕ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 ml-[60px]">
        <p className="text-[13px] text-[rgba(255,255,255,0.85)] font-['DM_Sans',sans-serif] font-semibold leading-[19px]">
          Добавлена модель{' '}
          <span className="text-white font-extrabold">ChatGPT 5.4</span> —{' '}
          новейшая версия с улучшенным рассуждением и скоростью
        </p>
      </div>

      <button
        onClick={() => router.push('/chat/chatgpt')}
        className="shrink-0 flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] text-[12px] text-white font-['DM_Sans',sans-serif] font-bold cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(90deg, #65ded8, #367875)',
          boxShadow: '0 2px 10px rgba(101,222,216,0.25)',
        }}
      >
        Попробовать
        <ArrowRight size={12} />
      </button>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Закрыть"
        className="shrink-0 w-[28px] h-[28px] rounded-[10px] flex items-center justify-center text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"
      >
        <X size={13} />
      </button>
    </div>
  )
}

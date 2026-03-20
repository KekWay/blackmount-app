'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { motion } from 'motion/react'
import { copyToClipboard } from '@/lib/utils'
import { REFERRAL_LINK, INVITE_CODE, type TierInfo } from './referral-data'

export function ReferralHero({ currentTier, nextTier, tierProgress }: {
  currentTier: TierInfo
  nextTier: TierInfo | undefined
  tierProgress: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyToClipboard(REFERRAL_LINK).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-[24px] relative bg-[#181722]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px]">
        <motion.div className="absolute w-[250px] h-[250px] rounded-full opacity-[0.08] blur-[80px] top-[-50px] right-[-50px] bg-[#888ae5]" animate={{ x: [0, -20, 10, 0], y: [0, 15, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.05] blur-[80px] bottom-[-20px] left-[10%] bg-white" animate={{ x: [0, 25, -15, 0], y: [0, -20, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
      <div className="relative z-[1] px-[32px] pt-[32px] pb-[28px]">
        <div className="flex items-start justify-between mb-[16px]">
          <div className="flex-1">
            <p className="font-manrope font-extrabold text-[28px] text-white leading-[34px] tracking-tight mb-[6px]">
              Приглашай друзей<br/><span style={{ color: currentTier.color }}>и получай бонусы</span>
            </p>
            <p className="font-manrope font-medium text-[14px] text-[rgba(255,255,255,0.6)] leading-[22px] max-w-[380px]">
              Получайте {currentTier.rate} с каждой покупки и подписки ваших друзей. Чем больше рефералов — тем выше процент вознаграждения.
            </p>
          </div>
          <motion.div className="shrink-0 flex flex-col items-center justify-center p-[16px] ml-[20px]" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <p className="font-manrope font-black text-[48px] leading-[48px] text-white" style={{ textShadow: `0 0 20px ${currentTier.color}22` }}>{currentTier.rate}</p>
            <p className="font-manrope font-bold text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.08em] mt-[8px]">Текущий бонус</p>
          </motion.div>
        </div>

        <ReferralLinkSection copied={copied} onCopy={handleCopy} />

        <div className="grid grid-cols-2 gap-[12px]">
          <ReferralTierButton currentTier={currentTier} nextTier={nextTier} tierProgress={tierProgress} />
          <div className="bg-[#121118]/50 rounded-[16px] px-[16px] py-[16px] flex flex-col justify-between">
            <p className="font-manrope font-bold text-[13px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.06em] mb-[8px]">Код приглашения</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="font-manrope font-black text-[18px] text-white tracking-[0.02em]">{INVITE_CODE}</p>
              <button onClick={handleCopy} className="text-[rgba(255,255,255,0.35)] hover:text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-[8px] rounded-[8px] transition-colors cursor-pointer"><Copy size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReferralLinkSection({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <div className="bg-[#121118]/50 rounded-[16px] px-[20px] py-[16px] mb-[16px]">
      <p className="font-manrope font-bold text-[13px] text-[rgba(255,255,255,0.6)] mb-[10px]">Ваша реферальная ссылка</p>
      <div className="flex items-center gap-[10px]">
        <div className="flex-1 bg-[rgba(255,255,255,0.03)] rounded-[10px] px-[14px] py-[10px] overflow-hidden">
          <p className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.7)] truncate">{REFERRAL_LINK}</p>
        </div>
        <button onClick={onCopy} className="rounded-[10px] px-[16px] py-[10px] flex items-center gap-[6px] cursor-pointer transition-all hover:brightness-110 shrink-0 shadow-[0_4px_12px_rgba(136,138,229,0.2)]" style={{ background: '#888ae5' }}>
          {copied ? <Check size={14} className="text-white" /> : <Copy size={14} className="text-white" />}
          <span className="font-manrope font-bold text-[13px] text-white">{copied ? 'Скопировано' : 'Копировать'}</span>
        </button>
      </div>
      <div className="flex items-center gap-[8px] mt-[16px]">
        <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.4)] mr-[6px]">Поделиться:</span>
        {[
          { label: 'Telegram', bg: '#2AABEE', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/></svg> },
          { label: 'VK', bg: '#4680C2', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.147-1.744-1.147-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.848 2.49 2.287 4.674 2.878 4.674.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.716-.576.716z"/></svg> },
          { label: 'Reddit', bg: '#FF4500', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 0-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg> },
        ].map((social, i) => (
          <motion.button key={i} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="size-[36px] rounded-[10px] flex items-center justify-center cursor-pointer transition-all" style={{ background: social.bg }}>
            {social.icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function ReferralTierButton({ currentTier, nextTier, tierProgress }: { currentTier: TierInfo; nextTier: TierInfo | undefined; tierProgress: number }) {
  return (
    <div className="bg-[#121118]/50 rounded-[16px] px-[16px] py-[16px] text-left w-full relative overflow-hidden group">
      <div className="flex items-center gap-[10px] mb-[10px] relative z-10">
        <div className="size-[24px] flex items-center justify-center">{currentTier.icon}</div>
        <span className="font-manrope font-bold text-[13px] uppercase tracking-[0.06em]" style={{ color: currentTier.color }}>Уровень: {currentTier.label}</span>
      </div>
      {nextTier && (
        <div className="relative z-10 mt-[16px]">
          <div className="h-[4px] bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden mb-[6px]">
            <motion.div className="h-full rounded-full" style={{ background: currentTier.color }} initial={{ width: 0 }} animate={{ width: `${tierProgress}%` }} transition={{ duration: 1.2 }} />
          </div>
          <p className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.4)]">12/{nextTier.minRefs} до {nextTier.label} ({nextTier.rate})</p>
        </div>
      )}
    </div>
  )
}

'use client'

import { APP_ASSETS } from '@/lib/assets'

export function AuthSocialButtons() {
  return (
    <div className="flex flex-col gap-[6px]">
      <SocialButton icon={<GoogleIcon />} label="Продолжить с Google" />
      <SocialButton icon={<YandexIcon />} label="Продолжить с Яндекс" />
      <SocialButton icon={<VKIcon />} label="Продолжить с VK" />
      <SocialButton icon={<TelegramIcon />} label="Продолжить с Telegram" />
    </div>
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#222228] rounded-[20px] h-[36px] 2xl:h-[42px] px-[14px] flex items-center justify-center gap-[10px] cursor-pointer transition-all overflow-hidden" aria-label={label}>
      <span className="shrink-0 flex items-center justify-center size-[20px] 2xl:size-[22px]">
        {icon}
      </span>
      <span className="font-manrope font-medium text-[11px] 2xl:text-[13px] text-white">{label}</span>
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="shrink-0">
      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.001-.001 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
    </svg>
  )
}

function YandexIcon() {
  return (
    <div className="relative shrink-0 size-[22px] overflow-hidden rounded-[2px]">
      <img alt="Yandex" src={APP_ASSETS.yandex} className="absolute h-[188%] left-[-118%] max-w-none top-[-44%] w-[333%]" />
    </div>
  )
}

function VKIcon() {
  return (
    <div className="relative shrink-0 size-[22px] overflow-hidden rounded-[2px]">
      <img alt="VK" src={APP_ASSETS.vk} className="absolute h-[140%] left-[-74%] max-w-none top-[-20%] w-[248%]" />
    </div>
  )
}

function TelegramIcon() {
  return (
    <img alt="Telegram" src={APP_ASSETS.telegram} className="w-[22px] h-[22px] shrink-0 object-contain" style={{ imageRendering: 'auto' }} />
  )
}

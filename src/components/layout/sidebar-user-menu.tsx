'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Users, LogOut, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'

interface SidebarUserMenuProps {
  collapsed: boolean
  hasActiveSub: boolean
  onClose: () => void
}

const PROFILE_MASK = '/assets/models/profile-mask.png'
const HEADPHONES_MASK = '/assets/models/headphones-mask.png'
const COIN_IMG = '/assets/models/coin-large.png'

export function SidebarUserMenu({ collapsed, hasActiveSub, onClose }: SidebarUserMenuProps) {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const go = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`absolute bottom-full mb-2 rounded-[14px] overflow-hidden z-50 ${
        collapsed ? 'left-1 w-[200px]' : 'left-0 right-0'
      }`}
      style={{
        backgroundColor: '#1e1d2a',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <MenuItem onClick={() => go('/profile')} icon={<MaskIcon src={PROFILE_MASK} />} label="Профиль" />

      {hasActiveSub ? (
        <MenuItem onClick={() => go('/subscription')} icon={<Image src={APP_ASSETS.logo} alt="" width={15} height={15} className="opacity-60" />} label="Обновить подписку" />
      ) : (
        <SubscribeItem onClick={() => go('/subscription')} />
      )}

      <TopupItem onClick={() => go('/profile?tab=topup')} />

      <MenuItem onClick={() => go('/profile?tab=referral')} icon={<Users size={15} className="text-white/50" />} label="Реферальная программа" />

      <MenuItem onClick={onClose} icon={<MaskIcon src={HEADPHONES_MASK} />} label="Поддержка" />

      <div className="my-1 border-t border-white/[0.06]" />

      <button
        onClick={() => { logout(); router.push('/auth'); onClose() }}
        className="w-full flex items-center gap-2.5 px-4 py-[11px] hover:bg-[rgba(220,60,60,0.12)] transition-colors cursor-pointer text-left"
      >
        <LogOut size={15} className="text-[rgba(255,100,100,0.6)]" />
        <span className="font-medium text-[13px] text-[rgba(255,100,100,0.7)]">Выйти</span>
      </button>
    </motion.div>
  )
}

function MenuItem({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-[11px] transition-colors cursor-pointer text-left text-white/80 hover:bg-[rgba(136,138,229,0.1)]"
    >
      <span className="shrink-0">{icon}</span>
      <span className="font-medium text-[13px]">{label}</span>
    </button>
  )
}

function MaskIcon({ src }: { src: string }) {
  return (
    <span
      className="shrink-0 w-[15px] h-[15px] block"
      style={{
        backgroundColor: 'rgba(255,255,255,0.5)',
        maskImage: `url('${src}')`,
        WebkitMaskImage: `url('${src}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

function SubscribeItem({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-[11px] cursor-pointer text-left relative overflow-hidden group/sub"
      style={{ background: 'linear-gradient(90deg, rgba(136,138,229,0.08) 0%, rgba(168,90,220,0.12) 100%)' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover/sub:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, rgba(136,138,229,0.15) 0%, rgba(168,90,220,0.2) 100%)' }} />
      <span className="relative text-[#a8a9f0]"><Sparkles size={15} /></span>
      <span className="relative font-semibold text-[13px] text-[#c4b5fd]">Оформить подписку</span>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(136,138,229,0.3), transparent)' }} />
    </button>
  )
}

function TopupItem({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className="w-full flex items-center gap-2.5 px-4 py-[11px] cursor-pointer text-left transition-colors hover:bg-white/[0.04]"
    >
      <span className="shrink-0">
        <Image src={COIN_IMG} alt="" width={15} height={15} className="object-cover" />
      </span>
      <span className="font-semibold text-[13px] text-[#e8d476]">Пополнить баланс</span>
    </button>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { Globe, Moon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

export function SettingsSection() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-white/50" />
          <span className="text-sm text-white">Язык</span>
        </div>
        <span className="text-sm text-white/50">Русский</span>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Moon className="h-5 w-5 text-white/50" />
          <span className="text-sm text-white">Тема</span>
        </div>
        <span className="text-sm text-white/50">Тёмная</span>
      </div>

      <button
        onClick={handleLogout}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
      >
        <img src="/assets/models/logout_icon.png" alt="" width={16} height={16} className="[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]" />
        Выйти из аккаунта
      </button>
    </div>
  )
}

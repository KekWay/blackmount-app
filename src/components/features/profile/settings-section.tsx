'use client'

import { useRouter } from 'next/navigation'
import { Globe, Moon, LogOut } from 'lucide-react'
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
        <LogOut className="h-4 w-4" />
        Выйти из аккаунта
      </button>
    </div>
  )
}

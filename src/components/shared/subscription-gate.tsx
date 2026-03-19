'use client'

import { useRouter } from 'next/navigation'
import { Lock, Sparkles, X } from 'lucide-react'

interface SubscriptionGateModalProps {
  open: boolean
  onClose: () => void
  modelName: string
}

export function SubscriptionGateModal({ open, onClose, modelName }: SubscriptionGateModalProps) {
  const router = useRouter()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-[400px] overflow-hidden rounded-[20px] bg-[#14131c] border border-primary/[0.12] shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="flex justify-end pt-3.5 pr-3.5">
          <button onClick={onClose} className="size-[30px] rounded-xl bg-white/[0.04] hover:bg-primary/[0.12] flex items-center justify-center cursor-pointer transition-colors">
            <X size={14} className="text-white/35" />
          </button>
        </div>

        <div className="flex flex-col items-center px-9 pb-6">
          <div className="relative mb-5">
            <div className="absolute -inset-3 rounded-full opacity-40 blur-[20px] bg-[radial-gradient(circle,rgba(136,138,229,0.5),transparent_70%)]" />
            <div className="relative size-[60px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/[0.12] to-[rgba(91,91,214,0.08)] border border-primary/15">
              <Lock size={24} className="text-primary" />
            </div>
          </div>

          <p className="text-lg text-white font-bold mb-2 text-center">Доступно по подписке</p>
          <p className="text-[13px] text-white/45 text-center leading-5 mb-1">
            Модель <span className="text-[#c4b5fd] font-semibold">{modelName}</span> доступна только для пользователей с подпиской Pro или Ultra.
          </p>
          <p className="text-[11px] text-white/20 text-center leading-[17px]">
            Оформите подписку для доступа ко всем премиум-моделям.
          </p>
        </div>

        <div className="flex flex-col gap-2 px-9 pb-7">
          <button
            onClick={() => { onClose(); router.push('/subscription') }}
            className="w-full h-[46px] rounded-xl bg-primary hover:brightness-110 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(136,138,229,0.3)]"
          >
            <Sparkles size={15} />
            Оформить подписку
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-white/[0.03] hover:bg-primary/[0.08] border border-white/[0.06] text-[13px] text-white/40 font-medium cursor-pointer transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

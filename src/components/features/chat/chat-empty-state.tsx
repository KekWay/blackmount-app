'use client'

import { useRouter } from 'next/navigation'
import { Lock, Sparkles } from 'lucide-react'
import type { AIModel } from '@/types'

interface ChatEmptyStateProps {
  model: AIModel
  modelLocked: boolean
  greeting: string
}

export function ChatEmptyState({ model, modelLocked, greeting }: ChatEmptyStateProps) {
  const router = useRouter()

  if (modelLocked) {
    return (
      <div className="flex flex-col items-center gap-[16px] text-center">
        <div className="size-[56px] rounded-full flex items-center justify-center bg-[rgba(136,138,229,0.12)]">
          <Lock size={24} className="text-[#a8a9f0]" />
        </div>
        <div className="flex flex-col gap-[6px]">
          <p className="font-manrope font-semibold text-[18px] text-white">{model.name} доступна по подписке</p>
          <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.4)] max-w-[320px]">Оформите подписку BLACK MOUNT PRO, чтобы получить доступ к этой и другим премиум-моделям</p>
        </div>
        <button
          onClick={() => router.push('/profile?tab=subscription')}
          className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[12px] cursor-pointer transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, rgba(136,138,229,0.3), rgba(168,90,220,0.3))', border: '1px solid rgba(136,138,229,0.25)' }}
        >
          <Sparkles size={14} className="text-[#c4b5fd]" />
          <span className="font-manrope font-semibold text-[13px] text-[#c4b5fd]">Оформить подписку</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <p
        className="font-manrope font-semibold leading-[40px] text-[30px] relative z-[1] bg-clip-text text-transparent"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(200,200,220,0.7), rgba(255,255,255,0.9))',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s ease-in-out infinite',
        }}
      >
        {greeting}
      </p>
      <style>{`@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
    </>
  )
}

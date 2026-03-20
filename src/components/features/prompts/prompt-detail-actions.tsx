'use client'

import { Heart, Download, ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { aiModels } from '@/data/ai-models'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import type { PromptItem } from './prompts-data'

interface PromptDetailActionsProps {
  item: PromptItem
  selectedModelId: string
  saved: boolean
  onToggleSave: () => void
  onGate: (modelName: string) => void
}

export function PromptDetailActions({ item, selectedModelId, saved, onToggleSave, onGate }: PromptDetailActionsProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const isModelLocked = useSubscriptionStore((s) => s.isModelLocked)

  return (
    <div className="px-[20px] pb-[20px] pt-[8px] flex flex-col gap-[8px] border-t border-[rgba(255,255,255,0.06)]">
      {/* Apply / Generate button */}
      <button
        onClick={() => {
          if (!isLoggedIn) { router.push('/auth'); return }
          if (isModelLocked(selectedModelId)) {
            const mdl = aiModels.find(m => m.id === selectedModelId)
            onGate(mdl?.name || selectedModelId)
            return
          }
          router.push(`/chat/${selectedModelId}?prompt=${encodeURIComponent(item.prompt)}`)
        }}
        className="w-full bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] py-[12px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors"
      >
        <ArrowUpRight size={18} className="text-white" />
        <span className="text-[14px] text-white font-semibold">Применить</span>
      </button>
      {/* Save + Download row */}
      <div className="flex gap-[8px]">
        <button
          onClick={onToggleSave}
          className={`flex-1 flex items-center justify-center gap-[6px] rounded-[10px] py-[10px] transition-colors cursor-pointer border ${
            saved
              ? 'bg-[#39375b] border-[rgba(136,138,229,0.25)] text-white'
              : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(136,138,229,0.08)] text-white'
          }`}
        >
          <Heart size={14} fill={saved ? '#888ae5' : 'none'} />
          <span className="text-[13px]">{saved ? 'Сохранено' : 'Сохранить'}</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)] border border-[rgba(255,255,255,0.06)] rounded-[10px] py-[10px] transition-colors cursor-pointer">
          <Download size={14} className="text-white" />
          <span className="text-[13px] text-white">Скачать</span>
        </button>
      </div>
    </div>
  )
}

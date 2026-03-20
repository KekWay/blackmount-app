'use client'

import { useState } from 'react'
import { Heart, X, Play, Share2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { SubscriptionGateModal } from '@/components/shared/subscription-gate'
import type { PromptItem } from './prompts-data'
import { ShareModal } from './share-modal'
import { PromptDetailInfo } from './prompt-detail-info'
import { PromptDetailActions } from './prompt-detail-actions'
import { Info } from 'lucide-react'

interface PromptDetailModalProps {
  item: PromptItem
  onClose: () => void
}

export function PromptDetailModal({ item, onClose }: PromptDetailModalProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [saved, setSaved] = useState(() => {
    try { const favs: number[] = JSON.parse(localStorage.getItem('promptFavs') || '[]'); return favs.includes(item.id) } catch { return false }
  })
  const [selectedModelId, setSelectedModelId] = useState(item.modelId)
  const [shareOpen, setShareOpen] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [gateModelName, setGateModelName] = useState('')

  const toggleSave = () => {
    if (!isLoggedIn) { router.push('/auth'); return }
    try {
      const favs: number[] = JSON.parse(localStorage.getItem('promptFavs') || '[]')
      const next = saved ? favs.filter((id) => id !== item.id) : [...favs, item.id]
      localStorage.setItem('promptFavs', JSON.stringify(next))
      setSaved(!saved)
      window.dispatchEvent(new Event('promptFavsChanged'))
    } catch { /* noop */ }
  }

  const handleGate = (modelName: string) => {
    setGateModelName(modelName)
    setGateOpen(true)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-[8px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex gap-[16px] max-w-[1100px] w-[95vw] max-h-[85vh] items-stretch"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image/Video */}
        <div className="flex-1 min-w-0 bg-[#111018] flex items-center justify-center relative rounded-[20px] overflow-hidden">
          <img alt="" className="w-full h-full object-cover max-h-[85vh]" src={item.src} />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[rgba(0,0,0,0.45)] rounded-full size-[56px] flex items-center justify-center backdrop-blur-[6px] border border-[rgba(255,255,255,0.1)]">
                <Play size={24} className="text-white ml-[2px]" fill="white" />
              </div>
            </div>
          )}
          <button
            onClick={toggleSave}
            className={`absolute top-[16px] right-[16px] backdrop-blur-[6px] rounded-[10px] size-[38px] flex items-center justify-center cursor-pointer transition-all border ${
              saved
                ? 'bg-[#39375b] border-[rgba(136,138,229,0.3)]'
                : 'bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.08)] hover:bg-[rgba(136,138,229,0.15)]'
            }`}
          >
            <Heart size={18} className="text-white" fill={saved ? 'white' : 'none'} />
          </button>
        </div>

        {/* Right: Info Panel */}
        <div className="w-[360px] shrink-0 flex flex-col bg-[#19181e] rounded-[20px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-[20px] pt-[20px] pb-[14px]">
            <div className="flex items-center gap-[8px]">
              <Info size={16} className="text-[#888ae5]" />
              <span className="text-[14px] text-white">Детали промпта</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <button onClick={() => setShareOpen(true)} className="flex items-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)] rounded-[8px] px-[10px] py-[6px] transition-colors cursor-pointer">
                <Share2 size={13} className="text-white/50" />
                <span className="text-[12px] text-[rgba(255,255,255,0.5)]">Поделиться</span>
              </button>
              <button onClick={onClose} className="bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)] rounded-[8px] size-[30px] flex items-center justify-center cursor-pointer transition-colors">
                <X size={14} className="text-[rgba(255,255,255,0.5)]" />
              </button>
            </div>
          </div>
          <div className="h-px bg-[rgba(255,255,255,0.06)]" />
          <PromptDetailInfo
            item={item}
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
            onGate={handleGate}
          />
          <PromptDetailActions
            item={item}
            selectedModelId={selectedModelId}
            saved={saved}
            onToggleSave={toggleSave}
            onGate={handleGate}
          />
        </div>
      </motion.div>

      {shareOpen && <ShareModal item={item} onClose={() => setShareOpen(false)} />}
      <SubscriptionGateModal open={gateOpen} onClose={() => setGateOpen(false)} modelName={gateModelName} />
    </motion.div>
  )
}

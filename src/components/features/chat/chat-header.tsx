'use client'

import { useRouter } from 'next/navigation'
import { Pin, PinOff, Plus, X, Sparkles } from 'lucide-react'
import { APP_ASSETS } from '@/lib/assets'
import { VersionDropdown } from './version-dropdown'
import type { AIModel, ModelVersion } from '@/types'

const imgShareMask = '/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png'
const imgFreeIconSetting = APP_ASSETS.settings

function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgShareMask}')`, WebkitMaskImage: `url('${imgShareMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

interface ChatHeaderProps {
  model: AIModel
  selectedVersion: ModelVersion
  onSelectVersion: (v: ModelVersion) => void
  isPinned: boolean
  togglePin: () => void
  hasSub: boolean
  subBannerDismissed: boolean
  setSubBannerDismissed: (v: boolean) => void
  handleNewChat: () => void
  setShareOpen: (v: boolean) => void
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
}

export function ChatHeader({
  model, selectedVersion, onSelectVersion,
  isPinned, togglePin, hasSub, subBannerDismissed, setSubBannerDismissed,
  handleNewChat, setShareOpen, settingsOpen, setSettingsOpen,
}: ChatHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between pt-[24px] pb-[8px] px-[40px] shrink-0 relative z-[20]">
      <div className="flex items-center gap-[8px]">
        <VersionDropdown
          currentModel={model}
          selectedVersion={selectedVersion}
          onSelectVersion={onSelectVersion}
        />
        <button
          onClick={togglePin}
          className={`p-[7px] rounded-[10px] transition-all cursor-pointer ${isPinned ? 'bg-[rgba(136,138,229,0.15)] text-white' : 'text-[rgba(255,255,255,0.4)] hover:bg-[rgba(136,138,229,0.12)] hover:text-white'}`}
          title={isPinned ? 'Открепить чат' : 'Закрепить чат'}
        >
          {isPinned ? <PinOff size={15} /> : <Pin size={15} />}
        </button>
      </div>

      {!hasSub && !subBannerDismissed && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center z-[2]">
          <button
            onClick={() => router.push('/profile?tab=subscription')}
            className="flex items-center gap-[6px] px-[14px] py-[6px] rounded-full cursor-pointer transition-all hover:brightness-110 group/pill"
            style={{ background: 'linear-gradient(135deg, #5b5bd6, #7c5cbf)', boxShadow: '0 2px 12px rgba(91,91,214,0.35)' }}
          >
            <Sparkles size={12} className="text-white" />
            <span className="font-manrope font-semibold text-[12px] text-white whitespace-nowrap">Оформить подписку</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSubBannerDismissed(true) }}
            className="ml-[4px] size-[24px] rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <X size={12} className="text-[rgba(255,255,255,0.4)]" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-[10px]">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-[6px] cursor-pointer rounded-[12px] px-[14px] py-[7px] transition-all hover:bg-[rgba(136,138,229,0.12)]"
        >
          <Plus size={14} className="text-[rgba(255,255,255,0.6)]" />
          <p className="font-manrope font-medium leading-[20px] text-[13px] text-white">Новый чат</p>
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="rounded-[12px] size-[34px] flex items-center justify-center cursor-pointer transition-all hover:bg-[rgba(136,138,229,0.12)]"
          title="Поделиться"
        >
          <ShareIcon size={15} className="text-[rgba(255,255,255,0.5)]" />
        </button>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`rounded-[12px] size-[34px] flex items-center justify-center cursor-pointer transition-all ${settingsOpen ? 'bg-[rgba(136,138,229,0.2)]' : 'hover:bg-[rgba(136,138,229,0.12)]'}`}
          title="Настройки модели"
        >
          <img alt="" className={`max-w-none object-cover pointer-events-none size-[16px] ${settingsOpen ? 'opacity-80' : 'opacity-50'}`} src={imgFreeIconSetting} />
        </button>
      </div>
    </div>
  )
}

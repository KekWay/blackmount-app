'use client'

import { useRouter } from 'next/navigation'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'
import { APP_ASSETS } from '@/lib/assets'
import { ShareIcon } from '@/components/shared/icons'
import { VersionDropdown } from './version-dropdown'
import type { AIModel, ModelVersion } from '@/types'

const imgFreeIconSetting = APP_ASSETS.settings

interface ChatHeaderProps {
  model: AIModel
  selectedVersion: ModelVersion
  onSelectVersion: (v: ModelVersion) => void
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
  hasSub, subBannerDismissed, setSubBannerDismissed,
  handleNewChat, setShareOpen, settingsOpen, setSettingsOpen,
}: ChatHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between pt-[12px] md:pt-[24px] pb-[8px] px-[12px] md:px-[24px] lg:px-[40px] shrink-0 relative z-[20]">
      <div className="flex items-center gap-[6px] md:gap-[8px] min-w-0">
        <button
          onClick={() => router.back()}
          className="md:hidden shrink-0 size-[32px] flex items-center justify-center rounded-[8px] text-white/50 hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Назад"
        >
          <CustomIcon src="/icons/litle_arrow_left.png" size={20} className="opacity-50" />
        </button>
        <VersionDropdown
          currentModel={model}
          selectedVersion={selectedVersion}
          onSelectVersion={onSelectVersion}
        />
      </div>

      {!hasSub && !subBannerDismissed && (
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center z-[2]">
          <button
            onClick={() => router.push('/profile?tab=subscription')}
            className="flex items-center gap-[6px] px-[14px] py-[6px] rounded-full cursor-pointer transition-all hover:brightness-110 group/pill"
            style={{ background: 'linear-gradient(135deg, #5b5bd6, #7c5cbf)', boxShadow: '0 2px 12px rgba(91,91,214,0.35)' }}
          >
            <Image src="/assets/models/stars_icon_2.png" alt="" width={12} height={12} className="brightness-0 invert" />
            <span className="font-manrope font-semibold text-[12px] text-white whitespace-nowrap">Оформить подписку</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSubBannerDismissed(true) }}
            aria-label="Закрыть"
            className="group ml-[4px] size-[24px] rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <Image src="/icons/close_icon.png" alt="" width={9} height={9} className="invert opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-[10px]">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-[6px] cursor-pointer rounded-[12px] px-[14px] py-[7px] transition-all hover:bg-[rgba(136,138,229,0.12)]"
        >
          <Image src="/icons/plus_icon.png" alt="" width={8} height={8} className="brightness-0 invert opacity-60" />
          <p className="font-manrope font-medium leading-[20px] text-[13px] text-white hidden sm:block">Новый чат</p>
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

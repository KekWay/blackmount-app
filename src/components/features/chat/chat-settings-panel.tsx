'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import type { AIModel, ModelVersion } from '@/types'
import { getBasePrice } from '@/types/models'
import { SettingsText } from './settings-text'
import { SettingsImage, SettingsVideo } from './settings-media'
import { ChatSettingsDeleteConfirm } from './chat-settings-delete-confirm'

const imgXsCoin = APP_ASSETS.coin

interface ChatSettingsPanelProps {
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
  model: AIModel
  selectedVersion: ModelVersion
  isTextModel: boolean
  systemPrompt: string
  setSystemPrompt: (v: string) => void
  toneSetting: string
  setToneSetting: (v: string) => void
  aspectRatio: string
  setAspectRatio: (v: string) => void
  quality: string
  setQuality: (v: string) => void
  imageCount: number
  setImageCount: (v: number) => void
  videoDuration: string
  setVideoDuration: (v: string) => void
  audioEnabled: boolean
  setAudioEnabled: (v: boolean) => void
  dynamicCost: number
  messagesLength: number
  handleNewChat: () => void
}

export function ChatSettingsPanel({
  settingsOpen, setSettingsOpen, model, selectedVersion, isTextModel,
  systemPrompt, setSystemPrompt, toneSetting, setToneSetting,
  aspectRatio, setAspectRatio, quality, setQuality,
  imageCount, setImageCount, videoDuration, setVideoDuration,
  audioEnabled, setAudioEnabled, dynamicCost, messagesLength, handleNewChat,
}: ChatSettingsPanelProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  return (
    <>
    <AnimatePresence>
      {settingsOpen && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-start justify-end"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSettingsOpen(false)}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <motion.div
            className="relative bg-[#19181e] rounded-[20px] w-[280px] mt-[60px] mr-[16px] shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[20px] pt-[20px] pb-[12px]">
              <p className="font-manrope font-bold text-[18px] text-white">Настройки модели</p>
              <button
                onClick={() => setSettingsOpen(false)}
                aria-label="Закрыть"
                className="group size-[28px] rounded-full bg-[rgba(57,55,91,0.6)] flex items-center justify-center cursor-pointer hover:bg-[rgba(57,55,91,0.9)] transition-colors"
              >
                <Image src="/icons/close_icon.png" alt="" width={9} height={9} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
              </button>
            </div>

            <div className="px-[20px] pb-[20px]">
              {isTextModel ? (
                <SettingsText
                  systemPrompt={systemPrompt}
                  setSystemPrompt={setSystemPrompt}
                  toneSetting={toneSetting}
                  setToneSetting={setToneSetting}
                />
              ) : model.category === 'image' ? (
                <SettingsImage
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  quality={quality}
                  setQuality={setQuality}
                  imageCount={imageCount}
                  setImageCount={setImageCount}
                  selectedVersion={selectedVersion}
                />
              ) : (
                <SettingsVideo
                  model={model}
                  selectedVersion={selectedVersion}
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  videoDuration={videoDuration}
                  setVideoDuration={setVideoDuration}
                  audioEnabled={audioEnabled}
                  setAudioEnabled={setAudioEnabled}
                />
              )}

              {!isTextModel && (
                <div className="mt-[20px] bg-[rgba(136,138,229,0.06)] rounded-[12px] p-[14px] border border-[rgba(136,138,229,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.4)]">Стоимость генерации</span>
                    <div className="flex items-center gap-[4px]">
                      <span className="font-manrope font-bold text-[18px] text-white">{dynamicCost}</span>
                      <div className="relative shrink-0 size-[14px]">
                        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
                      </div>
                    </div>
                  </div>
                  {getBasePrice(selectedVersion.price || 5) !== dynamicCost && (
                    <div className="flex items-center justify-between mt-[6px]">
                      <span className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.25)]">Базовая цена</span>
                      <span className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.25)] line-through">{getBasePrice(selectedVersion.price || 5)}</span>
                    </div>
                  )}
                </div>
              )}

              {isTextModel && messagesLength > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-[8px] w-full mt-[24px] py-[10px] rounded-[12px] cursor-pointer transition-colors hover:bg-[rgba(189,70,70,0.1)]"
                >
                  <Image src="/assets/models/trash_icon.png" alt="" width={15} height={15} className="[filter:brightness(0)_saturate(100%)_invert(38%)_sepia(60%)_saturate(700%)_hue-rotate(330deg)_brightness(90%)]" />
                  <span className="font-manrope font-semibold text-[14px] text-[#bd4646]">удалить чат</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <ChatSettingsDeleteConfirm
      show={showDeleteConfirm}
      onCancel={() => setShowDeleteConfirm(false)}
      onConfirm={() => { handleNewChat(); setSettingsOpen(false); setShowDeleteConfirm(false) }}
    />
    </>
  )
}

'use client'

import { X, ChevronDown, Plus, Minus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import type { AIModel, ModelVersion } from '@/types'

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
  return (
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
              <p className="font-['Inter',sans-serif] font-bold text-[18px] text-white">Настройки модели</p>
              <button
                onClick={() => setSettingsOpen(false)}
                className="size-[28px] rounded-full bg-[rgba(57,55,91,0.6)] flex items-center justify-center cursor-pointer hover:bg-[rgba(57,55,91,0.9)] transition-colors"
              >
                <X size={12} className="text-[rgba(255,255,255,0.5)]" />
              </button>
            </div>

            <div className="px-[20px] pb-[20px]">
              {isTextModel ? (
                <div className="flex flex-col gap-[16px]">
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Системный промпт</p>
                    <textarea
                      className="w-full bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[10px] text-[12px] text-white placeholder-[rgba(166,166,166,0.6)] outline-none resize-none font-['Inter',sans-serif]"
                      rows={4}
                      placeholder="Напишите пользовательскую инструкцию для ИИ"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Стиль и тон</p>
                    <div className="relative">
                      <select
                        value={toneSetting}
                        onChange={(e) => setToneSetting(e.target.value)}
                        className="w-full appearance-none bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-['Inter',sans-serif]"
                      >
                        <option value="default">по умолчанию</option>
                        <option value="formal">формальный</option>
                        <option value="friendly">дружелюбный</option>
                        <option value="concise">краткий</option>
                        <option value="creative">креативный</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : model.category === 'image' ? (
                <div className="flex flex-col gap-[16px]">
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Соотношение сторон</p>
                    <div className="relative">
                      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full appearance-none bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-['Inter',sans-serif]">
                        <option value="1:1">1:1</option>
                        <option value="16:9">16:9</option>
                        <option value="9:16">9:16</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Качество</p>
                    <div className="relative">
                      <select value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full appearance-none bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-['Inter',sans-serif]">
                        <option value="1K">1K</option>
                        <option value="2K">2K</option>
                        <option value="4K">4K</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Количество</p>
                    <div className="flex items-center bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[4px] py-[4px]">
                      <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className="size-[28px] rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                        <Minus size={14} className="text-white" />
                      </button>
                      <span className="flex-1 text-center font-['Inter',sans-serif] font-medium text-[14px] text-white">1/{imageCount}</span>
                      <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className="size-[28px] rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                        <Plus size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Соотношение сторон</p>
                    <div className="relative">
                      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full appearance-none bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-['Inter',sans-serif]">
                        <option value="1:1">1:1</option>
                        <option value="16:9">16:9</option>
                        <option value="9:16">9:16</option>
                        <option value="4:3">4:3</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white mb-[8px]">Длительность</p>
                    <div className="flex gap-[6px]">
                      {(model.id === 'sora2' ? ['10с', '15с'] : model.id === 'kling' ? ['5с', '10с'] : ['5с', '8с']).map((dur) => (
                        <button
                          key={dur}
                          onClick={() => setVideoDuration(dur)}
                          className={`flex-1 py-[8px] rounded-[10px] font-['Inter',sans-serif] font-medium text-[13px] transition-colors cursor-pointer ${videoDuration === dur ? 'bg-[#39375b] text-white' : 'bg-[rgba(57,55,91,0.5)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(57,55,91,0.7)]'}`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                  {model.id === 'kling' && selectedVersion.id === 'kling-2.6' && (
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-['Inter',sans-serif] font-medium text-[14px] text-white">Со звуком</p>
                        <button
                          onClick={() => setAudioEnabled(!audioEnabled)}
                          className={`relative w-[40px] h-[22px] rounded-full transition-colors cursor-pointer ${audioEnabled ? 'bg-[#888ae5]' : 'bg-[rgba(57,55,91,0.8)]'}`}
                        >
                          <div
                            className="absolute top-[2px] size-[18px] rounded-full bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                            style={{ left: audioEnabled ? 20 : 2 }}
                          />
                        </button>
                      </div>
                      {audioEnabled && (
                        <p className="font-['Inter',sans-serif] font-normal text-[11px] text-[rgba(255,255,255,0.3)] mt-[6px]">Генерация видео со звуковой дорожкой</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isTextModel && (
                <div className="mt-[20px] bg-[rgba(136,138,229,0.06)] rounded-[12px] p-[14px] border border-[rgba(136,138,229,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] font-medium text-[12px] text-[rgba(255,255,255,0.4)]">Стоимость генерации</span>
                    <div className="flex items-center gap-[4px]">
                      <span className="font-['Inter',sans-serif] font-bold text-[18px] text-white">{dynamicCost}</span>
                      <div className="relative shrink-0 size-[14px]">
                        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
                      </div>
                    </div>
                  </div>
                  {(selectedVersion.price || 5) !== dynamicCost && (
                    <div className="flex items-center justify-between mt-[6px]">
                      <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[rgba(255,255,255,0.25)]">Базовая цена</span>
                      <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[rgba(255,255,255,0.25)] line-through">{selectedVersion.price || 5}</span>
                    </div>
                  )}
                </div>
              )}

              {isTextModel && messagesLength > 0 && (
                <button
                  onClick={() => { handleNewChat(); setSettingsOpen(false) }}
                  className="flex items-center justify-center gap-[8px] w-full mt-[24px] py-[10px] rounded-[12px] cursor-pointer transition-colors hover:bg-[rgba(189,70,70,0.1)]"
                >
                  <Trash2 size={15} className="text-[#bd4646]" />
                  <span className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#bd4646]">удалить чат</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

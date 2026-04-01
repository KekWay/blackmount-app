'use client'

import { ChevronDown, Plus, Minus } from 'lucide-react'
import type { AIModel, ModelVersion } from '@/types'
import { hasAudioPricing } from '@/types/models'

interface SettingsImageProps {
  aspectRatio: string
  setAspectRatio: (v: string) => void
  quality: string
  setQuality: (v: string) => void
  imageCount: number
  setImageCount: (v: number) => void
  selectedVersion: ModelVersion
}

export function SettingsImage({ aspectRatio, setAspectRatio, quality, setQuality, imageCount, setImageCount }: SettingsImageProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Соотношение сторон</p>
        <div className="relative">
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full appearance-none bg-[rgba(57,55,91,0.5)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-manrope">
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
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Разрешение</p>
        <div className="flex gap-[6px]">
          {['1K', '2K', '4K'].map((res) => (
            <button
              key={res}
              onClick={() => setQuality(res)}
              className={`flex-1 py-[8px] rounded-[10px] font-manrope font-medium text-[13px] transition-colors cursor-pointer ${quality === res ? 'bg-[#39375b] text-white' : 'bg-[rgba(57,55,91,0.5)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(57,55,91,0.7)]'}`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Количество</p>
        <div className="flex items-center bg-[rgba(57,55,91,0.5)] rounded-[10px] px-[4px] py-[4px]">
          <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className="size-[28px] rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <Minus size={14} className="text-white" />
          </button>
          <span className="flex-1 text-center font-manrope font-medium text-[14px] text-white">1/{imageCount}</span>
          <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className="size-[28px] rounded-[7px] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface SettingsVideoProps {
  model: AIModel
  selectedVersion: ModelVersion
  aspectRatio: string
  setAspectRatio: (v: string) => void
  videoDuration: string
  setVideoDuration: (v: string) => void
  audioEnabled: boolean
  setAudioEnabled: (v: boolean) => void
}

export function SettingsVideo({
  model, selectedVersion, aspectRatio, setAspectRatio,
  videoDuration, setVideoDuration, audioEnabled, setAudioEnabled,
}: SettingsVideoProps) {
  const showAudioToggle = model.id === 'kling' && selectedVersion.id !== 'kling-2.5-turbo' && selectedVersion.id !== 'kling-3.0-pro' && selectedVersion.id !== 'kling-3.0'
  const audioAffectsPrice = hasAudioPricing(selectedVersion.price)
  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Соотношение сторон</p>
        <div className="relative">
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full appearance-none bg-[rgba(57,55,91,0.5)] rounded-[10px] px-[12px] py-[9px] text-[13px] text-white outline-none cursor-pointer font-manrope">
            <option value="1:1">1:1</option>
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="4:3">4:3</option>
          </select>
          <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
        </div>
      </div>
      <div>
        <p className="font-manrope font-medium text-[14px] text-white mb-[8px]">Длительность</p>
        <div className="flex gap-[6px]">
          {(model.id === 'kling' ? ['5с', '10с'] : ['5с', '8с']).map((dur) => (
            <button
              key={dur}
              onClick={() => setVideoDuration(dur)}
              className={`flex-1 py-[8px] rounded-[10px] font-manrope font-medium text-[13px] transition-colors cursor-pointer ${videoDuration === dur ? 'bg-[#39375b] text-white' : 'bg-[rgba(57,55,91,0.5)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(57,55,91,0.7)]'}`}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>
      {showAudioToggle && (
        <div className="mt-[4px]">
          <div className="flex items-center justify-between">
            <p className="font-manrope font-medium text-[14px] text-white">Со звуком</p>
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
            <p className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.3)] mt-[6px]">
              {audioAffectsPrice ? 'Генерация видео со звуковой дорожкой' : 'Звук включён в стоимость'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

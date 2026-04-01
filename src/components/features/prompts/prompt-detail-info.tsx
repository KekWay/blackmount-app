'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { copyToClipboard } from '@/lib/utils'
import { aiModels } from '@/data/ai-models'
import { useSubscriptionStore } from '@/stores/subscription'
import { ModelIcon } from '@/components/shared/model-icon'
import type { PromptItem } from './prompts-data'
import { promptCategories } from './prompts-data'

const themeLabelMap: Record<string, string> = {
  portrait: 'Портреты', cyberpunk: 'Киберпанк', fantasy: 'Фэнтези',
  abstract: 'Абстракция', scifi: 'Sci-Fi', dark: 'Тёмное',
  nature: 'Природа', space: 'Космос', sea: 'Море', retro: 'Ретро',
  animals: 'Животные', architecture: 'Архитектура',
}

interface PromptDetailInfoProps {
  item: PromptItem
  selectedModelId: string
  onSelectModel: (id: string) => void
  onGate: (modelName: string) => void
}

export function PromptDetailInfo({ item, selectedModelId, onSelectModel, onGate }: PromptDetailInfoProps) {
  const [copied, setCopied] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const isModelLocked = useSubscriptionStore((s) => s.isModelLocked)

  const model = aiModels.find((m) => m.id === item.modelId)
  const selectedModel = aiModels.find((m) => m.id === selectedModelId)
  const themeLabel = themeLabelMap[item.theme] ?? promptCategories.find((c) => c.id === item.theme)?.name ?? item.theme
  const generationModels = aiModels.filter((m) => m.category === item.type)

  const handleCopy = () => {
    copyToClipboard(item.prompt).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-[20px] py-[16px] flex flex-col gap-[14px] flex-1 overflow-y-auto hidden-scrollbar">
      {/* Generated with */}
      <div>
        <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[10px]">Сгенерировано</p>
        <div className="bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[12px]">
          <div className="flex items-center gap-[10px]">
            {model && <ModelIcon modelId={model.id} size={28} />}
            <div>
              <p className="text-[14px] text-white">{model?.name || 'Unknown'}</p>
              <p className="text-[11px] text-[rgba(255,255,255,0.35)]">
                {item.type === 'video' ? 'Видео' : 'Изображение'} • {themeLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt text */}
      <div>
        <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[8px]">Промпт</p>
        <div className="bg-[#13121a] rounded-[12px] p-[14px]">
          <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-[20px]">{item.prompt}</p>
        </div>
        <button
          onClick={handleCopy}
          className="mt-[8px] flex items-center gap-[6px] text-[12px] text-[rgba(255,255,255,0.35)] hover:text-[#888ae5] transition-colors cursor-pointer"
        >
          {copied ? <Check size={13} className="text-[#888ae5]" /> : <Copy size={13} />}
          {copied ? 'Скопировано!' : 'Скопировать промпт'}
        </button>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.06)]" />

      {/* Model selector */}
      <div>
        <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[8px]">Генерировать с моделью</p>
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="w-full flex items-center justify-between bg-[#13121a] rounded-[12px] px-[14px] py-[10px] cursor-pointer hover:bg-[rgba(136,138,229,0.08)] transition-colors"
          >
            <div className="flex items-center gap-[8px]">
              {selectedModel && <ModelIcon modelId={selectedModel.id} size={20} />}
              <span className="text-[13px] text-white">{selectedModel?.name || 'Выбрать'}</span>
            </div>
            <ChevronDown size={14} className={`text-[rgba(255,255,255,0.3)] transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {modelDropdownOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-[4px] bg-[#1d1c26] rounded-[12px] overflow-hidden z-10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ type: 'spring', damping: 24, stiffness: 400 }}
              >
                {generationModels.map((m) => {
                  const mLocked = isModelLocked(m.id)
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        if (mLocked) {
                          onGate(m.name)
                          setModelDropdownOpen(false)
                          return
                        }
                        onSelectModel(m.id)
                        setModelDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-[8px] px-[14px] py-[9px] cursor-pointer transition-colors ${
                        mLocked ? 'opacity-60' : selectedModelId === m.id ? 'bg-[rgba(136,138,229,0.12)]' : 'hover:bg-[rgba(136,138,229,0.08)]'
                      }`}
                    >
                      <ModelIcon modelId={m.id} size={18} />
                      <span className="text-[13px] text-white">{m.name}</span>
                      {mLocked ? (
                        <div className="flex items-center gap-[3px] px-[6px] py-[1px] rounded-full ml-auto shrink-0" style={{ background: 'linear-gradient(135deg, rgba(91,91,214,0.5), rgba(124,92,191,0.5))' }}>
                          <Sparkles size={8} className="text-white" />
                          <span className="text-[9px] text-white font-semibold">Подписка</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[rgba(255,255,255,0.25)] ml-auto">
                          {m.category === 'image' ? 'Фото' : 'Видео'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

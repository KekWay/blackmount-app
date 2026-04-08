'use client'

import { useState } from 'react'
import { CustomIcon } from '@/components/shared/custom-icon'
import { motion, AnimatePresence } from 'motion/react'
import { ModelIcon } from '@/components/shared/model-icon'
import { aiModels } from '@/data/ai-models'
import { modelGroups } from './knowledge-data'

interface KnowledgeSidebarProps {
  selectedModelId: string
  onSelectModel: (id: string) => void
  mobile?: boolean
}

export function KnowledgeSidebar({ selectedModelId, onSelectModel, mobile }: KnowledgeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<Record<string, boolean>>({})

  const toggleGroup = (cat: string) => {
    setSidebarCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const filteredModels = searchQuery.trim()
    ? aiModels.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : aiModels

  return (
    <div className={`${mobile ? 'flex' : 'hidden md:flex'} w-[260px] shrink-0 h-full flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#121118]`}>
      {/* Header */}
      <div className="px-[20px] pt-[24px] pb-[16px]">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <div>
            <p className="text-[15px] text-white font-semibold">База знаний</p>
            <p className="text-[11px] text-[rgba(255,255,255,0.3)]">Документация моделей</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <img src="/assets/models/search-icon.png" alt="" className="absolute left-[10px] top-1/2 -translate-y-1/2 size-[18px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
          <input
            className="w-full bg-[rgba(255,255,255,0.04)] rounded-[10px] pl-[32px] pr-[12px] py-[8px] text-[12px] text-white placeholder-[rgba(255,255,255,0.25)] outline-none focus:bg-[rgba(255,255,255,0.06)] transition-colors"
            placeholder="Поиск модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Model list */}
      <div className="flex-1 overflow-y-auto px-[12px] pb-[20px] chat-scrollbar">
        {modelGroups.map((group) => {
          const models = filteredModels.filter((m) => m.category === group.category)
          if (models.length === 0) return null
          const isCollapsed = sidebarCollapsed[group.category]

          return (
            <div key={group.category} className="mb-[4px]">
              <button
                onClick={() => toggleGroup(group.category)}
                className="flex items-center gap-[6px] w-full px-[8px] py-[6px] rounded-[8px] hover:bg-[rgba(136,138,229,0.06)] transition-colors cursor-pointer"
              >
                <CustomIcon
                  src="/icons/arrow_down_icon.png"
                  size={12}
                  className={`opacity-30 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                />
                <span className="text-[11px] text-[rgba(255,255,255,0.35)] uppercase tracking-[0.06em] font-semibold">
                  {group.label}
                </span>
                <span className="text-[10px] text-[rgba(255,255,255,0.2)] ml-auto">{models.length}</span>
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {models.map((m) => {
                      const isActive = m.id === selectedModelId
                      return (
                        <button
                          key={m.id}
                          onClick={() => onSelectModel(m.id)}
                          className={`flex items-center gap-[10px] w-full px-[10px] py-[8px] rounded-[10px] transition-all cursor-pointer mb-[1px] ${
                            isActive
                              ? 'bg-[rgba(136,138,229,0.12)]'
                              : 'hover:bg-[rgba(255,255,255,0.04)]'
                          }`}
                        >
                          <ModelIcon modelId={m.id} size={20} />
                          <span className={`text-[13px] truncate ${isActive ? 'text-white font-semibold' : 'text-[rgba(255,255,255,0.55)] font-normal'}`}>
                            {m.name}
                          </span>
                          {isActive && (
                            <div className="ml-auto size-[6px] rounded-full bg-[#888ae5] shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

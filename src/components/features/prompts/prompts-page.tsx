'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { promptItems } from './prompts-data'
import type { PromptItem } from './prompts-data'
import { PromptCard } from './prompt-card'
import { PromptDetailModal } from './prompt-detail-modal'
import { PromptsFilters } from './prompts-filters'

export function PromptsPage() {
  const [selectedItem, setSelectedItem] = useState<PromptItem | null>(null)
  const [activeModelFilter, setActiveModelFilter] = useState<string>('all')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all')
  const [favIds, setFavIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('promptFavs') || '[]') } catch { return [] }
  })

  useEffect(() => {
    const handler = () => {
      try { setFavIds(JSON.parse(localStorage.getItem('promptFavs') || '[]')) } catch { /* noop */ }
    }
    window.addEventListener('promptFavsChanged', handler)
    window.addEventListener('storage', handler)
    return () => { window.removeEventListener('promptFavsChanged', handler); window.removeEventListener('storage', handler) }
  }, [])

  const filtered = promptItems.filter((p) => {
    if (activeCategoryFilter === 'favorites') return favIds.includes(p.id)
    if (activeModelFilter !== 'all' && p.modelId !== activeModelFilter) return false
    // Category filtering: when items have category field, filter by it.
    // For now all items show in every category (no category mapping yet).
    if (activeCategoryFilter !== 'all' && p.category && p.category !== activeCategoryFilter) return false
    return true
  })

  return (
    <div className="w-full h-full overflow-y-auto chat-scrollbar px-[16px] md:px-[24px] lg:px-[40px] pt-[24px] md:pt-[32px] pb-[40px]">
      {/* Header */}
      <div className="mb-[24px]">
        <p
          className="font-semibold leading-[45px] text-[24px] md:text-[36px]"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,1), rgba(255,255,255,0.6), rgba(255,255,255,1), rgba(255,255,255,0.6))',
            backgroundSize: '400% 100%',
            animation: 'promptPageShimmer 4s ease-in-out infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >Промпты</p>
        <style>{`@keyframes promptPageShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
        <p className="text-[15px] text-[rgba(255,255,255,0.4)] mt-[4px]">
          Идеи и шаблоны для Ваших генераций
        </p>
      </div>

      <PromptsFilters
        activeCategoryFilter={activeCategoryFilter}
        activeModelFilter={activeModelFilter}
        favCount={favIds.length}
        onCategoryChange={setActiveCategoryFilter}
        onModelChange={setActiveModelFilter}
      />

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 auto-rows-[180px] gap-[10px]">
        {filtered.map((item) => (
          <PromptCard key={item.id} item={item} onOpen={() => setSelectedItem(item)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-[60px] flex items-center justify-center">
          <p className="text-[15px] text-[rgba(255,255,255,0.3)]">Нет промптов для выбранных фильтров</p>
        </div>
      )}

      {/* Prompt detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <PromptDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

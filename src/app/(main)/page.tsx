'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { aiModels } from '@/data/ai-models'
import { FilterTabs, type FilterCategory } from '@/components/features/home/filter-tabs'
import { SearchBar } from '@/components/features/home/search-bar'
import { ModelGrid } from '@/components/features/home/model-grid'
import { AnnouncementBanner } from '@/components/features/home/announcement-banner'
import { TrendingModels } from '@/components/features/home/trending-models'
import { NewsCarousel } from '@/components/features/home/news-carousel'
import { PromptsPreview } from '@/components/features/home/prompts-preview'
import { HomeFooter } from '@/components/features/home/home-footer'
import { SubscriptionGateModal } from '@/components/shared/subscription-gate'
import { useSubscriptionStore } from '@/stores/subscription'

export default function HomePage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [gateModal, setGateModal] = useState<{ open: boolean; modelName: string }>({
    open: false,
    modelName: '',
  })

  const isModelLocked = useSubscriptionStore((s) => s.isModelLocked)

  const filteredModels = useMemo(() => {
    return aiModels.filter((m) => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilter === 'all') return true
      if (activeFilter === 'favorites') return false
      return m.category === activeFilter
    })
  }, [activeFilter, searchQuery])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setActiveFilter('all')
  }, [])

  const handleModelClick = useCallback(
    (modelId: string, modelName: string) => {
      if (isModelLocked(modelId)) {
        setGateModal({ open: true, modelName })
      } else {
        router.push(`/chat/${modelId}`)
      }
    },
    [isModelLocked, router],
  )

  return (
    <div className="w-full h-full overflow-y-auto px-[24px] lg:px-[40px] pt-[32px] pb-[40px]">
      {/* Announcement */}
      <AnnouncementBanner />

      {/* Header */}
      <header className="mb-[24px]">
        <h1 className="font-['Maven_Pro',sans-serif] font-extrabold text-[36px] text-white">
          Библиотека
        </h1>
        <p className="text-[15px] text-[rgba(255,255,255,0.4)] mt-[4px]">
          Выберите нейросеть для работы
        </p>
      </header>

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-[16px] mb-[24px] flex-wrap">
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Model cards */}
      <div className="mb-[40px]">
        <ModelGrid
          models={filteredModels}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onResetFilters={resetFilters}
        />
      </div>

      {/* Trending */}
      <TrendingModels />

      {/* News */}
      <NewsCarousel />

      {/* Prompts */}
      <PromptsPreview />

      {/* Footer */}
      <HomeFooter />

      {/* Subscription gate modal */}
      <SubscriptionGateModal
        open={gateModal.open}
        onClose={() => setGateModal({ open: false, modelName: '' })}
        modelName={gateModal.modelName}
      />
    </div>
  )
}

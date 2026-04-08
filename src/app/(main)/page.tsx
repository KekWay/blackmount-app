'use client'

import { Suspense, useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { aiModels } from '@/data/ai-models'
import { useFavoritesStore } from '@/stores/favorites'
import { FilterTabs, type FilterCategory } from '@/components/features/home/filter-tabs'
import { SearchBar } from '@/components/features/home/search-bar'
import { ModelGrid } from '@/components/features/home/model-grid'
import { AnnouncementBanner } from '@/components/features/home/announcement-banner'
import { TrendingModels } from '@/components/features/home/trending-models'
import { NewsCarousel } from '@/components/features/home/news-carousel'
import { PromptsPreview } from '@/components/features/home/prompts-preview'
import { HomeFooter } from '@/components/features/home/home-footer'
import { SubscriptionGateModal } from '@/components/shared/subscription-gate'

const FILTER_MAP: Record<string, FilterCategory> = {
  text: 'text',
  image: 'image',
  video: 'video',
}

function HomePageContent() {
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [gateModal, setGateModal] = useState<{ open: boolean; modelName: string }>({
    open: false,
    modelName: '',
  })

  useEffect(() => {
    const f = searchParams.get('filter')
    if (f && FILTER_MAP[f]) setActiveFilter(FILTER_MAP[f])
  }, [searchParams])

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      try { localStorage.setItem('pendingReferralCode', ref.toUpperCase()) } catch {}
      toast.info('Вас пригласил друг!')
    }
  }, [searchParams])

  const favorites = useFavoritesStore((s) => s.favorites)

  const filteredModels = useMemo(() => {
    const filtered = aiModels.filter((m) => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilter === 'favorites') return favorites.includes(m.id)
      if (activeFilter === 'all') return true
      return m.category === activeFilter
    })
    if (activeFilter === 'all' && !searchQuery) {
      return [...filtered].sort((a, b) => {
        const aFav = favorites.includes(a.id) ? 0 : 1
        const bFav = favorites.includes(b.id) ? 0 : 1
        return aFav - bFav
      })
    }
    return filtered
  }, [activeFilter, searchQuery, favorites])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setActiveFilter('all')
  }, [])

  return (
    <div className="w-full h-full overflow-y-auto chat-scrollbar px-[16px] md:px-[24px] lg:px-[40px] pt-[24px] md:pt-[32px] pb-[40px]">
      {/* Announcement */}
      <AnnouncementBanner />

      {/* Header */}
      <header className="flex items-center justify-between mb-[24px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="font-manrope font-extrabold leading-tight text-[24px] md:text-[30px] lg:text-[36px] text-white">Библиотека</h1>
          <p className="font-manrope font-normal leading-[22.5px] not-italic text-[13px] md:text-[15px] text-[rgba(255,255,255,0.4)]">Выберите нейросеть для работы</p>
        </div>
      </header>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] sm:gap-[16px] mb-[24px]">
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

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  )
}

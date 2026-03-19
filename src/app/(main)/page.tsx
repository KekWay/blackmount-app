'use client'

import { useState, useMemo } from 'react'
import { aiModels } from '@/data/ai-models'
import { FilterTabs, type FilterCategory } from '@/components/features/home/filter-tabs'
import { SearchBar } from '@/components/features/home/search-bar'
import { ModelGrid } from '@/components/features/home/model-grid'
import { TrendingModels } from '@/components/features/home/trending-models'
import { NewsCarousel } from '@/components/features/home/news-carousel'

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredModels = useMemo(() => {
    return aiModels.filter((m) => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilter === 'all') return true
      if (activeFilter === 'favorites') return false
      return m.category === activeFilter
    })
  }, [activeFilter, searchQuery])

  const resetFilters = () => {
    setSearchQuery('')
    setActiveFilter('all')
  }

  return (
    <div className="w-full h-full overflow-y-auto px-6 lg:px-10 pt-8 pb-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-maven font-extrabold text-4xl text-white">Библиотека</h1>
        <p className="text-[15px] text-white/40 mt-1">Выберите нейросеть для работы</p>
      </header>

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Model cards */}
      <div className="mb-10">
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
    </div>
  )
}

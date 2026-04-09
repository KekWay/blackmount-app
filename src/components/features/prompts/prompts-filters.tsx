'use client'

import { useRef, useState } from 'react'
import { PromptsFilterBar } from './prompts-filter-bar'
import { PromptsFilterTags } from './prompts-filter-tags'
import { PromptsFilterOverlay } from './prompts-filter-overlay'

interface PromptsFiltersProps {
  activeCategoryFilter: string
  activeModelFilter: string
  favCount: number
  onCategoryChange: (id: string) => void
  onModelChange: (id: string) => void
}

export function PromptsFilters({
  activeCategoryFilter,
  activeModelFilter,
  favCount,
  onCategoryChange,
  onModelChange,
}: PromptsFiltersProps) {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const scrollToChipRef = useRef<(id: string) => void>(() => {})

  const handleOverlaySelect = (id: string) => {
    onCategoryChange(id)
    setOverlayOpen(false)
    setTimeout(() => scrollToChipRef.current(id), 100)
  }

  return (
    <>
      <PromptsFilterBar
        activeCategoryFilter={activeCategoryFilter}
        favCount={favCount}
        onCategoryChange={onCategoryChange}
        onOpenOverlay={() => setOverlayOpen(true)}
        registerScrollToChip={(fn) => { scrollToChipRef.current = fn }}
      />
      <PromptsFilterOverlay
        open={overlayOpen}
        activeCategoryFilter={activeCategoryFilter}
        onClose={() => setOverlayOpen(false)}
        onSelect={handleOverlaySelect}
      />
      <PromptsFilterTags
        activeModelFilter={activeModelFilter}
        onModelChange={onModelChange}
      />
    </>
  )
}

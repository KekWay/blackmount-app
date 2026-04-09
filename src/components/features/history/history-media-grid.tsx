'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { HistoryPendingCard, type PendingGen } from './history-pending-card'
import { HistoryMediaCard, type HistoryMediaItem } from './history-media-card'
import { HistoryMediaEmpty } from './history-media-empty'

interface HistoryMediaGridProps {
  items: HistoryMediaItem[]
  mediaType: 'image' | 'video'
  hasActiveFilter: boolean
  onViewItem: (item: HistoryMediaItem) => void
  onRequestDelete: (id: string) => void
  onClearFilter: () => void
  pendingGenerations?: PendingGen[]
}

export function HistoryMediaGrid({
  items,
  mediaType,
  hasActiveFilter,
  onViewItem,
  onRequestDelete,
  onClearFilter,
  pendingGenerations = [],
}: HistoryMediaGridProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  if (items.length === 0 && pendingGenerations.length === 0) {
    return (
      <HistoryMediaEmpty
        mediaType={mediaType}
        hasActiveFilter={hasActiveFilter}
        onClearFilter={onClearFilter}
      />
    )
  }

  return (
    <>
      {pendingGenerations.map((gen) => (
        <HistoryPendingCard key={`pending-${gen.id}`} gen={gen} />
      ))}
      {items.map((item) => (
        <HistoryMediaCard
          key={item.id}
          item={item}
          mediaType={mediaType}
          onView={() => {
            if (!isLoggedIn) { router.push('/auth'); return }
            onViewItem(item)
          }}
          onDelete={() => onRequestDelete(item.id)}
        />
      ))}
    </>
  )
}

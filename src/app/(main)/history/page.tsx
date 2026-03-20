'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useBalanceStore } from '@/stores/balance'
import { useAuthStore } from '@/stores/auth'
import { aiModels } from '@/data/ai-models'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { HistoryFilter } from '@/components/features/history/history-filter'
import { HistoryTextList } from '@/components/features/history/history-text-list'
import { HistoryMediaGrid } from '@/components/features/history/history-media-grid'
import { HistoryViewer } from '@/components/features/history/history-viewer'
import { HistoryShareModal } from '@/components/features/history/history-share-modal'
import { HistoryDeleteModal } from '@/components/features/history/history-delete-modal'
import type { ModelCategory } from '@/types'

type HistoryTab = 'text' | 'images' | 'video'

const tabs: { key: HistoryTab; label: string }[] = [
  { key: 'text', label: 'Текст' },
  { key: 'images', label: 'Изображения' },
  { key: 'video', label: 'Видео' },
]

export default function HistoryPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const genHistory = useBalanceStore((s) => s.genHistory)
  const removeGenHistoryItem = useBalanceStore((s) => s.removeGenHistoryItem)

  const [activeTab, setActiveTab] = useState<HistoryTab>('text')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [viewerItem, setViewerItem] = useState<typeof genHistory[number] | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const tabToType = (tab: HistoryTab): ModelCategory =>
    tab === 'images' ? 'image' : tab === 'video' ? 'video' : 'text'

  const relevantModels = aiModels.filter((m) => m.category === tabToType(activeTab))
  const hasActiveFilter = selectedModels.length > 0

  const filtered = genHistory
    .filter((item) => item.type === tabToType(activeTab))
    .filter((item) => selectedModels.length === 0 || selectedModels.includes(item.modelId))

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    )
  }, [])

  const clearFilter = useCallback(() => setSelectedModels([]), [])

  const requestDelete = useCallback((id: string) => {
    if (!isLoggedIn) { router.push('/auth'); return }
    setConfirmDeleteId(id)
  }, [isLoggedIn, router])

  const confirmDelete = useCallback(() => {
    if (confirmDeleteId === null) return
    removeGenHistoryItem(confirmDeleteId)
    if (viewerItem?.id === confirmDeleteId) setViewerItem(null)
    setConfirmDeleteId(null)
  }, [confirmDeleteId, removeGenHistoryItem, viewerItem])

  const deleteItemTitle = confirmDeleteId
    ? genHistory.find((h) => h.id === confirmDeleteId)?.title ?? null
    : null

  return (
    <div className="w-full">
      <p className="font-manrope font-extrabold leading-[45px] text-[36px] text-white mb-[24px]">
        История
      </p>

      {/* Tabs + filter */}
      <div className="flex items-center gap-[12px] mb-[20px]">
        <div className="w-[340px]">
          <AnimatedToggle<HistoryTab>
            options={tabs}
            value={activeTab}
            onChange={(key) => { setActiveTab(key); setSelectedModels([]) }}
          />
        </div>
        <HistoryFilter
          relevantModels={relevantModels}
          selectedModels={selectedModels}
          onToggleModel={toggleModel}
          onClear={clearFilter}
        />
      </div>

      <p className="font-manrope font-black leading-[19.5px] text-[13px] text-center text-white mb-[20px]">
        История генераций хранится 7 дней
      </p>

      {/* Content */}
      {activeTab === 'text' && (
        <HistoryTextList
          items={filtered}
          hasActiveFilter={hasActiveFilter}
          onRequestDelete={requestDelete}
          onClearFilter={clearFilter}
        />
      )}

      {(activeTab === 'images' || activeTab === 'video') && (
        <div className="grid grid-cols-5 gap-[16px]">
          <HistoryMediaGrid
            items={filtered}
            mediaType={activeTab === 'images' ? 'image' : 'video'}
            hasActiveFilter={hasActiveFilter}
            onViewItem={setViewerItem}
            onRequestDelete={requestDelete}
            onClearFilter={clearFilter}
          />
        </div>
      )}

      {/* Media viewer modal */}
      <HistoryViewer
        item={viewerItem}
        onClose={() => setViewerItem(null)}
        onDelete={(id) => { removeGenHistoryItem(id); setViewerItem(null) }}
        onShare={() => setShareOpen(true)}
      />

      {/* Share modal */}
      {viewerItem && (
        <HistoryShareModal
          open={shareOpen}
          itemId={viewerItem.id}
          itemTitle={viewerItem.title}
          onClose={() => setShareOpen(false)}
        />
      )}

      {/* Delete confirmation */}
      <HistoryDeleteModal
        itemTitle={deleteItemTitle}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

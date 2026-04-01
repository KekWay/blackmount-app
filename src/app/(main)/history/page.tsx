'use client'

import { Suspense, useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBalanceStore } from '@/stores/balance'
import { useAuthStore } from '@/stores/auth'
import { useChatSessionsStore } from '@/stores/chat-sessions'
import { aiModels, getModelById } from '@/data/ai-models'
import { useGenerationStore } from '@/stores/generation'
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

const VALID_TABS: HistoryTab[] = ['text', 'images', 'video']

function HistoryPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn } = useAuthStore()
  const genHistory = useBalanceStore((s) => s.genHistory)
  const removeGenHistoryItem = useBalanceStore((s) => s.removeGenHistoryItem)
  const removeSession = useChatSessionsStore((s) => s.removeSession)
  const pendingGenerations = useGenerationStore((s) => s.pendingGenerations)

  const tabParam = searchParams.get('tab') as HistoryTab | null
  const [activeTab, setActiveTab] = useState<HistoryTab>(() =>
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'text'
  )

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [tabParam]) // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [viewerItem, setViewerItem] = useState<typeof genHistory[number] | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmDeleteType, setConfirmDeleteType] = useState<'text' | 'media'>('media')

  const tabToType = (tab: HistoryTab): ModelCategory =>
    tab === 'images' ? 'image' : tab === 'video' ? 'video' : 'text'

  const relevantModels = activeTab === 'text'
    ? aiModels.filter((m) => m.category === 'text')
    : aiModels.filter((m) => m.category === tabToType(activeTab))
  const hasActiveFilter = selectedModels.length > 0

  const mediaFiltered = genHistory
    .filter((item) => item.type === tabToType(activeTab))
    .filter((item) => selectedModels.length === 0 || selectedModels.includes(item.modelId))

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    )
  }, [])

  const clearFilter = useCallback(() => setSelectedModels([]), [])

  const requestDelete = useCallback((id: string, type: 'text' | 'media' = 'media') => {
    if (!isLoggedIn) { router.push('/auth'); return }
    setConfirmDeleteId(id)
    setConfirmDeleteType(type)
  }, [isLoggedIn, router])

  const confirmDelete = useCallback(() => {
    if (confirmDeleteId === null) return
    if (confirmDeleteType === 'text') {
      removeSession(confirmDeleteId)
    } else {
      removeGenHistoryItem(confirmDeleteId)
      if (viewerItem?.id === confirmDeleteId) setViewerItem(null)
    }
    setConfirmDeleteId(null)
  }, [confirmDeleteId, confirmDeleteType, removeGenHistoryItem, removeSession, viewerItem])

  const deleteItemTitle = (() => {
    if (!confirmDeleteId) return null
    if (confirmDeleteType === 'text') {
      const session = useChatSessionsStore.getState().getSession(confirmDeleteId)
      return session?.title ?? null
    }
    return genHistory.find((h) => h.id === confirmDeleteId)?.title ?? null
  })()

  return (
    <div className="w-full h-full overflow-y-auto px-[16px] md:px-[24px] lg:px-[40px] pt-[24px] md:pt-[32px] pb-[80px] md:pb-[40px]">
      <p className="font-manrope font-extrabold leading-tight text-[24px] md:text-[30px] lg:text-[36px] text-white mb-[24px]">
        История
      </p>

      {/* Tabs + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-[12px] mb-[20px]">
        <div className="w-full sm:w-[340px]">
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
          selectedModels={selectedModels}
          hasActiveFilter={hasActiveFilter}
          onRequestDelete={(id) => requestDelete(id, 'text')}
          onClearFilter={clearFilter}
        />
      )}

      {(activeTab === 'images' || activeTab === 'video') && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[12px] md:gap-[16px]">
          <HistoryMediaGrid
            items={mediaFiltered}
            mediaType={activeTab === 'images' ? 'image' : 'video'}
            hasActiveFilter={hasActiveFilter}
            onViewItem={setViewerItem}
            onRequestDelete={(id) => requestDelete(id, 'media')}
            onClearFilter={clearFilter}
            pendingGenerations={pendingGenerations.filter(
              (g) => g.status === 'pending' && g.type === (activeTab === 'images' ? 'image' : 'video')
            )}
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
      {viewerItem && (() => {
        const viewModel = getModelById(viewerItem.modelId)
        return (
          <HistoryShareModal
            open={shareOpen}
            itemId={viewerItem.id}
            itemTitle={viewerItem.title}
            itemModelId={viewerItem.modelId}
            itemModelName={viewModel?.name || 'Unknown'}
            itemType={viewerItem.type}
            onClose={() => setShareOpen(false)}
          />
        )
      })()}

      {/* Delete confirmation */}
      <HistoryDeleteModal
        itemTitle={deleteItemTitle}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={null}>
      <HistoryPageContent />
    </Suspense>
  )
}

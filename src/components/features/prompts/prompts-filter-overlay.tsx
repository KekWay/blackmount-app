'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import {
  promptCategories,
  categoryGroupLabels,
} from './prompts-data'
import type { PromptCategory } from './prompts-data'
import { OverlayCategoryItem } from './overlay-category-item'

const groupOrder: PromptCategory['group'][] = ['main', 'trending', 'classic']
const overlayCategories = promptCategories.filter((c) => c.id !== 'all')

interface PromptsFilterOverlayProps {
  open: boolean
  activeCategoryFilter: string
  onClose: () => void
  onSelect: (id: string) => void
}

export function PromptsFilterOverlay({
  open,
  activeCategoryFilter,
  onClose,
  onSelect,
}: PromptsFilterOverlayProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative max-w-3xl w-full max-h-[80vh] overflow-y-auto chat-scrollbar bg-sidebar border border-white/10 rounded-2xl p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Все разделы</h2>
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="group p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Image src="/icons/close_icon.png" alt="" width={14} height={14} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
              </button>
            </div>
            {groupOrder.map((group, gi) => {
              const items = overlayCategories.filter((c) => c.group === group)
              if (items.length === 0) return null
              return (
                <div key={group}>
                  <p className={`text-xs uppercase tracking-wider text-white/30 mb-3 ${gi > 0 ? 'mt-5' : ''}`}>
                    {categoryGroupLabels[group]}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[4px]">
                    {items.map((cat) => (
                      <OverlayCategoryItem
                        key={cat.id}
                        cat={cat}
                        isActive={activeCategoryFilter === cat.id}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { motion, AnimatePresence } from 'motion/react'

interface HistoryDeleteModalProps {
  itemTitle: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function HistoryDeleteModal({ itemTitle, onConfirm, onCancel }: HistoryDeleteModalProps) {
  return (
    <AnimatePresence>
      {itemTitle !== null && (
        <motion.div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="bg-[#1a1a22] rounded-[20px] w-[380px] max-w-[90vw] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.06)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
          >
            <div className="px-[24px] pt-[24px] pb-[16px] flex flex-col items-center gap-[12px]">
              <img src="/assets/models/trash_icon.png" alt="" width={28} height={28} className="[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]" />
              <p className="text-[18px] text-white text-center font-bold">Удалить запись?</p>
              <p className="text-[13px] text-[rgba(255,255,255,0.45)] text-center leading-[20px] max-w-[280px]">
                «{itemTitle.slice(0, 60)}{itemTitle.length > 60 ? '...' : ''}» будет удалена безвозвратно
              </p>
            </div>
            <div className="px-[24px] pb-[24px] flex gap-[8px]">
              <button
                onClick={onCancel}
                className="flex-1 py-[11px] rounded-[12px] bg-[rgba(255,255,255,0.06)] text-[14px] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-[11px] rounded-[12px] bg-[#f87171] hover:bg-[#ef4444] text-[14px] text-white transition-colors cursor-pointer font-semibold"
              >
                Удалить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

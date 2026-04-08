'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Check, ArrowUpRight, ImageIcon } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'

const imgShareMask = '/assets/models/share-mask.png'

function ShareIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgShareMask}')`, WebkitMaskImage: `url('${imgShareMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}
import { ModelIcon } from '@/components/shared/model-icon'
import { useAuthStore } from '@/stores/auth'
import { copyToClipboard } from '@/lib/utils'
import { getModelById } from '@/data/ai-models'

interface ViewerItem {
  id: string
  modelId: string
  title: string
  prompt?: string
  type: 'text' | 'image' | 'video'
  time: string
}

interface HistoryViewerProps {
  item: ViewerItem | null
  onClose: () => void
  onDelete: (id: string) => void
  onShare: () => void
}

export function HistoryViewer({ item, onClose, onDelete, onShare }: HistoryViewerProps) {
  return (
    <AnimatePresence>
      {item && <HistoryViewerContent item={item} onClose={onClose} onDelete={onDelete} onShare={onShare} />}
    </AnimatePresence>
  )
}

function HistoryViewerContent({ item, onClose, onDelete, onShare }: { item: ViewerItem } & Omit<HistoryViewerProps, 'item'>) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const viewModel = getModelById(item.modelId)
  const promptText = item.prompt ?? item.title

  const handleCopy = () => {
    copyToClipboard(promptText).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      key={item.id}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-[8px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex flex-col md:flex-row gap-[16px] max-w-[1100px] w-[95vw] max-h-[85vh] items-stretch overflow-y-auto chat-scrollbar md:overflow-visible"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Preview */}
        <div className="shrink-0 md:flex-1 min-w-0 bg-[#111018] flex items-center justify-center relative rounded-[20px] overflow-hidden h-[250px] md:h-auto">
          <div className="w-full h-full bg-gradient-to-br from-[rgba(136,138,229,0.15)] to-[rgba(101,222,216,0.1)] flex items-center justify-center min-h-0 md:min-h-[400px]">
            {item.type === 'video' ? <Play size={64} className="text-[rgba(255,255,255,0.15)]" /> : <ImageIcon size={64} className="text-[rgba(255,255,255,0.15)]" />}
          </div>
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[rgba(0,0,0,0.45)] rounded-full size-[56px] flex items-center justify-center backdrop-blur-[6px] border border-[rgba(255,255,255,0.1)]">
                <Play size={24} className="text-white ml-[2px]" fill="white" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Info panel */}
        <div className="w-full md:w-[360px] shrink-0 flex flex-col bg-[#19181e] rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between px-[20px] pt-[20px] pb-[14px]">
            <div className="flex items-center gap-[8px]">
              <Image src="/icons/info_icon.png" alt="" width={16} height={16} className="[filter:invert(60%)_sepia(50%)_saturate(500%)_hue-rotate(205deg)_brightness(95%)]" />
              <span className="text-[14px] text-white">Детали генерации</span>
            </div>
            <button onClick={onClose} className="group bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.1)] rounded-[8px] size-[30px] flex items-center justify-center cursor-pointer transition-colors">
              <Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
            </button>
          </div>

          <div className="h-px bg-[rgba(255,255,255,0.06)]" />

          <div className="px-[20px] py-[16px] flex flex-col gap-[14px] flex-1 overflow-y-auto chat-scrollbar">
            <div>
              <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[10px]">Сгенерировано</p>
              <div className="bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[12px]">
                <div className="flex items-center gap-[10px]">
                  {viewModel && <ModelIcon modelId={viewModel.id} size={28} />}
                  <div>
                    <p className="text-[14px] text-white">{viewModel?.name || 'Unknown'}</p>
                    <p className="text-[11px] text-[rgba(255,255,255,0.35)]">
                      {item.type === 'video' ? 'Видео' : 'Изображение'} &bull; {item.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider mb-[8px]">Промпт</p>
              <div className="bg-[#13121a] rounded-[12px] p-[14px]">
                <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-[20px]">{promptText}</p>
              </div>
              <button
                onClick={handleCopy}
                className="group mt-[8px] flex items-center gap-[6px] text-[12px] text-[rgba(255,255,255,0.35)] hover:text-[#888ae5] transition-colors cursor-pointer"
              >
                <span className="relative inline-block size-[13px]">
                  <span className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0" style={{ backgroundColor: 'rgba(255,255,255,0.35)', maskImage: `url('/icons/${copied ? 'chekmark' : 'copy'}_icon.png')`, WebkitMaskImage: `url('/icons/${copied ? 'chekmark' : 'copy'}_icon.png')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
                  <span className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ backgroundColor: '#888ae5', maskImage: `url('/icons/${copied ? 'chekmark' : 'copy'}_icon.png')`, WebkitMaskImage: `url('/icons/${copied ? 'chekmark' : 'copy'}_icon.png')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
                </span>
                {copied ? 'Скопировано!' : 'Скопировать промпт'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-[20px] pb-[20px] pt-[8px] flex flex-col gap-[8px] border-t border-[rgba(255,255,255,0.06)]">
            <button
              onClick={() => { if (!isLoggedIn) { router.push('/auth'); return; } router.push(`/chat/${item.modelId}?prompt=${encodeURIComponent(promptText)}`); }}
              className="w-full bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] py-[12px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors"
            >
              <span className="text-[14px] text-white font-semibold">Повторить</span>
            </button>
            <div className="flex gap-[8px]">
              <button className="flex-1 flex items-center justify-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)] rounded-[10px] py-[10px] transition-colors cursor-pointer">
                <Image src="/icons/dowland_icon.png" alt="" width={14} height={14} className="brightness-0 invert" />
                <span className="text-[13px] text-white">Скачать</span>
              </button>
              <button
                onClick={onShare}
                className="flex-1 flex items-center justify-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)] rounded-[10px] py-[10px] transition-colors cursor-pointer"
              >
                <ShareIcon size={14} className="text-white" />
                <span className="text-[13px] text-white">Поделиться</span>
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex-1 flex items-center justify-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(136,138,229,0.08)] rounded-[10px] py-[10px] transition-colors cursor-pointer"
              >
                <Image src="/assets/models/trash_icon.png" alt="" width={14} height={14} className="brightness-0 invert" />
                <span className="text-[13px] text-white">Удалить</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

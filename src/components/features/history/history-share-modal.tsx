'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check } from 'lucide-react'
import { useSharedStore } from '@/stores/shared'

interface HistoryShareModalProps {
  open: boolean
  itemId: string
  itemTitle: string
  itemModelId: string
  itemModelName: string
  itemType: 'text' | 'image' | 'video'
  onClose: () => void
}

export function HistoryShareModal({ open, itemTitle, itemModelId, itemModelName, itemType, onClose }: HistoryShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const shareItem = useSharedStore((s) => s.shareItem)

  useEffect(() => {
    if (!open) { setShareUrl(''); setCopied(false); return }
    const id = shareItem({
      prompt: itemTitle,
      response: '',
      modelId: itemModelId,
      modelName: itemModelName,
      type: itemType,
      createdAt: new Date().toISOString(),
    })
    setShareUrl(`${window.location.origin}/share/${id}`)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareTitle = `Генерация «${itemTitle}» — Black Mount AI`

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[200] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" />
          <motion.div className="relative bg-[#1a1a22] rounded-[24px] w-[440px] max-w-[90vw] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
            <div className="flex items-center justify-between px-[28px] pt-[24px] pb-[16px]">
              <p className="text-[20px] text-white font-extrabold">Поделиться</p>
              <button onClick={onClose} className="bg-[rgba(255,255,255,0.06)] rounded-[12px] size-[36px] flex items-center justify-center cursor-pointer hover:bg-[rgba(136,138,229,0.1)] transition-colors"><X size={16} className="text-[rgba(255,255,255,0.6)]" /></button>
            </div>
            <div className="flex items-center justify-center gap-[20px] px-[28px] pb-[28px]">
              <ShareButton
                onClick={handleCopy}
                icon={copied ? <Check size={20} className="text-[#888ae5]" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
                label={copied ? 'Скопировано!' : 'Копировать'}
                active={copied}
              />
              <ShareLink
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>}
                label="Telegram"
              />
              <ShareLink
                href={`https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.72-.576.72z" /></svg>}
                label="VK"
              />
              <ShareLink
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>}
                label="Reddit"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ShareButton({ onClick, icon, label, active }: { onClick: () => void; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-[8px] group cursor-pointer">
      <div className={`size-[56px] rounded-full border flex items-center justify-center transition-all ${active ? 'bg-[rgba(136,138,229,0.2)] border-[rgba(136,138,229,0.4)]' : 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.1)] group-hover:bg-[rgba(255,255,255,0.1)]'}`}>
        {icon}
      </div>
      <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-medium">{label}</span>
    </button>
  )
}

function ShareLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-[8px] group cursor-pointer">
      <div className="size-[56px] rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:bg-[rgba(255,255,255,0.1)] transition-colors">
        {icon}
      </div>
      <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-medium">{label}</span>
    </a>
  )
}

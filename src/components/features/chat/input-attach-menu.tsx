'use client'

import { ImageIcon, FileText, Brain, Globe, Check } from 'lucide-react'
import { motion } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'

const imgXsCoin = APP_ASSETS.coin

interface InputAttachMenuProps {
  isTextModel: boolean
  webSearchActive: boolean
  setWebSearchActive: (v: boolean) => void
  deepResearchActive: boolean
  setDeepResearchActive: (v: boolean) => void
  onClose: () => void
}

export function InputAttachMenu({
  isTextModel, webSearchActive, setWebSearchActive,
  deepResearchActive, setDeepResearchActive, onClose,
}: InputAttachMenuProps) {
  return (
    <motion.div
      className="absolute left-0 bottom-[calc(100%+8px)] bg-[#1e1d26] rounded-[14px] w-[230px] py-[6px] z-50 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 6 }}
      transition={{ type: 'spring', damping: 24, stiffness: 400 }}
    >
      <button onClick={onClose} className="flex items-center gap-[10px] w-full px-[14px] py-[9px] transition-colors hover:bg-[rgba(136,138,229,0.08)] cursor-pointer">
        <ImageIcon size={15} className="text-[rgba(255,255,255,0.5)] shrink-0" />
        <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Прикрепить фото</span>
        {isTextModel && <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
      </button>
      <button onClick={onClose} className="flex items-center gap-[10px] w-full px-[14px] py-[9px] transition-colors hover:bg-[rgba(136,138,229,0.08)] cursor-pointer">
        <FileText size={15} className="text-[rgba(255,255,255,0.5)] shrink-0" />
        <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Прикрепить файл</span>
        {isTextModel && <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
      </button>
      {isTextModel && (
        <>
          <div className="border-t border-[rgba(255,255,255,0.06)] my-[4px]" />
          <button
            onClick={() => { setWebSearchActive(!webSearchActive); onClose() }}
            className={`flex items-center gap-[10px] w-full px-[14px] py-[9px] hover:bg-[rgba(136,138,229,0.08)] transition-colors cursor-pointer ${webSearchActive ? 'bg-[rgba(136,138,229,0.12)]' : ''}`}
          >
            <Globe size={15} className={`shrink-0 ${webSearchActive ? 'text-[#888ae5]' : 'text-[rgba(255,255,255,0.5)]'}`} />
            <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Веб-поиск</span>
            {webSearchActive ? <Check size={12} className="text-[#888ae5] shrink-0" /> : <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
          </button>
          <button
            onClick={() => { setDeepResearchActive(!deepResearchActive); onClose() }}
            className={`flex items-center gap-[10px] w-full px-[14px] py-[9px] hover:bg-[rgba(136,138,229,0.08)] transition-colors cursor-pointer ${deepResearchActive ? 'bg-[rgba(136,138,229,0.12)]' : ''}`}
          >
            <Brain size={15} className={`shrink-0 ${deepResearchActive ? 'text-[#888ae5]' : 'text-[rgba(255,255,255,0.5)]'}`} />
            <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Думать</span>
            {deepResearchActive ? <Check size={12} className="text-[#888ae5] shrink-0" /> : <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
          </button>
        </>
      )}
    </motion.div>
  )
}

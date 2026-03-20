'use client'

import { useRef, useEffect } from 'react'
import { Plus, ImageIcon, FileText, Brain, X, Globe, Check, ArrowUp, StopCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { AnimatedPlaceholder } from './animated-placeholder'
import { InputModelDropdown } from './input-model-dropdown'
import type { AIModel } from '@/types'

const imgXsCoin = APP_ASSETS.coin
const imgMicMask = '/assets/models/9505d755a8d717e73ecc0c7903ce4f73c5ba426e.png'

function MicIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgMicMask}')`, WebkitMaskImage: `url('${imgMicMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

interface ChatInputProps {
  input: string
  setInput: (v: string) => void
  handleSend: () => void
  handleStopGeneration: () => void
  handleModelSwitch: (m: AIModel) => void
  model: AIModel
  isTextModel: boolean
  isGenerating: boolean
  isRecording: boolean
  toggleRecording: () => void
  cancelRecording: () => void
  modelLocked: boolean
  messagesLength: number
  dynamicCost: number
  webSearchActive: boolean
  setWebSearchActive: (v: boolean) => void
  deepResearchActive: boolean
  setDeepResearchActive: (v: boolean) => void
  attachOpen: boolean
  setAttachOpen: (v: boolean) => void
}

export function ChatInput({
  input, setInput, handleSend, handleStopGeneration, handleModelSwitch,
  model, isTextModel, isGenerating, isRecording, toggleRecording, cancelRecording,
  modelLocked, messagesLength, dynamicCost,
  webSearchActive, setWebSearchActive, deepResearchActive, setDeepResearchActive,
  attachOpen, setAttachOpen,
}: ChatInputProps) {
  const attachRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) setAttachOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setAttachOpen])

  return (
    <div className="flex justify-center pb-[28px] px-[40px] shrink-0 relative z-[20]">
      <div className="w-full max-w-[620px] flex flex-col gap-[8px]">
        <div className="bg-[rgba(61,57,80,0.5)] border border-[rgba(40,40,40,0.7)] rounded-[30px] w-full flex flex-col relative">
          <div className="relative">
            <AnimatedPlaceholder visible={!modelLocked && !input && messagesLength === 0} />
            <textarea
              className="bg-transparent resize-none outline-none font-manrope font-normal leading-[22px] text-[14px] text-white px-[26px] pt-[18px] pb-[6px] w-full relative z-[1]"
              placeholder={modelLocked ? 'Модель доступна по подписке PRO' : messagesLength > 0 ? 'Напишите запрос...' : ''}
              rows={2}
              value={input}
              disabled={modelLocked}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between px-[22px] pb-[14px] relative z-[1]">
            <div className="flex items-center gap-[8px]">
              <div ref={attachRef} className="relative">
                <button onClick={() => setAttachOpen(!attachOpen)} className="opacity-50 hover:opacity-80 transition-opacity cursor-pointer">
                  <Plus size={20} className="text-white" />
                </button>
                <AnimatePresence>
                  {attachOpen && (
                    <motion.div
                      className="absolute left-0 bottom-[calc(100%+8px)] bg-[#1e1d26] rounded-[14px] w-[230px] py-[6px] z-50 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ type: 'spring', damping: 24, stiffness: 400 }}
                    >
                      <button onClick={() => setAttachOpen(false)} className="flex items-center gap-[10px] w-full px-[14px] py-[9px] transition-colors hover:bg-[rgba(136,138,229,0.08)] cursor-pointer">
                        <ImageIcon size={15} className="text-[rgba(255,255,255,0.5)] shrink-0" />
                        <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Прикрепить фото</span>
                        {isTextModel && <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
                      </button>
                      <button onClick={() => setAttachOpen(false)} className="flex items-center gap-[10px] w-full px-[14px] py-[9px] transition-colors hover:bg-[rgba(136,138,229,0.08)] cursor-pointer">
                        <FileText size={15} className="text-[rgba(255,255,255,0.5)] shrink-0" />
                        <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Прикрепить файл</span>
                        {isTextModel && <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
                      </button>
                      {isTextModel && (
                        <>
                          <div className="border-t border-[rgba(255,255,255,0.06)] my-[4px]" />
                          <button
                            onClick={() => { setWebSearchActive(!webSearchActive); setAttachOpen(false) }}
                            className={`flex items-center gap-[10px] w-full px-[14px] py-[9px] hover:bg-[rgba(136,138,229,0.08)] transition-colors cursor-pointer ${webSearchActive ? 'bg-[rgba(136,138,229,0.12)]' : ''}`}
                          >
                            <Globe size={15} className={`shrink-0 ${webSearchActive ? 'text-[#888ae5]' : 'text-[rgba(255,255,255,0.5)]'}`} />
                            <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Веб-поиск</span>
                            {webSearchActive ? <Check size={12} className="text-[#888ae5] shrink-0" /> : <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
                          </button>
                          <button
                            onClick={() => { setDeepResearchActive(!deepResearchActive); setAttachOpen(false) }}
                            className={`flex items-center gap-[10px] w-full px-[14px] py-[9px] hover:bg-[rgba(136,138,229,0.08)] transition-colors cursor-pointer ${deepResearchActive ? 'bg-[rgba(136,138,229,0.12)]' : ''}`}
                          >
                            <Brain size={15} className={`shrink-0 ${deepResearchActive ? 'text-[#888ae5]' : 'text-[rgba(255,255,255,0.5)]'}`} />
                            <span className="font-manrope font-medium text-[13px] text-white flex-1 text-left">Думать</span>
                            {deepResearchActive ? <Check size={12} className="text-[#888ae5] shrink-0" /> : <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-[3px] shrink-0">5 <img alt="" src={imgXsCoin} className="size-[10px]" /></span>}
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="font-manrope font-extrabold leading-[22px] text-[15px] text-[#d5d4d4]">{dynamicCost === 0 ? 'Бесплатно' : dynamicCost}</p>
              {dynamicCost > 0 && <div className="relative size-[14px]">
                <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgXsCoin} />
              </div>}
              <AnimatePresence>
                {isTextModel && webSearchActive && (
                  <motion.div initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.9, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden ml-[4px]">
                    <div className="group flex items-center gap-[5px] rounded-[12px] px-[8px] py-[3px] cursor-default transition-all hover:bg-[rgba(136,138,229,0.12)]">
                      <Globe size={13} className="text-[#888ae5]" />
                      <span className="text-[13px] text-[#888ae5] whitespace-nowrap font-semibold">Веб-поиск</span>
                      <button onClick={() => setWebSearchActive(false)} className="opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-[#888ae5] hover:text-white"><X size={12} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isTextModel && deepResearchActive && (
                  <motion.div initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.9, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden ml-[2px]">
                    <div className="group flex items-center gap-[5px] rounded-[12px] px-[8px] py-[3px] cursor-default transition-all hover:bg-[rgba(136,138,229,0.12)]">
                      <Brain size={13} className="text-[#888ae5]" />
                      <span className="text-[13px] text-[#888ae5] whitespace-nowrap font-semibold">Думать</span>
                      <button onClick={() => setDeepResearchActive(false)} className="opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-[#888ae5] hover:text-white"><X size={12} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-[6px]">
              <AnimatePresence>
                {!isRecording && (
                  <motion.div initial={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0, marginRight: 0 }} animate={{ opacity: 1, width: 'auto' }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                    <InputModelDropdown currentModel={model} onSelect={handleModelSwitch} />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isRecording && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }} onClick={cancelRecording} className="text-[12px] text-[rgba(255,255,255,0.5)] hover:text-white cursor-pointer transition-colors px-[8px] py-[4px] rounded-[8px] hover:bg-[rgba(255,255,255,0.06)] font-medium">
                    Отмена
                  </motion.button>
                )}
              </AnimatePresence>

              {isGenerating ? (
                <motion.button
                  onClick={handleStopGeneration}
                  className="size-[32px] rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.18)] flex items-center justify-center cursor-pointer transition-colors border border-[rgba(255,255,255,0.1)]"
                  title="Остановить генерацию"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="size-[12px] rounded-[2px] bg-white" />
                </motion.button>
              ) : isTextModel ? (
                <div className="relative size-[34px] flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {input.trim() ? (
                      <motion.button
                        key="send-btn"
                        onClick={handleSend}
                        className="absolute inset-0 m-auto size-[28px] rounded-full bg-[#888ae5] hover:bg-[#9a9cf0] flex items-center justify-center cursor-pointer"
                        title="Отправить"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        <ArrowUp size={15} className="text-white" />
                      </motion.button>
                    ) : isRecording ? (
                      <motion.button
                        key="stop-rec-btn"
                        onClick={toggleRecording}
                        className="absolute inset-0 m-auto flex items-center justify-center cursor-pointer"
                        title="Остановить запись"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        <motion.div className="absolute inset-[-4px] rounded-full border-2 border-[#888ae5]" animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                        <motion.div className="absolute inset-[-10px] rounded-full border border-[rgba(136,138,229,0.3)]" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.15, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
                        <div className="size-[36px] flex items-center justify-center rounded-full bg-[rgba(136,138,229,0.25)]">
                          <StopCircle size={18} className="text-[#888ae5]" />
                        </div>
                      </motion.button>
                    ) : (
                      <motion.button
                        key="mic-btn"
                        onClick={toggleRecording}
                        className="absolute inset-0 m-auto size-[34px] rounded-full hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center cursor-pointer"
                        title="Голосовой ввод"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MicIcon size={19} className="text-[rgba(255,255,255,0.3)]" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  className={`size-[28px] rounded-full flex items-center justify-center cursor-pointer transition-colors ${input.trim() ? 'bg-[#888ae5] hover:bg-[#9a9cf0]' : 'bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)]'}`}
                  title="Отправить"
                >
                  <ArrowUp size={15} className={input.trim() ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-[6px]">
          <p className="text-[10px] text-[rgba(255,255,255,0.18)]">Нейросеть может ошибаться. Проверяйте важную информацию.</p>
        </div>
      </div>
    </div>
  )
}

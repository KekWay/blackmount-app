'use client'

import { useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { AnimatedPlaceholder } from './animated-placeholder'
import { InputAttachMenu } from './input-attach-menu'
import { InputActionButtons } from './input-action-buttons'
import type { AIModel } from '@/types'

const imgXsCoin = APP_ASSETS.coin

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) setAttachOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setAttachOpen])

  return (
    <div className="flex justify-center pb-[80px] md:pb-[28px] px-[12px] md:px-[24px] lg:px-[40px] shrink-0 relative z-[20]">
      <div className="w-full max-w-[620px] flex flex-col gap-[8px]">
        <div className="bg-[rgba(61,57,80,0.5)] border border-[rgba(40,40,40,0.7)] rounded-[30px] w-full flex flex-col relative">
          <div className="relative overflow-hidden rounded-t-[30px]">
            <AnimatedPlaceholder visible={!modelLocked && !input && messagesLength === 0} />
            <textarea
              ref={textareaRef}
              className="bg-transparent resize-none outline-none font-manrope font-normal leading-[22px] text-[14px] text-white px-[26px] pt-[18px] pb-[6px] w-full relative z-[1] overflow-y-auto chat-scrollbar"
              placeholder={modelLocked ? 'Модель доступна по подписке PRO' : messagesLength > 0 ? 'Напишите запрос...' : ''}
              rows={1}
              value={input}
              disabled={modelLocked}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: 44, maxHeight: 120 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between px-[22px] pb-[14px] relative z-[1]">
            <div className="flex items-center gap-[8px]">
              <div ref={attachRef} className="relative flex items-center">
                <button onClick={() => setAttachOpen(!attachOpen)} className="size-[34px] rounded-full hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center cursor-pointer transition-colors">
                  <NextImage src="/icons/plus_icon.png" alt="" width={16} height={16} className="brightness-0 invert opacity-30" />
                </button>
                <AnimatePresence>
                  {attachOpen && (
                    <InputAttachMenu
                      isTextModel={isTextModel}
                      webSearchActive={webSearchActive}
                      setWebSearchActive={setWebSearchActive}
                      deepResearchActive={deepResearchActive}
                      setDeepResearchActive={setDeepResearchActive}
                      inputText={input}
                      setInputText={setInput}
                      onClose={() => setAttachOpen(false)}
                    />
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
                      <img src={APP_ASSETS.webpoiskChat} alt="" className="size-[13px] object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(50%) saturate(600%) hue-rotate(210deg)' }} />
                      <span className="text-[13px] text-[#888ae5] whitespace-nowrap font-semibold">Веб-поиск</span>
                      <button onClick={(e) => { e.stopPropagation(); setWebSearchActive(false) }} aria-label="Отключить веб-поиск" className="opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><div style={{ width: 7, height: 7, backgroundColor: '#888ae5', maskImage: "url('/icons/close_icon.png')", WebkitMaskImage: "url('/icons/close_icon.png')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isTextModel && deepResearchActive && (
                  <motion.div initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.9, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden ml-[2px]">
                    <div className="group flex items-center gap-[5px] rounded-[12px] px-[8px] py-[3px] cursor-default transition-all hover:bg-[rgba(136,138,229,0.12)]">
                      <img src={APP_ASSETS.brainChat} alt="" className="size-[13px] object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(50%) saturate(600%) hue-rotate(210deg)' }} />
                      <span className="text-[13px] text-[#888ae5] whitespace-nowrap font-semibold">Думать</span>
                      <button onClick={(e) => { e.stopPropagation(); setDeepResearchActive(false) }} aria-label="Отключить глубокое исследование" className="opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><div style={{ width: 7, height: 7, backgroundColor: '#888ae5', maskImage: "url('/icons/close_icon.png')", WebkitMaskImage: "url('/icons/close_icon.png')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <InputActionButtons
              input={input}
              handleSend={handleSend}
              handleStopGeneration={handleStopGeneration}
              handleModelSwitch={handleModelSwitch}
              model={model}
              isTextModel={isTextModel}
              isGenerating={isGenerating}
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              cancelRecording={cancelRecording}
            />
          </div>
        </div>
        <div className="flex items-center justify-center mt-[6px]">
          <p className="text-[10px] text-[rgba(255,255,255,0.18)]">Нейросеть может ошибаться. Проверяйте важную информацию.</p>
        </div>
      </div>
    </div>
  )
}

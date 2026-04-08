'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { InputModelDropdown } from './input-model-dropdown'
import type { AIModel } from '@/types'

const imgMicMask = '/assets/models/mic-mask.png'

function MicIcon({ size, className }: { size: number; className?: string }) {
  return <div className={className} style={{ width: size, height: size, backgroundColor: 'currentColor', maskImage: `url('${imgMicMask}')`, WebkitMaskImage: `url('${imgMicMask}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
}

interface InputActionButtonsProps {
  input: string
  handleSend: () => void
  handleStopGeneration: () => void
  handleModelSwitch: (m: AIModel) => void
  model: AIModel
  isTextModel: boolean
  isGenerating: boolean
  isRecording: boolean
  toggleRecording: () => void
  cancelRecording: () => void
}

export function InputActionButtons({
  input, handleSend, handleStopGeneration, handleModelSwitch,
  model, isTextModel, isGenerating, isRecording, toggleRecording, cancelRecording,
}: InputActionButtonsProps) {
  const sendLockRef = useRef(false)
  const handleSendClick = () => {
    if (sendLockRef.current) return
    sendLockRef.current = true
    handleSend()
    setTimeout(() => { sendLockRef.current = false }, 1000)
  }
  return (
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
                onClick={handleSendClick}
                className="absolute inset-0 m-auto size-[28px] rounded-full bg-[#888ae5] hover:bg-[#9a9cf0] flex items-center justify-center cursor-pointer"
                title="Отправить"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <img src="/assets/models/arrow_up.png" alt="" className="size-[11px] object-contain brightness-0 invert" />
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
                  <div style={{ width: 14, height: 14, backgroundColor: '#888ae5', maskImage: "url('/icons/square_icon.png')", WebkitMaskImage: "url('/icons/square_icon.png')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
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
          onClick={handleSendClick}
          className={`size-[28px] rounded-full flex items-center justify-center cursor-pointer transition-colors ${input.trim() ? 'bg-[#888ae5] hover:bg-[#9a9cf0]' : 'bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)]'}`}
          title="Отправить"
        >
          <img src="/assets/models/arrow_up.png" alt="" className={`size-[11px] object-contain brightness-0 invert ${input.trim() ? '' : 'opacity-40'}`} />
        </button>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { PromptDetailModal } from '@/components/features/prompts/prompt-detail-modal'
import type { PromptItem } from '@/components/features/prompts/prompts-data'

const promptItems: PromptItem[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1765410849364-56b49c81c657?w=600&q=80', type: 'image', prompt: 'Surreal portrait of a woman', modelId: 'nanobanana', theme: 'portrait', span: 'col-span-1 row-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1688377051459-aebb99b42bff?w=600&q=80', type: 'video', prompt: 'Abstract fluid motion', modelId: 'veo31', theme: 'abstract', span: 'col-span-1 row-span-1' },
  { id: 3, src: 'https://images.unsplash.com/photo-1644328293665-a783b37f25d4?w=600&q=80', type: 'image', prompt: 'Cyberpunk cityscape', modelId: 'flux', theme: 'cityscape', span: 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2' },
  { id: 4, src: 'https://images.unsplash.com/photo-1616651181620-9906d6e43fc3?w=600&q=80', type: 'image', prompt: 'Fantasy landscape', modelId: 'nanobanana', theme: 'landscape', span: 'col-span-1 row-span-1' },
  { id: 5, src: 'https://images.unsplash.com/photo-1768400730812-039f5971185d?w=600&q=80', type: 'video', prompt: 'Ocean waves cinematic', modelId: 'kling', theme: 'nature', span: 'col-span-1 row-span-1' },
  { id: 6, src: 'https://images.unsplash.com/photo-1769118717400-69c5b0933e4d?w=600&q=80', type: 'image', prompt: 'Neon portrait', modelId: 'flux', theme: 'portrait', span: 'col-span-1 row-span-2 hidden sm:block' },
  { id: 7, src: 'https://images.unsplash.com/photo-1761920521457-ce2b0dbb67aa?w=600&q=80', type: 'image', prompt: 'Minimalist architecture', modelId: 'nanobanana', theme: 'architecture', span: 'col-span-1 row-span-1' },
  { id: 8, src: 'https://images.unsplash.com/flagged/photo-1564783750566-e2d08c2bf293?w=600&q=80', type: 'video', prompt: 'Dancing lights', modelId: 'veo31', theme: 'abstract', span: 'col-span-1 row-span-1 hidden sm:block' },
]

export function PromptsPreview() {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<PromptItem | null>(null)

  return (
    <section className="mb-[32px] md:mb-[40px]">
      <div className="flex items-center justify-between mb-[12px] md:mb-[16px]">
        <div>
          <h2
            className="text-[20px] md:text-[24px] font-manrope font-extrabold text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(90deg, #fff 0%, rgba(136,138,229,0.7) 50%, #fff 100%)',
              backgroundSize: '200% 100%',
              animation: 'spotlight-shimmer 4s ease-in-out infinite',
            }}
          >
            Промпты
          </h2>
          <p className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.4)] mt-[2px]">
            Лучшие промпты и генерации от сообщества
          </p>
        </div>
        <button
          onClick={() => router.push('/prompts')}
          className="flex items-center gap-[6px] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] rounded-[12px] px-[12px] md:px-[16px] h-[32px] md:h-[36px] transition-colors cursor-pointer"
        >
          <span className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.6)]">
            Смотреть все
          </span>
          <Image src="/icons/arrow_right_icon.png" alt="" width={11} height={11} className="brightness-0 invert opacity-40" />
        </button>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 auto-rows-[120px] sm:auto-rows-[140px] lg:auto-rows-[160px] gap-[8px] md:gap-[10px]">
          {promptItems.map((item) => (
            <div
              key={item.id}
              className={`${item.span} rounded-[12px] overflow-hidden relative group cursor-pointer`}
              onClick={() => setSelectedItem(item)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-[8px] right-[8px] bg-[rgba(0,0,0,0.4)] backdrop-blur-[6px] rounded-[8px] w-[28px] h-[28px] md:w-[30px] md:h-[30px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(136,138,229,0.15)]">
                <img src="/icons/heart_icon.png" alt="" width={12} height={12} className="brightness-0 invert opacity-70" />
              </div>
              {item.type === 'video' && (
                <div className="absolute bottom-[8px] left-[8px] bg-[rgba(0,0,0,0.5)] rounded-full w-[24px] h-[24px] md:w-[28px] md:h-[28px] flex items-center justify-center backdrop-blur-sm">
                  <Play size={10} className="text-white ml-[2px]" fill="white" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
        />
      </div>

      <AnimatePresence>
        {selectedItem && (
          <PromptDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const promptItems = [
  { id: '1', src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=500&fit=crop', type: 'image' as const, prompt: 'Горный пейзаж на закате с туманом в долине', modelId: 'flux', theme: 'Природа' },
  { id: '2', src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop', type: 'image' as const, prompt: 'Киберпанк город будущего с неоновыми вывесками', modelId: 'nanobanana', theme: 'Киберпанк' },
  { id: '3', src: 'https://images.unsplash.com/photo-1685704571428-43f092788a4e?w=400&h=450&fit=crop', type: 'image' as const, prompt: 'Портрет девушки в стиле аниме с цветами', modelId: 'flux', theme: 'Аниме' },
  { id: '4', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=550&fit=crop', type: 'image' as const, prompt: 'Фантастический лес с светящимися грибами', modelId: 'nanobanana', theme: 'Природа' },
  { id: '5', src: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=500&fit=crop', type: 'video' as const, prompt: 'Полёт камеры над ночным городом с огнями', modelId: 'sora2', theme: 'Киберпанк' },
  { id: '6', src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop', type: 'image' as const, prompt: 'Океанские волны с высоты птичьего полёта', modelId: 'flux', theme: 'Природа' },
  { id: '7', src: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=450&fit=crop', type: 'image' as const, prompt: 'Робот-самурай в японском саду', modelId: 'nanobanana', theme: 'Фэнтези' },
  { id: '8', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=500&fit=crop', type: 'image' as const, prompt: 'Космическая станция на орбите Земли', modelId: 'flux', theme: 'Космос' },
  { id: '9', src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=550&fit=crop', type: 'video' as const, prompt: 'Танцующие северные сияния над горами', modelId: 'kling', theme: 'Природа' },
  { id: '10', src: 'https://images.unsplash.com/photo-1608178398319-48f814d0750c?w=400&h=500&fit=crop', type: 'image' as const, prompt: 'Аниме девушка с мечом под дождём', modelId: 'nanobanana', theme: 'Аниме' },
]

const themes = ['Все', ...Array.from(new Set(promptItems.map((i) => i.theme)))]

export default function PromptsPage() {
  const [activeTheme, setActiveTheme] = useState('Все')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = activeTheme === 'Все'
    ? promptItems
    : promptItems.filter((i) => i.theme === activeTheme)

  const selected = promptItems.find((i) => i.id === selectedId)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Промпты</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              activeTheme === theme
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {theme}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative mb-3 cursor-pointer overflow-hidden rounded-xl break-inside-avoid"
            onClick={() => setSelectedId(item.id)}
          >
            <Image
              src={item.src}
              alt={item.prompt}
              width={400}
              height={500}
              unoptimized
              className="w-full object-cover transition-transform group-hover:scale-105"
            />
            {item.type === 'video' && (
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                VIDEO
              </span>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <Image
              src={selected.src}
              alt={selected.prompt}
              width={400}
              height={500}
              unoptimized
              className="mb-4 w-full rounded-xl object-cover"
            />
            <p className="text-sm text-foreground">{selected.prompt}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Модель: {selected.modelId} / {selected.theme}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

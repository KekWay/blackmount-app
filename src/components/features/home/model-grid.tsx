'use client'

import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import type { AIModel } from '@/types'
import { ModelCard } from '@/components/features/models/model-card'
import { useSubscriptionStore } from '@/stores/subscription'
import { useHydrated } from '@/lib/use-hydration'
import type { FilterCategory } from './filter-tabs'

interface ModelGridProps {
  models: AIModel[]
  activeFilter: FilterCategory
  searchQuery: string
  onResetFilters: () => void
}

export function ModelGrid({ models, activeFilter, searchQuery, onResetFilters }: ModelGridProps) {
  const router = useRouter()
  const isModelLocked = useSubscriptionStore((s) => s.isModelLocked)
  const hydrated = useHydrated()

  if (models.length === 0) {
    return (
      <div className="w-full py-[60px] flex flex-col items-center justify-center gap-3">
        {searchQuery ? (
          <img src="/assets/models/search-empty.png" alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
        ) : (
          <div className="size-14 flex items-center justify-center mb-1">
            {activeFilter === 'favorites' ? (
              <img src="/icons/yellow_star.png" alt="" width={40} height={40} className="opacity-50" />
            ) : (
              <Sparkles size={24} className="text-primary/35" />
            )}
          </div>
        )}
        <p className="text-[15px] text-white/50 font-semibold">
          {searchQuery
            ? 'По вашему запросу ничего не найдено'
            : activeFilter === 'favorites'
              ? 'Нет избранных моделей'
              : 'Нет моделей в этой категории'}
        </p>
        <p className="text-[13px] text-white/25 text-center max-w-[320px]">
          {searchQuery
            ? `По запросу "${searchQuery}" не найдено нейросетей.`
            : activeFilter === 'favorites'
              ? 'Добавьте модели в избранное нажав ★ на карточке'
              : 'Модели этой категории скоро появятся'}
        </p>
        {(searchQuery || activeFilter !== 'all') && (
          <button
            onClick={onResetFilters}
            className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-primary cursor-pointer hover:bg-primary/[0.08] font-semibold transition-colors"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-[20px] sm:justify-start sm:gap-[20px] md:gap-5">
      {models.map((model) => (
        <div key={model.id}>
          <ModelCard
            model={model}
            locked={hydrated ? isModelLocked(model.id) : false}
            onClick={() => router.push(`/chat/${model.id}`)}
          />
        </div>
      ))}
    </div>
  )
}

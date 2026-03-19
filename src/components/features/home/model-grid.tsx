'use client'

import { useRouter } from 'next/navigation'
import { Heart, Search, Sparkles } from 'lucide-react'
import type { AIModel } from '@/types'
import { ModelCard } from '@/components/features/models/model-card'
import { useSubscriptionStore } from '@/stores/subscription'
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

  if (models.length === 0) {
    return (
      <div className="w-full py-[60px] flex flex-col items-center justify-center gap-3">
        <div className="size-14 rounded-full flex items-center justify-center mb-1 bg-primary/[0.08]">
          {activeFilter === 'favorites' ? (
            <Heart size={24} className="text-primary/35" />
          ) : searchQuery ? (
            <Search size={24} className="text-primary/35" />
          ) : (
            <Sparkles size={24} className="text-primary/35" />
          )}
        </div>
        <p className="text-[15px] text-white/50 font-semibold">
          {searchQuery
            ? 'Ничего не найдено'
            : activeFilter === 'favorites'
              ? 'Нет избранных моделей'
              : 'Нет моделей в этой категории'}
        </p>
        <p className="text-[13px] text-white/25 text-center max-w-[320px]">
          {searchQuery
            ? `По запросу "${searchQuery}" не найдено нейросетей.`
            : activeFilter === 'favorites'
              ? 'Закрепите модель в чате, и она появится здесь'
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
    <div className="flex flex-wrap gap-5">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          locked={isModelLocked(model.id)}
          onClick={() => router.push(`/chat/${model.id}`)}
        />
      ))}
    </div>
  )
}

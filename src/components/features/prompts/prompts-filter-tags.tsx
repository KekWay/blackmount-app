'use client'

import { aiModels } from '@/data/ai-models'
import { ModelIcon } from '@/components/shared/model-icon'

interface PromptsFilterTagsProps {
  activeModelFilter: string
  onModelChange: (id: string) => void
}

export function PromptsFilterTags({
  activeModelFilter,
  onModelChange,
}: PromptsFilterTagsProps) {
  const modelFilters = [
    { id: 'all', name: 'Все модели' },
    ...aiModels.filter((m) => m.category === 'image' || m.category === 'video'),
  ]

  return (
    <div className="flex gap-[4px] overflow-x-auto pb-[4px] mb-[20px] [scrollbar-width:none]">
      {modelFilters.map((mf) => {
        const isAll = mf.id === 'all'
        return (
          <button
            key={mf.id}
            onClick={() => onModelChange(mf.id)}
            className={`shrink-0 flex items-center gap-[6px] rounded-[10px] px-[14px] py-[7px] text-[13px] transition-colors cursor-pointer ${
              activeModelFilter === mf.id
                ? 'bg-[#39375b] text-white'
                : 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            {!isAll && <ModelIcon modelId={mf.id} size={16} />}
            {mf.name}
          </button>
        )
      })}
    </div>
  )
}

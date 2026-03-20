'use client'

import { ModelIcon } from '@/components/shared/model-icon'
import type { AIModel } from '@/types/models'

interface KnowledgeHeroProps {
  model: AIModel
  intro: string
}

export function KnowledgeHero({ model, intro }: KnowledgeHeroProps) {
  return (
    <div className="mb-[32px]">
      <div className="flex items-center gap-[12px] mb-[8px]">
        <div className="shrink-0 flex items-center justify-center size-[32px]">
          <ModelIcon modelId={model.id} size={32} />
        </div>
        <h1 className="text-[28px] text-white leading-[32px] font-bold">{model.name}</h1>
      </div>
      <p className="text-[13px] text-[rgba(255,255,255,0.4)] ml-[44px]">{intro}</p>
    </div>
  )
}

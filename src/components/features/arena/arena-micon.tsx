'use client'

import { ModelIcon } from '@/components/shared/model-icon'
import type { ArenaModel } from '@/data/arena-models'

interface MIconProps {
  model: ArenaModel
  size: number
}

export function MIcon({ model, size }: MIconProps) {
  if (model.aiModelRef) {
    return <ModelIcon modelId={model.aiModelRef} size={size} />
  }
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center"
      style={{ width: size, height: size, background: model.gradient }}
    >
      <span
        className="text-white font-extrabold"
        style={{ fontSize: size * 0.35 }}
      >
        {model.name.charAt(0)}
      </span>
    </div>
  )
}

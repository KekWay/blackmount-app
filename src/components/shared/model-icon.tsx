'use client'

import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'

interface ModelIconProps {
  modelId: string
  size: number
}

export function ModelIcon({ modelId, size }: ModelIconProps) {
  const assets = MODEL_ASSETS[modelId as ModelId]
  if (!assets) return null

  const src = 'colorLogo' in assets ? assets.colorLogo : null
  if (!src) return null

  return (
    <img
      src={src}
      alt={modelId}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  )
}

export function ModelIconWhite({ modelId, size }: ModelIconProps) {
  const assets = MODEL_ASSETS[modelId as ModelId]
  if (!assets) return null

  // For mask-based icons (chatgpt, sora2)
  if ('maskImage' in assets && assets.maskImage) {
    return (
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: '#ffffff',
            maskImage: `url('${assets.maskImage}')`,
            WebkitMaskImage: `url('${assets.maskImage}')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      </div>
    )
  }

  const src = 'colorLogo' in assets ? assets.colorLogo : null
  if (!src) return null

  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img
        alt={modelId}
        src={src}
        className="max-w-none object-contain pointer-events-none brightness-0 invert"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

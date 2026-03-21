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

  // Prefer colorIcon (color version without filter) over colorLogo
  const src = ('colorIcon' in assets && assets.colorIcon)
    || ('colorLogo' in assets && assets.colorLogo)
    || null
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

  // If colorIcon exists, render it directly (already colored)
  if ('colorIcon' in assets && assets.colorIcon) {
    return (
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          alt={modelId}
          src={assets.colorIcon}
          className="max-w-none object-contain pointer-events-none"
          style={{ width: size, height: size }}
        />
      </div>
    )
  }

  // For mask-based icons (sora2)
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

import type { AIModel, ModelVersion } from '@/types'
import { getBasePrice, hasAudioPricing } from '@/types/models'
import { isVersionFreeForTier, DURATION_KEY_MAP } from './chat-constants'

interface ComputeDynamicCostParams {
  model: AIModel
  selectedVersion: ModelVersion
  tier: string
  isTextModel: boolean
  webSearchActive: boolean
  deepResearchActive: boolean
  videoDuration: string
  quality: string
  audioEnabled: boolean
  imageCount: number
}

export function computeDynamicCost({
  model,
  selectedVersion,
  tier,
  isTextModel,
  webSearchActive,
  deepResearchActive,
  videoDuration,
  quality,
  audioEnabled,
  imageCount,
}: ComputeDynamicCostParams): number {
  const p = selectedVersion.price
  const bp = getBasePrice(p)
  if (isVersionFreeForTier(selectedVersion.id, tier)) return 0
  const fc = isTextModel ? ((webSearchActive ? 3 : 0) + (deepResearchActive ? 3 : 0)) : 0
  if (isTextModel) return bp + fc
  if (p != null && typeof p === 'object') {
    const dk = DURATION_KEY_MAP[videoDuration]
    const qk = quality.toLowerCase()
    if (model.category === 'video' && dk) {
      const key = audioEnabled && hasAudioPricing(p) ? `${dk}_audio` : dk
      return (p[key] ?? p[dk] ?? bp) * (model.category === 'video' ? 1 : imageCount)
    }
    if (model.category === 'image') {
      return (p[qk] ?? bp) * imageCount
    }
  }
  if (model.category === 'image') return Math.round(bp * (quality === '4K' ? 2.5 : quality === '2K' ? 1.5 : 1) * imageCount)
  return bp
}

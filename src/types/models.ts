export type ModelCategory = 'text' | 'image' | 'video'

export type ModelPrice = number | Record<string, number>

export interface ModelVersion {
  id: string
  label: string
  description?: string
  price?: ModelPrice
  tier: 'free' | 'sub'
}

export interface AIModel {
  id: string
  name: string
  category: ModelCategory
  gradient: string
  versions: ModelVersion[]
  glowColors: string[]
  addedAt?: string
}

export function getBasePrice(price?: ModelPrice): number {
  if (price == null) return 0
  if (typeof price === 'number') return price
  const vals = Object.values(price)
  return vals.length > 0 ? Math.min(...vals) : 0
}

export function hasAudioPricing(price?: ModelPrice): boolean {
  if (price == null || typeof price === 'number') return false
  return Object.keys(price).some((k) => k.endsWith('_audio'))
}

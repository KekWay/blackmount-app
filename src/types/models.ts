export type ModelCategory = 'text' | 'image' | 'video'

export interface ModelVersion {
  id: string
  label: string
  description?: string
  price?: number
  tier: 'free' | 'pro' | 'ultra'
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

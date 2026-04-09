import type { SubscriptionTier } from './subscription'

/** API: Чат */
export interface ChatRequest {
  modelId: string
  versionId: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  settings?: {
    webSearch?: boolean
    deepResearch?: boolean
    videoDuration?: string
    quality?: string
    audioEnabled?: boolean
    imageCount?: number
  }
}

export interface ChatStreamChunk {
  type: 'text' | 'image' | 'video' | 'done' | 'error'
  content?: string
  mediaUrl?: string
  mediaSrcs?: string[]
  error?: string
}

/** API: Баланс */
export interface DeductBalanceRequest {
  amount: number
  modelId: string
  versionId: string
  label: string
}

export interface DeductBalanceResponse {
  success: boolean
  newBalance: number
  operationId: string
}

export interface TopUpRequest {
  packageId: string
  paymentMethod: 'yukassa'
}

/** API: Подписка */
export interface CheckSubscriptionResponse {
  tier: SubscriptionTier
  expiresAt: string | null
  isActive: boolean
}

/** API: История */
export interface ChatSessionResponse {
  id: string
  modelId: string
  versionId: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
}

/** API: Share */
export interface CreateShareRequest {
  sessionId?: string
  generationId?: string
  type: 'text' | 'image' | 'video'
}

export interface CreateShareResponse {
  shareId: string
  shareUrl: string
}

/** API: Общие ошибки */
export interface ApiError {
  code: string
  message: string
  status: number
}

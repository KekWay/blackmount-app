export interface PendingGeneration {
  id: string
  modelId: string
  type: 'image' | 'video' | 'text'
  status: 'pending' | 'completed'
  startedAt: number
  prompt: string
  sessionId?: string
}

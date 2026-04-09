export interface SharedItem {
  id: string
  prompt: string
  response: string
  modelId: string
  modelName: string
  type: 'text' | 'image' | 'video'
  mediaUrl?: string
  createdAt: string
}

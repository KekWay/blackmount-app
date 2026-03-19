export interface Message {
  role: 'user' | 'assistant'
  content: string
  mediaType?: 'image' | 'video'
  mediaSrc?: string
  mediaSrcs?: string[]
  isLoading?: boolean
  isTyping?: boolean
  timestamp?: number
}

export interface ChatSession {
  id: string
  modelId: string
  versionId: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

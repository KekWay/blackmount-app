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

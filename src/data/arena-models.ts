export interface ArenaModel {
  id: string
  name: string
  category: 'text' | 'image' | 'video'
  price: number
  aiModelRef: string | null
}

export const TEXT_MODELS: ArenaModel[] = [
  { id: 'claude-opus', name: 'Claude Opus 4.5', category: 'text', price: 8, aiModelRef: 'claude' },
  { id: 'chatgpt-5.2', name: 'ChatGPT 5.2', category: 'text', price: 5, aiModelRef: 'chatgpt' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', category: 'text', price: 5, aiModelRef: 'gemini' },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', category: 'text', price: 5, aiModelRef: 'claude' },
  { id: 'chatgpt-5', name: 'ChatGPT 5', category: 'text', price: 3, aiModelRef: 'chatgpt' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', price: 3, aiModelRef: 'gemini' },
]

export const IMAGE_MODELS: ArenaModel[] = [
  { id: 'flux-ultra', name: 'Flux 1.1 Pro Ultra', category: 'image', price: 15, aiModelRef: 'flux' },
  { id: 'nb-pro', name: 'NanoBanana Pro', category: 'image', price: 22, aiModelRef: 'nanobanana' },
  { id: 'flux-pro', name: 'Flux 1 Pro', category: 'image', price: 7, aiModelRef: 'flux' },
  { id: 'nb', name: 'NanoBanana', category: 'image', price: 7, aiModelRef: 'nanobanana' },
]

export const VIDEO_MODELS: ArenaModel[] = [
  { id: 'sora-pro', name: 'Sora 2 Pro', category: 'video', price: 115, aiModelRef: 'sora2' },
  { id: 'veo31', name: 'Veo 3.1', category: 'video', price: 50, aiModelRef: 'veo31' },
  { id: 'sora2', name: 'Sora 2', category: 'video', price: 25, aiModelRef: 'sora2' },
  { id: 'kling26', name: 'Kling 2.6', category: 'video', price: 45, aiModelRef: 'kling' },
]

export function getModelsByCategory(cat: 'text' | 'image' | 'video'): ArenaModel[] {
  const map = { text: TEXT_MODELS, image: IMAGE_MODELS, video: VIDEO_MODELS }
  return map[cat]
}

export function getAllArenaModels(): ArenaModel[] {
  return [...TEXT_MODELS, ...IMAGE_MODELS, ...VIDEO_MODELS]
}

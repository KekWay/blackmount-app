export interface ArenaModel {
  id: string
  name: string
  category: 'text' | 'image' | 'video'
  price: number
  aiModelRef: string | null
  gradient: string
}

export const TEXT_MODELS: ArenaModel[] = [
  { id: 'claude-opus', name: 'Claude Opus 4.5', category: 'text', price: 8, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#8B5E3C)' },
  { id: 'chatgpt-5.2', name: 'ChatGPT 5.2', category: 'text', price: 5, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#4ade80,#22c55e)' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', category: 'text', price: 5, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#6097e4,#644670)' },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', category: 'text', price: 5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'chatgpt-5', name: 'ChatGPT 5', category: 'text', price: 3, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#4ade80,#22c55e)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', price: 3, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#6097e4,#644670)' },
  { id: 'claude-sonnet-3.7', name: 'Claude Sonnet 3.7', category: 'text', price: 5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', category: 'text', price: 1, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { id: 'claude-haiku', name: 'Claude Haiku 4.5', category: 'text', price: 1.5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'text', price: 1, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { id: 'chatgpt-5-mini', name: 'ChatGPT 5 mini', category: 'text', price: 1, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#34d399,#10b981)' },
]

export const IMAGE_MODELS: ArenaModel[] = [
  { id: 'flux-ultra', name: 'Flux 1.1 Pro Ultra', category: 'image', price: 15, aiModelRef: 'flux', gradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' },
  { id: 'nb-pro', name: 'NanoBanana Pro', category: 'image', price: 22, aiModelRef: 'nanobanana', gradient: 'linear-gradient(135deg,#CBD03C,#DCCA7A)' },
  { id: 'flux-pro', name: 'Flux 1 Pro', category: 'image', price: 7, aiModelRef: 'flux', gradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' },
  { id: 'nb', name: 'NanoBanana', category: 'image', price: 7, aiModelRef: 'nanobanana', gradient: 'linear-gradient(135deg,#CBD03C,#DCCA7A)' },
]

export const VIDEO_MODELS: ArenaModel[] = [
  { id: 'sora-pro', name: 'Sora 2 Pro', category: 'video', price: 115, aiModelRef: 'sora2', gradient: 'linear-gradient(135deg,#22d3ee,#06b6d4)' },
  { id: 'veo31', name: 'Veo 3.1', category: 'video', price: 50, aiModelRef: 'veo31', gradient: 'linear-gradient(135deg,#7188e3,#e2694e)' },
  { id: 'sora2', name: 'Sora 2', category: 'video', price: 25, aiModelRef: 'sora2', gradient: 'linear-gradient(135deg,#22d3ee,#06b6d4)' },
  { id: 'kling26', name: 'Kling 2.6', category: 'video', price: 45, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
  { id: 'kling25t', name: 'Kling 2.5 Turbo', category: 'video', price: 35, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
]

export type ArenaCategory = 'text' | 'image' | 'video'

export function getModelsByCategory(cat: ArenaCategory): ArenaModel[] {
  const map = { text: TEXT_MODELS, image: IMAGE_MODELS, video: VIDEO_MODELS }
  return map[cat]
}

export function getAllArenaModels(): ArenaModel[] {
  return [...TEXT_MODELS, ...IMAGE_MODELS, ...VIDEO_MODELS]
}

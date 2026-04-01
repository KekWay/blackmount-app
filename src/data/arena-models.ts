export interface ArenaModel {
  id: string
  name: string
  category: 'text' | 'image' | 'video'
  price: number
  aiModelRef: string | null
  gradient: string
}

export const TEXT_MODELS: ArenaModel[] = [
  { id: 'gpt-5.4', name: 'ChatGPT 5.4', category: 'text', price: 6, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#4ade80,#22c55e)' },
  { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', category: 'text', price: 8, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#8B5E3C)' },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', category: 'text', price: 5, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#6097e4,#644670)' },
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', category: 'text', price: 8, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#8B5E3C)' },
  { id: 'gpt-5.3', name: 'ChatGPT 5.3', category: 'text', price: 5, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#4ade80,#22c55e)' },
  { id: 'chatgpt-5.2', name: 'ChatGPT 5.2', category: 'text', price: 5, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#4ade80,#22c55e)' },
  { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', category: 'text', price: 5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', category: 'text', price: 5, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#6097e4,#644670)' },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', category: 'text', price: 5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'chatgpt-5', name: 'ChatGPT 5', category: 'text', price: 3, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#4ade80,#22c55e)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', price: 3, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#6097e4,#644670)' },
  { id: 'claude-sonnet-3.7', name: 'Claude Sonnet 3.7', category: 'text', price: 5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', category: 'text', price: 1, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', category: 'text', price: 1.5, aiModelRef: 'claude', gradient: 'linear-gradient(135deg,#D4A574,#C4956A)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'text', price: 1, aiModelRef: 'gemini', gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { id: 'chatgpt-5-mini', name: 'ChatGPT 5 mini', category: 'text', price: 1, aiModelRef: 'chatgpt', gradient: 'linear-gradient(135deg,#34d399,#10b981)' },
]

export const IMAGE_MODELS: ArenaModel[] = [
  { id: 'nanobanana-2', name: 'NanoBanana 2', category: 'image', price: 13, aiModelRef: 'nanobanana', gradient: 'linear-gradient(135deg,#CBD03C,#DCCA7A)' },
  { id: 'flux-1.1-pro-ultra', name: 'Flux 1.1 Pro Ultra', category: 'image', price: 15, aiModelRef: 'flux', gradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' },
  { id: 'nb-pro', name: 'NanoBanana Pro', category: 'image', price: 22, aiModelRef: 'nanobanana', gradient: 'linear-gradient(135deg,#CBD03C,#DCCA7A)' },
  { id: 'flux-1-pro', name: 'Flux 1 Pro', category: 'image', price: 7, aiModelRef: 'flux', gradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' },
  { id: 'nb-2.0', name: 'NanoBanana', category: 'image', price: 7, aiModelRef: 'nanobanana', gradient: 'linear-gradient(135deg,#CBD03C,#DCCA7A)' },
]

export const VIDEO_MODELS: ArenaModel[] = [
  { id: 'kling-3.0-pro', name: 'Kling 3.0 Pro', category: 'video', price: 85, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
  { id: 'kling-3.0', name: 'Kling 3.0', category: 'video', price: 55, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
  { id: 'veo-3.1-quality', name: 'Veo 3.1 Quality', category: 'video', price: 185, aiModelRef: 'veo31', gradient: 'linear-gradient(135deg,#7188e3,#e2694e)' },
  { id: 'veo-3.1-fast', name: 'Veo 3.1 Fast', category: 'video', price: 50, aiModelRef: 'veo31', gradient: 'linear-gradient(135deg,#7188e3,#e2694e)' },
  { id: 'kling-2.6-pro', name: 'Kling 2.6 Pro', category: 'video', price: 45, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
  { id: 'kling-2.6', name: 'Kling 2.6', category: 'video', price: 45, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
  { id: 'kling-2.5-turbo', name: 'Kling 2.5 Turbo', category: 'video', price: 35, aiModelRef: 'kling', gradient: 'linear-gradient(135deg,#1bfe27,#0f69df)' },
]

export type ArenaCategory = 'text' | 'image' | 'video'

export function getModelsByCategory(cat: ArenaCategory): ArenaModel[] {
  const map = { text: TEXT_MODELS, image: IMAGE_MODELS, video: VIDEO_MODELS }
  return map[cat]
}

export function getAllArenaModels(): ArenaModel[] {
  return [...TEXT_MODELS, ...IMAGE_MODELS, ...VIDEO_MODELS]
}

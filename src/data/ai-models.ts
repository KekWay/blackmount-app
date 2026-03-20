import type { AIModel, ModelCategory } from '@/types/models'

export const aiModels: AIModel[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'text',
    gradient: 'linear-gradient(120.356deg, rgb(75, 219, 82) 1.0121%, rgb(148, 185, 133) 98.988%)',
    versions: [
      { id: 'chatgpt-5.2', label: 'ChatGPT 5.2', description: 'Самая мощная', price: 5, tier: 'ultra' },
      { id: 'chatgpt-5', label: 'ChatGPT 5', description: 'Баланс', price: 3, tier: 'pro' },
      { id: 'chatgpt-5-mini', label: 'ChatGPT 5 mini', description: 'Быстрая и дешёвая', price: 1, tier: 'free' },
    ],
    glowColors: ['#3e993e', '#2d8a2d', '#4aad4a'],
    addedAt: '2023-10-01T00:00:00Z',
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'text',
    gradient: 'linear-gradient(120.356deg, rgb(255, 200, 123) 1.0121%, rgb(255, 166, 0) 43.678%, rgb(255, 158, 3) 98.988%)',
    versions: [
      { id: 'claude-opus-4.5', label: 'Claude Opus 4.5', description: 'Максимальная', price: 8, tier: 'ultra' },
      { id: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5', description: 'Баланс', price: 5, tier: 'pro' },
      { id: 'claude-sonnet-3.7', label: 'Claude Sonnet 3.7', description: 'Предыдущее поколение', price: 5, tier: 'pro' },
      { id: 'claude-haiku-4.5', label: 'Claude Haiku 4.5', description: 'Быстрая', price: 1.5, tier: 'free' },
    ],
    glowColors: ['#8B4513', '#A0522D', '#6B3410'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'text',
    gradient: 'linear-gradient(120.356deg, rgb(96, 151, 228) 1.0121%, rgb(100, 70, 111) 93.807%)',
    versions: [
      { id: 'gemini-3-pro', label: 'Gemini 3 Pro', description: 'Новейшая', price: 5, tier: 'pro' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Флагман', price: 3, tier: 'pro' },
      { id: 'gemini-3-flash', label: 'Gemini 3 Flash', description: 'Быстрая', price: 1, tier: 'free' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Экономичная', price: 1, tier: 'free' },
    ],
    glowColors: ['#3355cc', '#4466dd', '#2244aa'],
  },
  {
    id: 'nanobanana',
    name: 'NanoBanana',
    category: 'image',
    gradient: 'linear-gradient(120.356deg, rgb(203, 208, 60) 0%, rgb(220, 202, 122) 100%)',
    versions: [
      { id: 'nb-pro', label: 'NanoBanana Pro', description: 'Максимальное качество', price: 22, tier: 'ultra' },
      { id: 'nb-2.0', label: 'NanoBanana', description: 'Стандарт', price: 7, tier: 'pro' },
    ],
    glowColors: ['#C8A000', '#B89A20', '#DAB830'],
  },
  {
    id: 'flux',
    name: 'Flux',
    category: 'image',
    gradient: 'linear-gradient(120.356deg, rgb(230, 15, 19) 1.0121%, rgb(169, 98, 98) 98.988%)',
    versions: [
      { id: 'flux-1.1-pro-ultra', label: 'Flux 1.1 Pro Ultra', description: 'Максимальное качество', price: 15, tier: 'ultra' },
      { id: 'flux-1-pro', label: 'Flux 1 Pro', description: 'Стандарт', price: 7, tier: 'pro' },
    ],
    glowColors: ['#8B2020', '#6B1515'],
  },
  {
    id: 'sora2',
    name: 'Sora 2',
    category: 'video',
    gradient: 'linear-gradient(120.356deg, rgb(38, 207, 241) 1.0121%, rgb(111, 222, 240) 98.988%)',
    versions: [
      { id: 'sora-2-pro', label: 'Sora 2 Pro', description: 'Максимум', price: 115, tier: 'ultra' },
      { id: 'sora-2', label: 'Sora 2', description: 'Стандарт', price: 25, tier: 'pro' },
    ],
    glowColors: ['#6666BB', '#7777CC', '#5555AA'],
  },
  {
    id: 'kling',
    name: 'Kling',
    category: 'video',
    gradient: 'linear-gradient(120.356deg, rgb(27, 254, 39) 1.0121%, rgb(15, 105, 223) 98.988%)',
    versions: [
      { id: 'kling-2.6', label: 'Kling 2.6', description: 'Максимум', price: 45, tier: 'ultra' },
      { id: 'kling-2.5-turbo', label: 'Kling 2.5 Turbo', description: 'Быстрое', price: 35, tier: 'pro' },
    ],
    glowColors: ['#00AA55', '#0088CC', '#00CC66'],
  },
  {
    id: 'veo31',
    name: 'Veo 3.1',
    category: 'video',
    gradient: 'linear-gradient(120.356deg, rgb(113, 136, 227) 40.108%, rgb(226, 105, 78) 93.807%)',
    versions: [
      { id: 'veo-3.1-quality', label: 'Veo 3.1 Quality', description: 'Максимальное качество', price: 185, tier: 'ultra' },
      { id: 'veo-3.1-fast', label: 'Veo 3.1 Fast', description: 'Быстрая генерация', price: 50, tier: 'pro' },
    ],
    glowColors: ['#3287FF', '#E55966', '#CAC631', '#41C18A'],
    addedAt: '2023-10-01T00:00:00Z',
  },
]

const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000

export function isModelNew(model: AIModel): boolean {
  if (!model.addedAt) return false
  return Date.now() - new Date(model.addedAt).getTime() < FOURTEEN_DAYS
}

export function getModelById(id: string): AIModel | undefined {
  return aiModels.find((m) => m.id === id)
}

export function getModelsByCategory(category: ModelCategory): AIModel[] {
  return aiModels.filter((m) => m.category === category)
}

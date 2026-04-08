import type { AIModel, ModelCategory } from '@/types/models'

export const aiModels: AIModel[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'text',
    gradient: 'linear-gradient(120.356deg, rgb(75, 219, 82) 1.0121%, rgb(148, 185, 133) 98.988%)',
    versions: [
      { id: 'gpt-5.4', label: 'ChatGPT 5.4', description: 'Самая мощная', price: 6, tier: 'max' },
      { id: 'gpt-5.3', label: 'ChatGPT 5.3', description: 'Умная', price: 5, tier: 'pro' },
      { id: 'chatgpt-5.2', label: 'ChatGPT 5.2', description: 'Надёжный универсал', price: 5, tier: 'max' },
      { id: 'chatgpt-5', label: 'ChatGPT 5', description: 'Базовая модель', price: 3, tier: 'pro' },
      { id: 'chatgpt-5-mini', label: 'ChatGPT 5 mini', description: 'Лёгкая и быстрая', price: 1, tier: 'free' },
    ],
    glowColors: ['#3e993e', '#2d8a2d', '#4aad4a'],  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'text',
    gradient: 'linear-gradient(120.356deg, rgb(255, 200, 123) 1.0121%, rgb(255, 166, 0) 43.678%, rgb(255, 158, 3) 98.988%)',
    versions: [
      { id: 'claude-opus-4.6', label: 'Claude Opus 4.6', description: 'Максимальный интеллект', price: 8, tier: 'max' },
      { id: 'claude-sonnet-4.6', label: 'Claude Sonnet 4.6', description: 'Баланс и скорость', price: 5, tier: 'pro' },
      { id: 'claude-opus-4.5', label: 'Claude Opus 4.5', description: 'Глубокий анализ', price: 8, tier: 'max' },
      { id: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5', description: 'Рабочая лошадка', price: 5, tier: 'pro' },
      { id: 'claude-sonnet-3.7', label: 'Claude Sonnet 3.7', description: 'Проверенный классик', price: 5, tier: 'pro' },
      { id: 'claude-haiku-4.5', label: 'Claude Haiku 4.5', description: 'Мгновенные ответы', price: 1.5, tier: 'free' },
    ],
    glowColors: ['#8B4513', '#A0522D', '#6B3410'],  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'text',
    gradient: 'linear-gradient(120.356deg, rgb(96, 151, 228) 1.0121%, rgb(100, 70, 111) 93.807%)',
    versions: [
      { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro', description: 'Самая мощная', price: 5, tier: 'pro' },
      { id: 'gemini-3-pro', label: 'Gemini 3 Pro', description: 'Мощный универсал', price: 5, tier: 'pro' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Стабильный и точный', price: 3, tier: 'pro' },
      { id: 'gemini-3-flash', label: 'Gemini 3 Flash', description: 'Молниеносный', price: 1, tier: 'free' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Ультрабюджетный', price: 1, tier: 'free' },
    ],
    glowColors: ['#3355cc', '#4466dd', '#2244aa'],  },
  {
    id: 'nanobanana',
    name: 'NanoBanana',
    category: 'image',
    gradient: 'linear-gradient(120.356deg, rgb(203, 208, 60) 0%, rgb(220, 202, 122) 100%)',
    versions: [
      { id: 'nanobanana-2', label: 'NanoBanana 2', description: 'Лучшее качество', price: { '1k': 13, '2k': 19, '4k': 26 }, tier: 'max' },
      { id: 'nb-pro', label: 'NanoBanana Pro', description: 'Максимальная детализация', price: { '1k': 22, '2k': 22, '4k': 43 }, tier: 'max' },
      { id: 'nb-2.0', label: 'NanoBanana', description: 'Классическая генерация', price: 7, tier: 'pro' },
    ],
    glowColors: ['#C8A000', '#B89A20', '#DAB830'],  },
  {
    id: 'flux',
    name: 'Flux',
    category: 'image',
    gradient: 'linear-gradient(120.356deg, rgb(230, 15, 19) 1.0121%, rgb(169, 98, 98) 98.988%)',
    versions: [
      { id: 'flux-1.1-pro-ultra', label: 'Flux 1.1 Pro Ultra', description: 'Ультравысокое качество', price: 15, tier: 'max' },
      { id: 'flux-1-pro', label: 'Flux 1 Pro', description: 'Точная детализация', price: 7, tier: 'pro' },
    ],
    glowColors: ['#8B2020', '#6B1515'],
  },
  {
    id: 'kling',
    name: 'Kling',
    category: 'video',
    gradient: 'linear-gradient(120.356deg, rgb(27, 254, 39) 1.0121%, rgb(15, 105, 223) 98.988%)',
    versions: [
      { id: 'kling-3.0-pro', label: 'Kling 3.0 Pro', description: 'Топ кинематография', price: { '5s': 85, '10s': 170 }, tier: 'max' },
      { id: 'kling-3.0', label: 'Kling 3.0', description: 'Нативное аудио', price: { '5s': 55, '10s': 110 }, tier: 'max' },
      { id: 'kling-2.6-pro', label: 'Kling 2.6 Pro', description: 'Кинематограф', price: { '5s': 45, '5s_audio': 85, '10s': 85, '10s_audio': 170 }, tier: 'max' },
      { id: 'kling-2.6', label: 'Kling 2.6', description: 'Аудио-визуал', price: { '5s': 45, '5s_audio': 85, '10s': 85, '10s_audio': 170 }, tier: 'pro' },
      { id: 'kling-2.5-turbo', label: 'Kling 2.5 Turbo', description: 'Быстрый стандарт', price: 35, tier: 'pro' },
    ],
    glowColors: ['#00AA55', '#0088CC', '#00CC66'],  },
  {
    id: 'veo31',
    name: 'Veo 3.1',
    category: 'video',
    gradient: 'linear-gradient(120.356deg, rgb(113, 136, 227) 40.108%, rgb(226, 105, 78) 93.807%)',
    versions: [
      { id: 'veo-3.1-quality', label: 'Veo 3.1 Quality', description: 'Кинематограф', price: 185, tier: 'max' },
      { id: 'veo-3.1-fast', label: 'Veo 3.1 Fast', description: 'Быстрое кино', price: 50, tier: 'pro' },
    ],
    glowColors: ['#3287FF', '#E55966', '#CAC631', '#41C18A'],  },
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

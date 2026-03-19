export interface TrendingModel {
  id: string
  versionId: string
  versionLabel: string
  usage: number
  change: number
  desc: string
}

export const trendingModels: TrendingModel[] = [
  { id: 'chatgpt', versionId: 'chatgpt-5.2', versionLabel: 'ChatGPT 5.2', usage: 34.2, change: +5.1, desc: 'Самая мощная текстовая модель OpenAI' },
  { id: 'claude', versionId: 'claude-opus-4.5', versionLabel: 'Claude Opus 4.5', usage: 28.5, change: +3.8, desc: 'Глубокое рассуждение и точность' },
  { id: 'flux', versionId: 'flux-1.1-pro-ultra', versionLabel: 'Flux 1.1 Pro Ultra', usage: 18.7, change: +7.2, desc: 'Топ-1 генератор изображений' },
  { id: 'sora2', versionId: 'sora-2-pro', versionLabel: 'Sora 2 Pro', usage: 15.1, change: +2.4, desc: 'Продвинутая генерация видео' },
  { id: 'gemini', versionId: 'gemini-3-pro', versionLabel: 'Gemini 3 Pro', usage: 12.8, change: -1.3, desc: 'Мультимодальная модель Google' },
  { id: 'kling', versionId: 'kling-2.6', versionLabel: 'Kling 2.6', usage: 9.4, change: +4.6, desc: 'Реалистичное видео с движением' },
  { id: 'nanobanana', versionId: 'nb-pro', versionLabel: 'NanoBanana Pro', usage: 7.6, change: +1.9, desc: 'Быстрая генерация изображений' },
  { id: 'veo31', versionId: 'veo-3.1-quality', versionLabel: 'Veo 3.1 Quality', usage: 5.3, change: +8.1, desc: 'Кинематографическое видео' },
]

export type Plan = 'basic' | 'pro' | 'max'
export type Period = 'month' | 'year'

export interface PlanFeature { icon: string; text: string; bold?: string }

export const planFeatures: Record<Plan, { coins: number; limits: string[]; features: PlanFeature[] }> = {
  basic: {
    coins: 300,
    limits: [
      'до 300 текстовых запросов',
      'до 157 генераций изображений',
      'до 40 генераций видео',
    ],
    features: [
      { icon: 'lock', text: 'Доступ ко всем моделям' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '10%' },
      { icon: 'requests', text: '', bold: '100 запросов в день' },
      { icon: 'context', text: 'Увеличенный контекст' },
    ],
  },
  pro: {
    coins: 550,
    limits: [
      'до 550 текстовых запросов',
      'до 280 генераций изображений',
      'до 75 генераций видео',
    ],
    features: [
      { icon: 'lock', text: 'Доступ ко всем моделям' },
      { icon: 'lock', text: 'Бесплатно: ', bold: 'ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '15%' },
      { icon: 'requests', text: '', bold: '150 запросов в день' },
      { icon: 'context', text: 'Увеличенный контекст x2' },
    ],
  },
  max: {
    coins: 1200,
    limits: [
      'до 1200 текстовых запросов',
      'до 600 генераций изображений',
      'до 160 генераций видео',
    ],
    features: [
      { icon: 'lock', text: 'Доступ ко всем моделям' },
      { icon: 'lock', text: 'Бесплатно: ', bold: 'ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '20%' },
      { icon: 'requests', text: '', bold: '200 запросов в день' },
      { icon: 'context', text: 'Максимальный контекст x3' },
    ],
  },
}

export const featureIconMap: Record<string, string> = {
  lock: '/assets/models/e5c74a062b18275f0481b52111b62f3d2d3c22ad.png',
  discount: '/assets/models/ff730e59d60cf57a7d1012fa1e663907b5b10de8.png',
  requests: '/assets/models/875993f4063423eb65de49fadba243c5696f5bfa.png',
  context: '/assets/models/eb77d7192867998e47bd03ec20f1d5f07c46b030.png',
}

export const MODEL_LOGOS = {
  chatgpt: '/assets/models/f39f1f5aad4a176c5160005f6b0e3db93b6a10ba.png',
  claude: '/assets/models/89a56fcb15946b9582fc58d6740a02e12604885b.png',
  gemini: '/assets/models/464249cfa1e685e13ecdc8b3e4af7cc79b990682.png',
  flux: '/assets/models/2a08c8247eb8ff9ca7960267e118bd33a85fbaf9.png',
  nanobanana: '/assets/models/1e85ee9196e56d0b7b7f9ae63141e794a1230a78.png',
  sora: '/assets/models/13f117ca3aca8f3fbc56c8d15232cab2ea4ac5cf.png',
  kling: '/assets/models/9a402b089c2c29d5d7e2196840980b3b5e914e3c.png',
  veo: '/assets/models/d6cc8c54df33e333e22af118845c45c06fa0e4f9.png',
}

export const COIN_IMG = '/assets/models/06a5a3f12f7ccb4092a793253a07d8e11e003ba7.png'
export const BULLET_ICON = '/assets/models/0be89c47e57a85ad7ac2ee997812fd7afdf09f8b.png'

export interface PlanInfo {
  key: Plan
  label: string
  priceMonth: number
  priceYear: number
  yearTotalMonth: number
  yearTotalYear: number
  badge: string | null
  badgeBg: string
  cta: string
}

export const plansArr: PlanInfo[] = [
  {
    key: 'basic', label: 'Basic', priceMonth: 499, priceYear: 424,
    yearTotalMonth: 5988, yearTotalYear: 5088, badge: null, badgeBg: '', cta: 'Оформить Basic',
  },
  {
    key: 'pro', label: 'Pro', priceMonth: 999, priceYear: 849,
    yearTotalMonth: 11988, yearTotalYear: 10188, badge: 'Лучший выбор',
    badgeBg: 'linear-gradient(106.083deg, rgb(255, 210, 49) 4.51%, rgb(192, 150, 0) 54.14%, rgb(238, 161, 16) 86.39%)',
    cta: 'Оформить Pro',
  },
  {
    key: 'max', label: 'Max', priceMonth: 1799, priceYear: 1529,
    yearTotalMonth: 21588, yearTotalYear: 18348, badge: 'Максимум',
    badgeBg: 'linear-gradient(112deg, rgb(63, 24, 87) 17%, rgb(3, 215, 226) 99%)',
    cta: 'Оформить Max',
  },
]

export { COMPARE_ROWS, type CompareRow } from './compare-rows'

import { APP_ASSETS, MODEL_ASSETS } from '@/lib/assets'

export type Plan = 'basic' | 'pro' | 'max'
export type Period = 'month' | 'year'

export interface PlanFeature { icon: string; text: string; bold?: string }

export const imgCoin = APP_ASSETS.coin
export const imgBulletIcon = '/assets/models/bullet-icon.png'
export const imgLockIcon = '/assets/models/lock-icon.png'
export const imgDiscountIcon = '/assets/models/discount-icon.png'
export const imgRequestsIcon = '/assets/models/requests-icon.png'
export const imgContextIcon = '/assets/models/context-icon.png'

export const modelLogos = [
  '/assets/models/chatgpt-color.png',
  MODEL_ASSETS.claude.colorLogo,
  MODEL_ASSETS.gemini.colorLogo,
  MODEL_ASSETS.flux.colorLogo,
  MODEL_ASSETS.nanobanana.colorLogo,
  '/assets/models/sora2-icon-color.png',
  MODEL_ASSETS.kling.colorLogo,
  MODEL_ASSETS.veo31.colorLogo,
]

export const featureIconMap: Record<string, string> = {
  lock: imgLockIcon,
  discount: imgDiscountIcon,
  requests: imgRequestsIcon,
  context: imgContextIcon,
}

export const planFeatures: Record<Plan, { coins: number; limits: string[]; features: PlanFeature[] }> = {
  basic: {
    coins: 300,
    limits: ['до 300 текстовых запросов', 'до 157 генераций изображений', 'до 40 генераций видео'],
    features: [
      { icon: 'lock', text: 'Доступ ко всем моделям' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '10%' },
      { icon: 'requests', text: '', bold: '100 запросов в день' },
      { icon: 'context', text: 'Увеличенный контекст' },
    ],
  },
  pro: {
    coins: 550,
    limits: ['до 550 текстовых запросов', 'до 280 генераций изображений', 'до 75 генераций видео'],
    features: [
      { icon: 'lock', text: 'Доступ ко всем моделям' },
      { icon: 'lock', text: 'Бесплатно: ', bold: 'GPT 5 mini, Gemini Flash 3, Gemini Flash 2.5' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '15%' },
      { icon: 'requests', text: '', bold: '150 запросов в день' },
      { icon: 'context', text: 'Увеличенный контекст x2' },
    ],
  },
  max: {
    coins: 1200,
    limits: ['до 1200 текстовых запросов', 'до 600 генераций изображений', 'до 160 генераций видео'],
    features: [
      { icon: 'lock', text: 'Доступ ко всем моделям' },
      { icon: 'lock', text: 'Бесплатно: ', bold: 'GPT 5 mini, Gemini Flash 3, Gemini Flash 2.5' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '20%' },
      { icon: 'requests', text: '', bold: '200 запросов в день' },
      { icon: 'context', text: 'Максимальный контекст x3' },
    ],
  },
}

export const plansArr: { key: Plan | 'free'; label: string; priceMonth: number; priceYear: number; badge: string | null; cta: string }[] = [
  { key: 'free', label: 'Free', priceMonth: 0, priceYear: 0, badge: null, cta: 'Текущий план' },
  { key: 'basic', label: 'Basic', priceMonth: 499, priceYear: 424, badge: null, cta: 'Выбрать Basic' },
  { key: 'pro', label: 'Pro', priceMonth: 999, priceYear: 849, badge: 'Лучший выбор', cta: 'Выбрать Pro' },
  { key: 'max', label: 'Max', priceMonth: 1799, priceYear: 1529, badge: 'Максимум', cta: 'Выбрать Max' },
]

export interface CompareRow {
  section?: string; label?: string; price?: number | null; prices?: number[]
  basic?: string; pro?: string; max?: string; isCoinValue?: boolean
}

export const COMPARE_ROWS: CompareRow[] = [
  { section: 'Видео (в месяц)' },
  { label: 'Sora 2 Pro', price: 115, basic: '2 видео', pro: '4 видео', max: '10 видео' },
  { label: 'Sora 2', price: 25, basic: '12 видео', pro: '22 видео', max: '48 видео' },
  { label: 'Veo 3.1 Quality', price: 185, basic: '1 видео', pro: '2 видео', max: '6 видео' },
  { label: 'Veo 3.1 Fast', price: 50, basic: '6 видео', pro: '11 видео', max: '24 видео' },
  { label: 'Kling 2.6', price: 45, basic: '6 видео', pro: '12 видео', max: '26 видео' },
  { label: 'Kling 2.5 Turbo', price: 35, basic: '8 видео', pro: '15 видео', max: '34 видео' },
  { section: 'Изображения (в месяц)' },
  { label: 'Flux 1.1 Pro Ultra', price: 15, basic: '20 изображений', pro: '36 изображений', max: '80 изображений' },
  { label: 'Flux 1 Pro', price: 7, basic: '42 изображения', pro: '78 изображений', max: '170 изображений' },
  { label: 'NanoBanana Pro', price: 22, basic: '13 изображений', pro: '25 изображений', max: '54 изображения' },
  { label: 'NanoBanana', price: 7, basic: '42 изображения', pro: '78 изображений', max: '170 изображений' },
  { section: 'Текст (в месяц)' },
  { label: 'ChatGPT 5.2 / Claude Opus 4.5', price: null, prices: [5, 8], basic: '40-60 запросов', pro: '70-110 запросов', max: '150-240 запросов' },
  { label: 'Claude Sonnet 3.7 / 4.5', price: 5, basic: '60 запросов', pro: '110 запросов', max: '240 запросов' },
  { label: 'ChatGPT 5 / Gemini 2.5 Pro', price: 3, basic: '100 запросов', pro: '183 запроса', max: '400 запросов' },
  { label: 'ChatGPT 5 mini / Gemini Flash 3 / Flash 2.5', price: 1, basic: '300 запросов', pro: 'Безлимит*', max: 'Безлимит*' },
  { section: 'Особенности' },
  { label: 'Ежемесячные айкоины', price: null, basic: '300', pro: '550', max: '1200', isCoinValue: true },
  { label: 'Скидка на пополнение', price: null, basic: '10%', pro: '15%', max: '20%' },
  { label: 'Приоритет в очереди', price: null, basic: 'Обычный', pro: 'Высокий', max: 'Максимальный' },
  { label: 'Размер контекста', price: null, basic: 'Увеличенный', pro: 'x2', max: 'x3' },
]

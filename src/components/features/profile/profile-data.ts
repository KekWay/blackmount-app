import { APP_ASSETS } from '@/lib/assets'

export type Tab = 'account' | 'subscription' | 'topup' | 'referral' | 'history'
// Note: 'subscription' is kept in type for navigation compatibility but redirects to /subscription page
export type GenCatFilter = 'all' | 'text' | 'image' | 'video'
export type Plan = 'basic' | 'pro' | 'max'
export type Period = 'month' | 'year'
export type HistoryFilter = 'all' | 'topup' | 'spent'

export interface PlanFeature { icon: string; text: string; bold?: string }

export const GEN_MODELS = [
  { model: 'ChatGPT 5.2', price: 5, cat: 'text' as const },
  { model: 'ChatGPT 5', price: 3, cat: 'text' as const },
  { model: 'ChatGPT 5 mini', price: 1, cat: 'text' as const },
  { model: 'Claude Opus 4.5', price: 8, cat: 'text' as const },
  { model: 'Claude Sonnet 4.5', price: 5, cat: 'text' as const },
  { model: 'Claude Sonnet 3.7', price: 5, cat: 'text' as const },
  { model: 'Claude Haiku 4.5', price: 1.5, cat: 'text' as const },
  { model: 'Gemini 3 Pro', price: 5, cat: 'text' as const },
  { model: 'Gemini 3 Flash', price: 1, cat: 'text' as const },
  { model: 'Gemini 2.5 Pro', price: 3, cat: 'text' as const },
  { model: 'Gemini 2.5 Flash', price: 1, cat: 'text' as const },
  { model: 'Flux 1.1 Pro Ultra', price: 15, cat: 'image' as const },
  { model: 'Flux 1 Pro', price: 7, cat: 'image' as const },
  { model: 'NanoBanana Pro', price: 22, cat: 'image' as const },
  { model: 'NanoBanana', price: 7, cat: 'image' as const },
  { model: 'Sora 2 Pro', price: 115, cat: 'video' as const },
  { model: 'Sora 2', price: 25, cat: 'video' as const },
  { model: 'Veo 3.1', price: 50, cat: 'video' as const },
  { model: 'Kling 2.6', price: 45, cat: 'video' as const },
  { model: 'Kling 2.5 Turbo', price: 35, cat: 'video' as const },
]

export const GEN_CATS: { key: GenCatFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'text', label: 'Текст' },
  { key: 'image', label: 'Фото' },
  { key: 'video', label: 'Видео' },
]

export const IMG_COIN = APP_ASSETS.coin
export const IMG_LOGO = APP_ASSETS.logo
export const IMG_SPARKLES = '/assets/models/sparkles.png'
export const IMG_WALLET = '/assets/models/wallet.png'
export const IMG_CHECK_BADGE = '/assets/models/check-badge.png'
export const IMG_TOPUP_ICON = '/assets/models/topup-icon.png'
export const IMG_BULLET_ICON = '/assets/models/bullet-icon.png'
export const IMG_LOCK_ICON = '/assets/models/lock-icon.png'
export const IMG_DISCOUNT_ICON = '/assets/models/discount-icon.png'
export const IMG_REQUESTS_ICON = '/assets/models/requests-icon.png'
export const IMG_CONTEXT_ICON = '/assets/models/context-icon.png'
export const IMG_COIN_PHOTOROOM = '/assets/models/coin-large.png'
export const IMG_HEADPHONES_MASK = '/assets/models/headphones-mask.png'
export const IMG_LAPTOP_MASK = '/assets/models/laptop-mask.png'
export const IMG_PROFILE_MASK = '/assets/models/profile-mask.png'

export const IMG_CHATGPT_COLOR = '/assets/models/chatgpt-color.png'
export const IMG_CLAUDE_COLOR = '/assets/models/claude-color-logo.png'
export const IMG_GEMINI_COLOR = '/assets/models/gemini-color-logo.png'
export const IMG_FLUX_COLOR = '/assets/models/flux-icon.png'

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
      { icon: 'lock', text: 'Бесплатно: ', bold: 'ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash' },
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
      { icon: 'lock', text: 'Бесплатно: ', bold: 'ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash' },
      { icon: 'discount', text: 'Скидка на покупку айкоинов ', bold: '20%' },
      { icon: 'requests', text: '', bold: '200 запросов в день' },
      { icon: 'context', text: 'Максимальный контекст x3' },
    ],
  },
}

export const featureIconMap: Record<string, string> = {
  lock: IMG_LOCK_ICON,
  discount: IMG_DISCOUNT_ICON,
  requests: IMG_REQUESTS_ICON,
  context: IMG_CONTEXT_ICON,
}

export const plansArr = [
  { key: 'basic' as Plan, label: 'Basic', priceMonth: 499, priceYear: 424, yearTotalMonth: 5988, yearTotalYear: 5088, badge: null as string | null, badgeBg: '', cta: 'Оформить Basic' },
  { key: 'pro' as Plan, label: 'Pro', priceMonth: 999, priceYear: 849, yearTotalMonth: 11988, yearTotalYear: 10188, badge: 'Лучший выбор', badgeBg: 'linear-gradient(155deg, rgb(243, 220, 42) 8%, rgb(213, 26, 38) 108%)', cta: 'Оформить Pro' },
  { key: 'max' as Plan, label: 'Max', priceMonth: 1799, priceYear: 1529, yearTotalMonth: 21588, yearTotalYear: 18348, badge: 'Максимум', badgeBg: 'linear-gradient(112deg, rgb(63, 24, 87) 17%, rgb(3, 215, 226) 99%)', cta: 'Оформить Max' },
]

export const packages = [
  { id: 1, coins: 90, price: '149 Руб', badge: null as string | null, highlight: false },
  { id: 2, coins: 220, price: '349 Руб', badge: null as string | null, highlight: false },
  { id: 3, coins: 350, price: '499 Руб', badge: 'Лучший выбор', highlight: true },
  { id: 4, coins: 650, price: '799 Руб', badge: null as string | null, highlight: false },
  { id: 5, coins: 1200, price: '1499 Руб', badge: 'Самый выгодный', highlight: false },
]

export const tabTitles: Record<Tab, string> = {
  account: 'Профиль',
  subscription: 'Обновите подписку',
  topup: 'Пополнить баланс',
  referral: 'Реферальная программа',
  history: 'История операций',
}

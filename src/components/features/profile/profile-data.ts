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
export const IMG_SPARKLES = '/assets/models/4a2526482cd52e33d2dd2cac1322f5104fd9fddc.png'
export const IMG_WALLET = '/assets/models/97c652444e9429881519599c6bd2ba3aeb131b95.png'
export const IMG_CHECK_BADGE = '/assets/models/b842143625ddbe6bcc24fb014365949761b50805.png'
export const IMG_TOPUP_ICON = '/assets/models/aa2f541a755a5bf9ea81fb840a76e662c65c27fc.png'
export const IMG_BULLET_ICON = '/assets/models/0be89c47e57a85ad7ac2ee997812fd7afdf09f8b.png'
export const IMG_LOCK_ICON = '/assets/models/e5c74a062b18275f0481b52111b62f3d2d3c22ad.png'
export const IMG_DISCOUNT_ICON = '/assets/models/ff730e59d60cf57a7d1012fa1e663907b5b10de8.png'
export const IMG_REQUESTS_ICON = '/assets/models/875993f4063423eb65de49fadba243c5696f5bfa.png'
export const IMG_CONTEXT_ICON = '/assets/models/eb77d7192867998e47bd03ec20f1d5f07c46b030.png'
export const IMG_COIN_PHOTOROOM = '/assets/models/b23c6fe36d384684a1ff3a57cf74fd5a09c7e3b1.png'
export const IMG_HEADPHONES_MASK = '/assets/models/fe52606ba0ca3a2151afba9394e8f382c09b385a.png'
export const IMG_LAPTOP_MASK = '/assets/models/49a78c9150f296e3b44736c9324c20761f4910eb.png'
export const IMG_PROFILE_MASK = '/assets/models/02dae5d96f35239ef6f51280aa026881ef59f9c0.png'

export const IMG_CHATGPT_COLOR = '/assets/models/f39f1f5aad4a176c5160005f6b0e3db93b6a10ba.png'
export const IMG_CLAUDE_COLOR = '/assets/models/89a56fcb15946b9582fc58d6740a02e12604885b.png'
export const IMG_GEMINI_COLOR = '/assets/models/464249cfa1e685e13ecdc8b3e4af7cc79b990682.png'
export const IMG_FLUX_COLOR = '/assets/models/2a08c8247eb8ff9ca7960267e118bd33a85fbaf9.png'

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

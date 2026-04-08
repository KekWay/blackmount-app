import { APP_ASSETS, MODEL_ASSETS } from '@/lib/assets'
import { planFeatures, featureIconMap, type Plan, type Period, type PlanFeature } from '@/components/features/profile/profile-data'

export type { Plan, Period, PlanFeature }
export { planFeatures, featureIconMap }

export const imgCoin = APP_ASSETS.coin

export const modelLogos = [
  '/assets/models/chatgpt-color.png',
  MODEL_ASSETS.claude.colorLogo,
  MODEL_ASSETS.gemini.colorLogo,
  MODEL_ASSETS.flux.colorLogo,
  MODEL_ASSETS.nanobanana.colorLogo,
  MODEL_ASSETS.kling.colorLogo,
  MODEL_ASSETS.veo31.colorLogo,
]

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
  { label: 'Veo 3.1 Quality', price: 185, basic: '1 видео', pro: '2 видео', max: '6 видео' },
  { label: 'Kling 3.0 Pro', price: 85, basic: '3 видео', pro: '6 видео', max: '14 видео' },
  { label: 'Kling 3.0', price: 55, basic: '5 видео', pro: '10 видео', max: '21 видео' },
  { label: 'Veo 3.1 Fast', price: 50, basic: '6 видео', pro: '11 видео', max: '24 видео' },
  { label: 'Kling 2.6', price: 45, basic: '6 видео', pro: '12 видео', max: '26 видео' },
  { label: 'Kling 2.6 Pro', price: 45, basic: '6 видео', pro: '12 видео', max: '26 видео' },
  { label: 'Kling 2.5 Turbo', price: 35, basic: '8 видео', pro: '15 видео', max: '34 видео' },
  { section: 'Изображения (в месяц)' },
  { label: 'NanoBanana Pro', price: 22, basic: '13 изображений', pro: '25 изображений', max: '54 изображения' },
  { label: 'Flux 1.1 Pro Ultra', price: 15, basic: '20 изображений', pro: '36 изображений', max: '80 изображений' },
  { label: 'NanoBanana 2', price: 13, basic: '23 изображения', pro: '42 изображения', max: '92 изображения' },
  { label: 'Flux 1 Pro', price: 7, basic: '42 изображения', pro: '78 изображений', max: '170 изображений' },
  { label: 'NanoBanana', price: 7, basic: '42 изображения', pro: '78 изображений', max: '170 изображений' },
  { section: 'Текст (в месяц)' },
  { label: 'Claude Opus 4.6 / Opus 4.5', price: 8, basic: '37 запросов', pro: '68 запросов', max: '150 запросов' },
  { label: 'ChatGPT 5.4', price: 6, basic: '50 запросов', pro: '91 запрос', max: '200 запросов' },
  { label: 'ChatGPT 5.3 / 5.2 / Claude Sonnet 4.6 / 4.5 / 3.7 / Gemini 3.1 Pro / 3 Pro', price: 5, basic: '60 запросов', pro: '110 запросов', max: '240 запросов' },
  { label: 'ChatGPT 5 / Gemini 2.5 Pro', price: 3, basic: '100 запросов', pro: '183 запроса', max: '400 запросов' },
  { label: 'ChatGPT 5 mini / Gemini 3 Flash / Flash 2.5', price: 1, basic: '300 запросов', pro: 'Бесплатно', max: 'Бесплатно' },
  { section: 'Особенности' },
  { label: 'Ежемесячные айкоины', price: null, basic: '300', pro: '550', max: '1200', isCoinValue: true },
  { label: 'Скидка на пополнение', price: null, basic: '10%', pro: '15%', max: '20%' },
  { label: 'Приоритет в очереди', price: null, basic: 'Обычный', pro: 'Высокий', max: 'Максимальный' },
  { label: 'Размер контекста', price: null, basic: 'Увеличенный', pro: 'x2', max: 'x3' },
]

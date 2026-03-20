export const APP_NAME = 'Blackmount'
export const APP_DESCRIPTION = 'AI Aggregator — пробуй и сравнивай нейросети'

export const NAV_ITEMS = [
  { href: '/', label: 'Главная', icon: 'Home' },
  { href: '/history', label: 'История', icon: 'Clock' },
  { href: '/rating', label: 'Рейтинг', icon: 'BarChart3' },
  { href: '/prompts', label: 'Промпты', icon: 'Lightbulb' },
  { href: '/knowledge', label: 'База знаний', icon: 'BookOpen' },
  { href: '/arena', label: 'Арена', icon: 'Swords' },
] as const

export const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5)

export const PLACEHOLDER_TEXTS = [
  'Напиши код на Python...',
  'Сгенерируй изображение...',
  'Объясни квантовую физику...',
  'Создай бизнес-план...',
  'Переведи текст на английский...',
  'Напиши сочинение...',
  'Помоги с домашним заданием...',
  'Создай видео по описанию...',
] as const

export const FREE_DAILY_REQUESTS = 10
export const BASIC_DAILY_REQUESTS = 50
export const PRO_DAILY_REQUESTS = 200
export const ULTRA_DAILY_REQUESTS = Infinity
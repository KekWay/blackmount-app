export const APP_NAME = 'Blackmount'
export const APP_DESCRIPTION = 'AI Aggregator — пробуй и сравнивай нейросети'

export const NAV_ITEMS = [
  { href: '/', label: 'Главная', icon: 'Home' },
  { href: '/history', label: 'История', icon: 'Clock' },
  { href: '/prompts', label: 'Промпты', icon: 'Image' },
  { href: '/knowledge', label: 'База знаний', icon: 'BookOpen' },
  { href: '/rating', label: 'Рейтинг моделей', icon: 'Trophy' },
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

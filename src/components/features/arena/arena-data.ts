import type { ArenaModel } from '@/data/arena-models'

export const ARENA_LOCKED_IDS = new Set([
  'claude-opus', 'chatgpt-5.2', 'gemini-3-pro', 'flux-ultra',
  'nb-pro', 'sora-pro', 'veo31', 'kling26',
])

export const IMG_COIN = '/assets/models/06a5a3f12f7ccb4092a793253a07d8e11e003ba7.png'
export const IMG_LIGHTNING_MASK = '/assets/models/31423b4d4ba2f4b4cfeb98bc6688a1df0ecf6e9e.png'
export const IMG_MEDAL1 = '/assets/models/66cd1c41a928212fe0f95c7de90dac25cd61828f.png'
export const IMG_MEDAL2 = '/assets/models/04c2e129f17f1838c48e707c252d8c007bcc1741.png'
export const IMG_MEDAL3 = '/assets/models/141d170d5ec8c8d082a6c27e88e088f0ec975e4e.png'
export const IMG_SHARE_MASK = '/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png'

export const SVG_VS_PATH = 'M17.2501 42.6866L6.09166 8.88346L59.5119 52.7459L71.3332 20.0311'

export type Phase = 'idle' | 'generating' | 'voting' | 'winner'

export interface ModelResponse {
  model: ArenaModel
  text: string
}

export function getMock(model: ArenaModel): string {
  const m: Record<string, string> = {
    'claude-opus': 'Анализируя ваш запрос с позиции глубокого понимания контекста, я предлагаю следующий развёрнутый ответ. Рассмотрим ключевые аспекты: структуру, логику и практическое применение.\n\nВо-первых, стоит отметить, что данная тема требует системного подхода. Я проанализировал все доступные данные и подготовил оптимальное решение с учётом всех нюансов.',
    'chatgpt-5.2': 'Отличный вопрос! Вот мой подход:\n\n1. Анализ контекста — определяем ключевые параметры\n2. Формирование стратегии — выбираем оптимальный путь\n3. Реализация — пошаговое выполнение\n\nМогу детализировать любой из пунктов. Рекомендую начать с первого шага для максимальной эффективности.',
    'gemini-3-pro': 'Благодаря обработке обширного контекста, я могу предложить многоуровневый анализ:\n\n\u2022 Теоретическая база — фундаментальные принципы\n\u2022 Практика — реальные примеры применения\n\u2022 Оптимизация — как улучшить результат\n\nКаждый аспект подкреплён актуальными данными.',
    'claude-sonnet-4.5': 'Вот оптимальное решение:\n\nОсновная идея: применяем декомпозицию задачи на управляемые блоки. Каждый блок решается независимо, результаты объединяются.\n\nЭтот подход даёт максимальную гибкость и позволяет легко масштабировать решение.',
  }
  return m[model.id] || 'Вот мой ответ на ваш запрос. Я проанализировал ключевые аспекты и предлагаю структурированное решение.\n\nОсновные моменты: контекст задачи, оптимальный подход и рекомендации по реализации. Готов обсудить детали.'
}

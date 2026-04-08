import type { ArenaModel } from '@/data/arena-models'

export const ARENA_LOCKED_IDS = new Set([
  'claude-opus-4.5', 'chatgpt-5.2', 'gemini-3-pro', 'flux-1.1-pro-ultra',
  'nb-pro', 'veo-3.1-quality', 'veo-3.1-fast', 'kling-2.6',
  'kling-3.0', 'kling-3.0-pro',
  'gpt-5.4', 'gpt-5.3', 'claude-opus-4.6', 'gemini-3.1-pro',
  'nanobanana-2', 'kling-2.6-pro',
])

export const FREE_ARENA_IDS = new Set(['chatgpt-5-mini', 'gemini-3-flash', 'gemini-2.5-flash'])

export const IMG_COIN = '/assets/models/coin.png'
export const IMG_LIGHTNING_MASK = '/assets/models/lightning-mask.png'
export const IMG_MEDAL1 = '/assets/models/medal-1.png'
export const IMG_MEDAL2 = '/assets/models/medal-2.png'
export const IMG_MEDAL3 = '/assets/models/medal-3.png'
export const IMG_SHARE_MASK = '/assets/models/share-mask.png'

export const SVG_VS_PATH = 'M17.2501 42.6866L6.09166 8.88346L59.5119 52.7459L71.3332 20.0311'

export type Phase = 'idle' | 'generating' | 'voting' | 'winner'

export interface ModelResponse {
  model: ArenaModel
  text: string
}

export function getMock(model: ArenaModel): string {
  const m: Record<string, string> = {
    'claude-opus-4.5': '### Глубокий анализ\n\nРассмотрим задачу системно:\n\n- **Структура** — декомпозиция на блоки\n- **Логика** — причинно-следственные связи\n- **Применение** — практические шаги\n\n```python\ndef analyze(data: list) -> dict:\n    clusters = group_by_topic(data)\n    return {"topics": len(clusters), "coverage": 0.94}\n```\n\n> Системный подход позволяет охватить все аспекты задачи и минимизировать пробелы.',
    'chatgpt-5.2': '### Пошаговый план\n\n1. **Анализ контекста** — определяем параметры\n2. **Стратегия** — выбираем путь\n3. **Реализация** — выполняем\n\n```javascript\nconst plan = steps.map(s => ({\n  action: s.name,\n  priority: s.weight > 0.5 ? "high" : "low"\n}));\n```\n\n---\n\nРекомендую начать с первого шага для максимальной эффективности.',
    'gemini-3-pro': '### Многоуровневый анализ\n\nОбработав контекст, предлагаю:\n\n| Уровень | Описание |\n|---|---|\n| Теория | Фундаментальные принципы |\n| Практика | Реальные примеры |\n| Оптимизация | Улучшение результата |\n\n- **Точность**: высокая\n- **Охват**: полный\n\n> Каждый аспект подкреплён актуальными данными.',
    'claude-sonnet-4.5': '### Оптимальное решение\n\nПрименяем декомпозицию задачи:\n\n1. **Разбиение** — делим на управляемые блоки\n2. **Решение** — каждый блок независимо\n3. **Сборка** — объединяем результаты\n\n```python\nblocks = decompose(task)\nresults = [solve(b) for b in blocks]\nfinal = merge(results)\n```\n\n---\n\nПодход даёт гибкость и масштабируемость.',
  }
  return m[model.id] || '### Результат анализа\n\nКлючевые аспекты:\n\n- **Контекст** — учтён полностью\n- **Подход** — оптимальный\n- **Рекомендации** — готовы к применению\n\n```javascript\nconst result = await process(input);\nconsole.log(result.summary);\n```\n\n> Готов обсудить детали и углубиться в любой из пунктов.'
}

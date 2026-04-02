export interface LeaderboardModel {
  id: string
  name: string
  category: 'text' | 'image' | 'video'
  score: number
  speed: number
  accuracy: number
  costEfficiency: number
  creativity: number
  reasoning: number
  analytics: number
  price: number
  votes: number
  trend: number
  description: string
  useCases: string[]
  gradient: string
  aiModelRef: string | null
  usagePercent: number
}

export const leaderboardData: LeaderboardModel[] = [
  { id: "gpt-5.4", name: "ChatGPT 5.4", category: "text", score: 96, speed: 88, accuracy: 97, costEfficiency: 82, creativity: 94, reasoning: 97, analytics: 96, price: 6, votes: 12400, trend: 8.2, description: "Флагман OpenAI, объединяет Codex+GPT. Лучшая модель для кодинга и сложных рассуждений.", useCases: ["Код", "Рассуждения", "Мультимодальность", "Агенты"], gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", aiModelRef: "chatgpt", usagePercent: 8.5 },
  { id: "claude-opus-4.6", name: "Claude Opus 4.6", category: "text", score: 97, speed: 74, accuracy: 99, costEfficiency: 76, creativity: 96, reasoning: 99, analytics: 98, price: 8, votes: 9800, trend: 7.6, description: "Сильнейшая модель Anthropic. Агентные задачи, глубокий анализ, непревзойдённая точность.", useCases: ["Агенты", "Глубокий анализ", "Научные статьи", "Сложный код"], gradient: "linear-gradient(135deg, #D4A574 0%, #8B5E3C 100%)", aiModelRef: "claude", usagePercent: 6.5 },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", category: "text", score: 94, speed: 92, accuracy: 95, costEfficiency: 86, creativity: 92, reasoning: 96, analytics: 94, price: 5, votes: 14200, trend: 6.8, description: "Лучший баланс скорости и качества. Идеален для кодинга и повседневных задач.", useCases: ["Код", "Рефакторинг", "Аналитика", "Быстрые ответы"], gradient: "linear-gradient(135deg, #D4A574 0%, #C4956A 100%)", aiModelRef: "claude", usagePercent: 7 },
  { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro", category: "text", score: 95, speed: 85, accuracy: 96, costEfficiency: 83, creativity: 91, reasoning: 97, analytics: 96, price: 5, votes: 8600, trend: 9.1, description: "Топовая модель Google с мультимодальностью нового уровня.", useCases: ["Мультимодальность", "Длинный контекст", "Рассуждения", "Исследования"], gradient: "linear-gradient(135deg, #6097e4 0%, #644670 100%)", aiModelRef: "gemini", usagePercent: 5.5 },
  { id: "nanobanana-2", name: "NanoBanana 2", category: "image", score: 93, speed: 82, accuracy: 91, costEfficiency: 78, creativity: 96, reasoning: 0, analytics: 0, price: 13, votes: 4800, trend: 11.2, description: "Генерация изображений на базе Gemini 3.1 Flash Image. Яркие цвета, точный текст, до 4K.", useCases: ["Арт", "Текст на изображениях", "4K", "Иллюстрации"], gradient: "linear-gradient(135deg, #CBD03C 0%, #DCCA7A 100%)", aiModelRef: "nanobanana", usagePercent: 4.5 },
  { id: "kling-3.0-pro", name: "Kling 3.0 Pro", category: "video", score: 92, speed: 55, accuracy: 90, costEfficiency: 65, creativity: 94, reasoning: 0, analytics: 0, price: 85, votes: 3200, trend: 12.4, description: "Топ-качество, нативное аудио, мультиязычный lip-sync. Pro и Std варианты до 10 секунд.", useCases: ["Профессиональное видео", "Реклама", "Контент", "Lip-sync"], gradient: "linear-gradient(135deg, #1bfe27 0%, #0f69df 100%)", aiModelRef: "kling", usagePercent: 4.5 },
  { id: "gpt-5.3", name: "ChatGPT 5.3", category: "text", score: 93, speed: 92, accuracy: 94, costEfficiency: 86, creativity: 91, reasoning: 94, analytics: 93, price: 5, votes: 8200, trend: 5.4, description: "Быстрая модель для общения от OpenAI. Отличная скорость при высоком качестве.", useCases: ["Чат", "Код", "Анализ", "Быстрые ответы"], gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", aiModelRef: "chatgpt", usagePercent: 5 },
  { id: "chatgpt-5", name: "ChatGPT 5", category: "text", score: 91, speed: 90, accuracy: 92, costEfficiency: 89, creativity: 88, reasoning: 92, analytics: 93, price: 3, votes: 42800, trend: 1.1, description: "Отличный баланс качества и стоимости. Универсальная модель для большинства задач.", useCases: ["Универсальность", "Чат", "Анализ изображений", "Код"], gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", aiModelRef: "chatgpt", usagePercent: 9 },
  { id: "flux-1.1-pro-ultra", name: "Flux 1.1 Pro Ultra", category: "image", score: 94, speed: 65, accuracy: 92, costEfficiency: 72, creativity: 97, reasoning: 0, analytics: 0, price: 15, votes: 8900, trend: 3.4, description: "Максимальное качество генерации от Black Forest.", useCases: ["Ultra HD", "Печать", "Дизайн", "Фотореализм"], gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", aiModelRef: "flux", usagePercent: 8 },
  { id: "chatgpt-5.2", name: "ChatGPT 5.2", category: "text", score: 94, speed: 86, accuracy: 95, costEfficiency: 84, creativity: 92, reasoning: 96, analytics: 95, price: 5, votes: 31200, trend: 3.6, description: "Новейший флагман OpenAI. Улучшенные рассуждения, кодинг и мультимодальность.", useCases: ["Мультимодальность", "Код", "Анализ", "Рассуждения"], gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", aiModelRef: "chatgpt", usagePercent: 7.5 },
  { id: "chatgpt-5-mini", name: "ChatGPT 5 mini", category: "text", score: 80, speed: 96, accuracy: 82, costEfficiency: 98, creativity: 75, reasoning: 78, analytics: 70, price: 1, votes: 38200, trend: 0.9, description: "Самая дешёвая модель OpenAI.", useCases: ["Бюджет", "Чат", "Саммари", "Перевод"], gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)", aiModelRef: "chatgpt", usagePercent: 7 },
  { id: "flux-1-pro", name: "Flux 1 Pro", category: "image", score: 89, speed: 78, accuracy: 88, costEfficiency: 88, creativity: 94, reasoning: 0, analytics: 0, price: 7, votes: 14300, trend: 1.6, description: "Фотореалистичная генерация.", useCases: ["Фотореализм", "Портреты", "Продуктовая съёмка"], gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", aiModelRef: "flux", usagePercent: 7 },
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", category: "text", score: 92, speed: 91, accuracy: 93, costEfficiency: 85, creativity: 90, reasoning: 94, analytics: 92, price: 5, votes: 28900, trend: 3.2, description: "Оптимальный баланс качества и скорости. Лучший выбор для кодинга и аналитики.", useCases: ["Код", "Рефакторинг", "Документация", "Отладка"], gradient: "linear-gradient(135deg, #D4A574 0%, #C4956A 100%)", aiModelRef: "claude", usagePercent: 6 },
  { id: "nb-2.0", name: "NanoBanana", category: "image", score: 87, speed: 85, accuracy: 84, costEfficiency: 88, creativity: 93, reasoning: 0, analytics: 0, price: 7, votes: 9800, trend: 1.4, description: "Стилизованная генерация с уникальным подходом.", useCases: ["Стилизация", "Арт", "Иллюстрации", "Концепты"], gradient: "linear-gradient(135deg, #CBD03C 0%, #DCCA7A 100%)", aiModelRef: "nanobanana", usagePercent: 5.5 },
  { id: "claude-opus-4.5", name: "Claude Opus 4.5", category: "text", score: 96, speed: 72, accuracy: 99, costEfficiency: 78, creativity: 95, reasoning: 99, analytics: 97, price: 8, votes: 18420, trend: 2.4, description: "Самая мощная модель Anthropic. Непревзойдённое качество анализа, написания текстов и сложных рассуждений.", useCases: ["Глубокий анализ", "Научные статьи", "Сложный код", "Стратегия"], gradient: "linear-gradient(135deg, #D4A574 0%, #8B5E3C 100%)", aiModelRef: "claude", usagePercent: 5 },
  { id: "veo-3.1-quality", name: "Veo 3.1 Quality", category: "video", score: 93, speed: 40, accuracy: 92, costEfficiency: 52, creativity: 95, reasoning: 0, analytics: 0, price: 185, votes: 5200, trend: 4.6, description: "Кинематографическое видео от Google. Максимальное качество.", useCases: ["8K видео", "Кинематограф", "Реклама"], gradient: "linear-gradient(135deg, #7188e3 0%, #e2694e 100%)", aiModelRef: "veo31", usagePercent: 3 },
  { id: "veo-3.1-fast", name: "Veo 3.1 Fast", category: "video", score: 88, speed: 72, accuracy: 87, costEfficiency: 74, creativity: 90, reasoning: 0, analytics: 0, price: 50, votes: 4200, trend: 3.2, description: "Быстрая видеогенерация от Google.", useCases: ["Быстрое видео", "Контент", "Прототипы"], gradient: "linear-gradient(135deg, #7188e3 0%, #e2694e 100%)", aiModelRef: "veo31", usagePercent: 2 },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", category: "text", score: 93, speed: 84, accuracy: 94, costEfficiency: 84, creativity: 89, reasoning: 95, analytics: 94, price: 5, votes: 19400, trend: 4.2, description: "Новейшая модель Google третьего поколения с прорывным уровнем рассуждений.", useCases: ["Длинный контекст", "Рассуждения", "Мультимодальность", "Исследования"], gradient: "linear-gradient(135deg, #6097e4 0%, #644670 100%)", aiModelRef: "gemini", usagePercent: 4.5 },
  { id: "nb-pro", name: "NanoBanana Pro", category: "image", score: 92, speed: 72, accuracy: 90, costEfficiency: 68, creativity: 97, reasoning: 0, analytics: 0, price: 22, votes: 6200, trend: 2.8, description: "Премиальная NanoBanana с максимальным качеством.", useCases: ["Премиум арт", "Высокое разрешение", "Маркетинг"], gradient: "linear-gradient(135deg, #CBD03C 0%, #DCCA7A 100%)", aiModelRef: "nanobanana", usagePercent: 4 },
  { id: "gemini-3-flash", name: "Gemini 3 Flash", category: "text", score: 83, speed: 97, accuracy: 85, costEfficiency: 98, creativity: 79, reasoning: 82, analytics: 80, price: 1, votes: 12400, trend: 5.1, description: "Быстрая модель нового поколения. Улучшенное качество при минимальной стоимости.", useCases: ["Быстрые ответы", "Код", "Саммари", "Бюджет"], gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", aiModelRef: "gemini", usagePercent: 4 },
  { id: "kling-2.6", name: "Kling 2.6", category: "video", score: 88, speed: 60, accuracy: 86, costEfficiency: 76, creativity: 90, reasoning: 0, analytics: 0, price: 45, votes: 8600, trend: 3.1, description: "Генерация 5-10 сек с/без звука.", useCases: ["Видео со звуком", "Короткие ролики"], gradient: "linear-gradient(135deg, #1bfe27 0%, #0f69df 100%)", aiModelRef: "kling", usagePercent: 4 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", category: "text", score: 90, speed: 85, accuracy: 91, costEfficiency: 89, creativity: 87, reasoning: 91, analytics: 90, price: 3, votes: 22150, trend: 0.4, description: "Мультимодальная модель Google с лучшей обработкой длинного контекста.", useCases: ["Длинный контекст", "Суммаризация", "Мультимодальность"], gradient: "linear-gradient(135deg, #6097e4 0%, #644670 100%)", aiModelRef: "gemini", usagePercent: 3 },
  { id: "kling-2.5-turbo", name: "Kling 2.5 Turbo", category: "video", score: 83, speed: 80, accuracy: 82, costEfficiency: 85, creativity: 84, reasoning: 0, analytics: 0, price: 35, votes: 6100, trend: 0.7, description: "Быстрая генерация видео 5-10 сек.", useCases: ["Быстрое видео", "Прототипы"], gradient: "linear-gradient(135deg, #1bfe27 0%, #0f69df 100%)", aiModelRef: "kling", usagePercent: 3 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", category: "text", score: 81, speed: 98, accuracy: 83, costEfficiency: 98, creativity: 77, reasoning: 79, analytics: 75, price: 1, votes: 16800, trend: 0.5, description: "Самая быстрая модель Google.", useCases: ["Быстрые ответы", "Классификация", "Саммари"], gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)", aiModelRef: "gemini", usagePercent: 2.5 },
  { id: "claude-sonnet-3.7", name: "Claude Sonnet 3.7", category: "text", score: 88, speed: 89, accuracy: 90, costEfficiency: 85, creativity: 86, reasoning: 90, analytics: 88, price: 5, votes: 21400, trend: -0.6, description: "Проверенная модель предыдущего поколения. Стабильный выбор для кодинга.", useCases: ["Код", "Анализ текста", "Отладка", "Рефакторинг"], gradient: "linear-gradient(135deg, #D4A574 0%, #C4956A 100%)", aiModelRef: "claude", usagePercent: 2.5 },
  { id: "claude-haiku-4.5", name: "Claude Haiku 4.5", category: "text", score: 82, speed: 97, accuracy: 84, costEfficiency: 96, creativity: 78, reasoning: 80, analytics: 76, price: 1.5, votes: 15600, trend: 1.8, description: "Молниеносно быстрая модель Anthropic для простых задач.", useCases: ["Быстрые ответы", "Классификация", "Чат-бот", "Бюджет"], gradient: "linear-gradient(135deg, #D4A574 0%, #C4956A 100%)", aiModelRef: "claude", usagePercent: 2 },
]

export type SortKey = 'usagePercent' | 'score' | 'speed' | 'accuracy' | 'costEfficiency' | 'creativity' | 'reasoning' | 'analytics'
export type CategoryFilter = 'all' | 'text' | 'image' | 'video'

export const CATEGORY_OPTIONS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "Все модели" },
  { key: "text", label: "Текст" },
  { key: "image", label: "Изображения" },
  { key: "video", label: "Видео" },
]

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "usagePercent", label: "Популярность" },
  { key: "score", label: "Оценка" },
  { key: "speed", label: "Скорость" },
  { key: "accuracy", label: "Точность" },
  { key: "costEfficiency", label: "Цена" },
]

export const SPOTLIGHTS = [
  { title: "Лучший для кода", badge: "#1 Code", model: "Claude Sonnet 4.5", score: 92, iconImg: "/assets/models/leader-claude-code.png", color: "#888ae5", metric: "Точность", metricValue: "96%", aiModelRef: "claude" },
  { title: "Креативность", badge: "#1 Creative", model: "Flux 1.1 Pro", score: 94, iconImg: "/assets/models/leader-flux-creative.png", color: "#f472b6", metric: "Арт", metricValue: "97", aiModelRef: "flux" },
  { title: "Доступность", badge: "Best Value", model: "ChatGPT 5 mini", score: 80, iconImg: "/assets/models/leader-chatgpt-value.png", color: "#4ade80", metric: "Цена", metricValue: "1", showCoin: true, aiModelRef: "chatgpt" },
  { title: "Быстрый ответ", badge: "Fastest", model: "Gemini 2.5 Flash", score: 81, iconImg: "/assets/models/leader-gemini-fast.png", color: "#fbbf24", metric: "Скорость", metricValue: "98", aiModelRef: "gemini" },
  { title: "Лучшее видео", badge: "#1 Video", model: "Veo 3.1", score: 91, iconImg: "/assets/models/leader-veo-video.png", color: "#7188e3", metric: "Качество", metricValue: "90", aiModelRef: "veo31" },
  { title: "Рассуждения", badge: "#1 Reasoning", model: "Claude Opus 4.5", score: 96, iconImg: "/assets/models/leader-claude-reasoning.png", color: "#D4A574", metric: "Логика", metricValue: "99", aiModelRef: "claude" },
  { title: "Аналитика", badge: "#1 Analytics", model: "Claude Opus 4.5", score: 96, iconImg: "/assets/models/leader-claude-analytics.png", color: "#818cf8", metric: "Аналитика", metricValue: "99", aiModelRef: "claude" },
]

export const RATING_LOCKED_MAP: Record<string, string> = {
  "gpt-5.4": "gpt-5.4",
  "claude-opus-4.6": "claude-opus-4.6",
  "gemini-3.1-pro": "gemini-3.1-pro",
  "nanobanana-2": "nanobanana-2",
  "kling-3.0-pro": "kling-3.0-pro",
  "chatgpt-5.2": "chatgpt-5.2",
  "claude-opus-4.5": "claude-opus-4.5",
  "gemini-3-pro": "gemini-3-pro",
  "flux-1.1-pro-ultra": "flux-1.1-pro-ultra",
  "nb-pro": "nb-pro",
  "veo-3.1-quality": "veo-3.1-quality",
  "kling-2.6": "kling-2.6",
}

export interface LeaderboardModel {
  id: string
  name: string
  category: 'text' | 'image' | 'video'
  score: number
  speed: number
  accuracy: number
  costEfficiency: number
  creativity: number
  price: number
  votes: number
  trend: number
  description: string
  usagePercent: number
  aiModelRef: string | null
}

export const leaderboardData: LeaderboardModel[] = [
  { id: "chatgpt-5", name: "ChatGPT 5", category: "text", score: 91, speed: 90, accuracy: 92, costEfficiency: 89, creativity: 88, price: 3, votes: 42800, trend: 1.1, description: "Отличный баланс качества и стоимости.", usagePercent: 9, aiModelRef: "chatgpt" },
  { id: "chatgpt-5.2", name: "ChatGPT 5.2", category: "text", score: 94, speed: 86, accuracy: 95, costEfficiency: 84, creativity: 92, price: 5, votes: 31200, trend: 3.6, description: "Флагман OpenAI.", usagePercent: 7.5, aiModelRef: "chatgpt" },
  { id: "claude-opus", name: "Claude Opus 4.5", category: "text", score: 96, speed: 72, accuracy: 99, costEfficiency: 78, creativity: 95, price: 8, votes: 18420, trend: 2.4, description: "Самая мощная модель Anthropic.", usagePercent: 5, aiModelRef: "claude" },
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", category: "text", score: 92, speed: 91, accuracy: 93, costEfficiency: 85, creativity: 90, price: 5, votes: 28900, trend: 3.2, description: "Оптимальный баланс качества и скорости.", usagePercent: 6, aiModelRef: "claude" },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", category: "text", score: 93, speed: 84, accuracy: 94, costEfficiency: 84, creativity: 89, price: 5, votes: 19400, trend: 4.2, description: "Новейшая модель Google.", usagePercent: 4.5, aiModelRef: "gemini" },
  { id: "flux-1.1-pro-ultra", name: "Flux 1.1 Pro Ultra", category: "image", score: 94, speed: 65, accuracy: 92, costEfficiency: 72, creativity: 97, price: 15, votes: 8900, trend: 3.4, description: "Максимальное качество от Black Forest.", usagePercent: 8, aiModelRef: "flux" },
  { id: "nanobanana-pro", name: "NanoBanana Pro", category: "image", score: 92, speed: 72, accuracy: 90, costEfficiency: 68, creativity: 97, price: 22, votes: 6200, trend: 2.8, description: "Премиальная NanoBanana.", usagePercent: 4, aiModelRef: "nanobanana" },
  { id: "sora-2-pro", name: "Sora 2 Pro", category: "video", score: 95, speed: 40, accuracy: 94, costEfficiency: 55, creativity: 98, price: 115, votes: 7400, trend: 4.5, description: "Премиальная Sora.", usagePercent: 4, aiModelRef: "sora2" },
  { id: "veo-3.1", name: "Veo 3.1", category: "video", score: 91, speed: 50, accuracy: 90, costEfficiency: 62, creativity: 93, price: 50, votes: 9400, trend: 3.8, description: "Видеогенерация от Google.", usagePercent: 5, aiModelRef: "veo31" },
  { id: "kling-2.6", name: "Kling 2.6", category: "video", score: 88, speed: 60, accuracy: 86, costEfficiency: 76, creativity: 90, price: 45, votes: 8600, trend: 3.1, description: "Генерация 5-10 сек с/без звука.", usagePercent: 4, aiModelRef: "kling" },
]

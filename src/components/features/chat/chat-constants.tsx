export const greetingPhrases = [
  'Чем могу помочь?', 'Что создадим сегодня?', 'Готов помочь!',
  'С чего начнём?', 'Какой у вас запрос?', 'Что вас интересует?',
  'Давайте начнём!', 'Чем вам помочь?',
]

export function getRandomGreeting(): string {
  return greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)]
}

export const testImageSrc = 'https://images.unsplash.com/photo-1644328293665-a783b37f25d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwbWFnaWNhbHxlbnwxfHx8fDE3NzI0NzI1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
export const testVideoSrc = 'https://images.unsplash.com/photo-1688377051459-aebb99b42bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbnxlbnwxfHx8fDE3NzI1MTg5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
export const testImagePool = [
  testImageSrc,
  'https://images.unsplash.com/photo-1713188090500-a4fb0d2cf309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwYWJzdHJhY3QlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI4OTQ4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1764145045070-02d766d3ad4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwbGFuZHNjYXBlJTIwZHJlYW15JTIwbW91bnRhaW5zfGVufDF8fHx8MTc3Mjk4ODgxMHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1715614176939-f5c46ae99d04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbmVvbiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzI5NzM1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
]

export const FREE_SUB_VERSIONS = ['chatgpt-5-mini', 'gemini-3-flash', 'gemini-2.5-flash']

export function isVersionFreeForTier(versionId: string, tier: string): boolean {
  if (!FREE_SUB_VERSIONS.includes(versionId)) return false
  return tier === 'pro' || tier === 'max'
}

export const videoPricingMap: Record<string, Record<string, number>> = {
  'kling-3.0-pro': { '5s': 85, '10s': 170 },
  'kling-3.0': { '5s': 55, '10s': 110 },
  'kling-2.6-pro': { '5s': 45, '10s': 85 },
  'kling-2.6-pro-audio': { '5s': 85, '10s': 170 },
  'kling-2.6': { '5s': 45, '10s': 85 },
  'kling-2.6-audio': { '5s': 85, '10s': 170 },
  'kling-2.5-turbo': { '5s': 35, '10s': 65 },
  'veo-3.1-quality': { '8s': 220, '5s': 145 },
  'veo-3.1-fast': { '8s': 50, '5s': 35 },
}

export const DURATION_KEY_MAP: Record<string, string> = {
  '5с': '5s', '10с': '10s', '8с': '8s',
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

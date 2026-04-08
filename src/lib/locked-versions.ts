/**
 * Единый источник правды для подписочных (заблокированных) версий моделей.
 *
 * При добавлении новой подписочной версии — добавь её id ТОЛЬКО СЮДА.
 * Все компоненты и stores импортируют из этого файла.
 *
 * НЕ добавляй сюда: claude-sonnet-4.6 (доступна без подписки).
 */

/** Версии, требующие подписку (Pro или Max) */
export const SUBSCRIPTION_VERSION_IDS = new Set([
  // ChatGPT
  'gpt-5.4',
  'gpt-5.3',
  'chatgpt-5.2',
  // Claude
  'claude-opus-4.6',
  'claude-opus-4.5',
  // Gemini
  'gemini-3.1-pro',
  'gemini-3-pro',
  // NanoBanana
  'nanobanana-2',
  'nb-pro',
  // Flux
  'flux-1.1-pro-ultra',
  // Kling
  'kling-3.0-pro',
  'kling-3.0',
  'kling-2.6-pro',
  'kling-2.6',
  // Veo
  'veo-3.1-quality',
  'veo-3.1-fast',
])

/** Проверка: требует ли версия подписку */
export function isVersionSubscriptionOnly(versionId: string): boolean {
  return SUBSCRIPTION_VERSION_IDS.has(versionId)
}

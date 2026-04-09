/**
 * Единый источник правды для подписочных (заблокированных) версий моделей.
 *
 * При добавлении новой подписочной версии — добавь её id ТОЛЬКО СЮДА.
 * Все компоненты и stores импортируют из этого файла.
 *
 * НЕ добавляй сюда: claude-sonnet-4.6 (доступна без подписки).
 */

/** Версии, требующие любую активную подписку (Basic/Pro/Max) */
export const SUBSCRIPTION_VERSION_IDS = new Set([
  // ChatGPT
  'gpt-5.4',
  'gpt-5.3',
  // Claude
  'claude-opus-4.6',
  'claude-opus-4.5',
  // Gemini
  'gemini-3.1-pro',
  // NanoBanana
  'nanobanana-2',
  'nanobanana-pro',
  // Flux
  'flux-2-pro',
  'flux-1.1-pro-ultra',
  // Kling
  'kling-3.0-pro',
  'kling-3.0',
  'kling-2.6-pro',
  // Veo
  'veo-3.1-quality',
  'veo-3.1-fast',
])

/** Проверка: требует ли версия подписку */
export function isVersionSubscriptionOnly(versionId: string): boolean {
  return SUBSCRIPTION_VERSION_IDS.has(versionId)
}

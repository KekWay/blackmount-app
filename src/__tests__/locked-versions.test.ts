import { describe, test, expect } from 'vitest'
import { SUBSCRIPTION_VERSION_IDS, isVersionSubscriptionOnly } from '@/lib/locked-versions'

describe('locked-versions', () => {
  test('содержит 14 версий', () => {
    expect(SUBSCRIPTION_VERSION_IDS.size).toBe(14)
  })

  test('gpt-5.4 — подписочная', () => {
    expect(isVersionSubscriptionOnly('gpt-5.4')).toBe(true)
  })

  test('claude-sonnet-4.6 — НЕ подписочная', () => {
    expect(isVersionSubscriptionOnly('claude-sonnet-4.6')).toBe(false)
  })

  test('chatgpt-5.2 — НЕ подписочная (убрана из locked)', () => {
    expect(isVersionSubscriptionOnly('chatgpt-5.2')).toBe(false)
  })

  test('kling-2.6 — НЕ подписочная (убрана из locked)', () => {
    expect(isVersionSubscriptionOnly('kling-2.6')).toBe(false)
  })

  test('gemini-3-pro — НЕ подписочная (убрана из locked)', () => {
    expect(isVersionSubscriptionOnly('gemini-3-pro')).toBe(false)
  })

  test('несуществующая версия — НЕ подписочная', () => {
    expect(isVersionSubscriptionOnly('nonexistent')).toBe(false)
  })
})

import { describe, test, expect } from 'vitest'
import { isVersionFreeForTier, FREE_SUB_VERSIONS } from '@/components/features/chat/chat-constants'

describe('isVersionFreeForTier', () => {
  test('chatgpt-5-mini бесплатна для Pro', () => {
    expect(isVersionFreeForTier('chatgpt-5-mini', 'pro')).toBe(true)
  })

  test('chatgpt-5-mini бесплатна для Max', () => {
    expect(isVersionFreeForTier('chatgpt-5-mini', 'max')).toBe(true)
  })

  test('chatgpt-5-mini НЕ бесплатна для Basic', () => {
    expect(isVersionFreeForTier('chatgpt-5-mini', 'basic')).toBe(false)
  })

  test('chatgpt-5-mini НЕ бесплатна для Free', () => {
    expect(isVersionFreeForTier('chatgpt-5-mini', 'free')).toBe(false)
  })

  test('gemini-3-flash бесплатна для Pro', () => {
    expect(isVersionFreeForTier('gemini-3-flash', 'pro')).toBe(true)
  })

  test('обычная модель НЕ бесплатна для Pro', () => {
    expect(isVersionFreeForTier('chatgpt-5.2', 'pro')).toBe(false)
  })

  test('FREE_SUB_VERSIONS содержит 3 модели', () => {
    expect(FREE_SUB_VERSIONS).toHaveLength(3)
    expect(FREE_SUB_VERSIONS).toContain('chatgpt-5-mini')
    expect(FREE_SUB_VERSIONS).toContain('gemini-3-flash')
    expect(FREE_SUB_VERSIONS).toContain('gemini-2.5-flash')
  })
})

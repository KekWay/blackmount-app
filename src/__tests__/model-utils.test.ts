import { describe, test, expect } from 'vitest'
import { getBasePrice, hasAudioPricing } from '@/types/models'

describe('getBasePrice', () => {
  test('число → возвращает число', () => {
    expect(getBasePrice(7)).toBe(7)
  })

  test('объект → возвращает минимальное значение', () => {
    expect(getBasePrice({ '5s': 85, '10s': 170 })).toBe(85)
  })

  test('объект с audio → минимум из всех', () => {
    expect(getBasePrice({ '5s': 45, '5s_audio': 85, '10s': 85, '10s_audio': 170 })).toBe(45)
  })

  test('undefined → 0', () => {
    expect(getBasePrice(undefined)).toBe(0)
  })

  test('null → 0', () => {
    expect(getBasePrice(null as unknown as undefined)).toBe(0)
  })
})

describe('hasAudioPricing', () => {
  test('объект с _audio ключами → true', () => {
    expect(hasAudioPricing({ '5s': 45, '5s_audio': 85 })).toBe(true)
  })

  test('объект без _audio → false', () => {
    expect(hasAudioPricing({ '5s': 85, '10s': 170 })).toBe(false)
  })

  test('число → false', () => {
    expect(hasAudioPricing(7)).toBe(false)
  })

  test('undefined → false', () => {
    expect(hasAudioPricing(undefined)).toBe(false)
  })
})

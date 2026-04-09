import { describe, test, expect } from 'vitest'
import { computeDynamicCost } from '@/components/features/chat/compute-dynamic-cost'
import type { AIModel, ModelVersion, SubscriptionTier } from '@/types'

function makeText(id: string, price: number): { model: AIModel; version: ModelVersion } {
  const version: ModelVersion = { id, label: id, price, tier: 'free' }
  const model: AIModel = {
    id: 'm', name: 'm', category: 'text', gradient: '', versions: [version], glowColors: [],
  }
  return { model, version }
}

function makeImage(id: string, price: ModelVersion['price']): { model: AIModel; version: ModelVersion } {
  const version: ModelVersion = { id, label: id, price, tier: 'free' }
  const model: AIModel = {
    id: 'm', name: 'm', category: 'image', gradient: '', versions: [version], glowColors: [],
  }
  return { model, version }
}

function makeVideo(id: string, price: ModelVersion['price']): { model: AIModel; version: ModelVersion } {
  const version: ModelVersion = { id, label: id, price, tier: 'sub' }
  const model: AIModel = {
    id: 'm', name: 'm', category: 'video', gradient: '', versions: [version], glowColors: [],
  }
  return { model, version }
}

const baseParams = {
  tier: 'free' as SubscriptionTier,
  webSearchActive: false,
  deepResearchActive: false,
  videoDuration: '5с',
  quality: '1K',
  audioEnabled: false,
  imageCount: 1,
}

describe('computeDynamicCost — text models', () => {
  test('базовая цена ChatGPT 5 = 3', () => {
    const { model, version } = makeText('chatgpt-5', 3)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true })).toBe(3)
  })

  test('+ webSearch → +3', () => {
    const { model, version } = makeText('chatgpt-5', 3)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true, webSearchActive: true })).toBe(6)
  })

  test('+ deepResearch → +3', () => {
    const { model, version } = makeText('chatgpt-5', 3)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true, deepResearchActive: true })).toBe(6)
  })

  test('+ webSearch + deepResearch → +6', () => {
    const { model, version } = makeText('chatgpt-5', 3)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true, webSearchActive: true, deepResearchActive: true })).toBe(9)
  })

  test('chatgpt-5-mini для Pro → 0', () => {
    const { model, version } = makeText('chatgpt-5-mini', 1)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true, tier: 'pro' })).toBe(0)
  })

  test('chatgpt-5-mini для Basic → 1', () => {
    const { model, version } = makeText('chatgpt-5-mini', 1)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true, tier: 'basic' })).toBe(1)
  })

  test('chatgpt-5-mini для Free → 1', () => {
    const { model, version } = makeText('chatgpt-5-mini', 1)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: true, tier: 'free' })).toBe(1)
  })
})

describe('computeDynamicCost — image models', () => {
  test('NanoBanana базовая (price=7, count=1) → 7', () => {
    const { model, version } = makeImage('nanobanana', 7)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false })).toBe(7)
  })

  test('NanoBanana базовая (count=3) → 21', () => {
    const { model, version } = makeImage('nanobanana', 7)
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, imageCount: 3 })).toBe(21)
  })

  test('NanoBanana 2 1K → 13', () => {
    const { model, version } = makeImage('nanobanana-2', { '1k': 13, '2k': 19, '4k': 26 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, quality: '1K' })).toBe(13)
  })

  test('NanoBanana 2 4K x2 → 52', () => {
    const { model, version } = makeImage('nanobanana-2', { '1k': 13, '2k': 19, '4k': 26 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, quality: '4K', imageCount: 2 })).toBe(52)
  })
})

describe('computeDynamicCost — video models', () => {
  test('Kling 3.0 Pro 5с → 85', () => {
    const { model, version } = makeVideo('kling-3.0-pro', { '5s': 85, '10s': 170 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '5с' })).toBe(85)
  })

  test('Kling 3.0 Pro 10с → 170', () => {
    const { model, version } = makeVideo('kling-3.0-pro', { '5s': 85, '10s': 170 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '10с' })).toBe(170)
  })

  test('Kling 2.6 без звука 5с → 45', () => {
    const { model, version } = makeVideo('kling-2.6', { '5s': 45, '5s_audio': 85, '10s': 85, '10s_audio': 170 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '5с', audioEnabled: false })).toBe(45)
  })

  test('Kling 2.6 со звуком 5с → 85', () => {
    const { model, version } = makeVideo('kling-2.6', { '5s': 45, '5s_audio': 85, '10s': 85, '10s_audio': 170 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '5с', audioEnabled: true })).toBe(85)
  })

  test('Kling 2.6 со звуком 10с → 170', () => {
    const { model, version } = makeVideo('kling-2.6', { '5s': 45, '5s_audio': 85, '10s': 85, '10s_audio': 170 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '10с', audioEnabled: true })).toBe(170)
  })

  test('Veo 3.1 Quality 8с → 220', () => {
    const { model, version } = makeVideo('veo-3.1-quality', { '8s': 220, '5s': 145 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '8с' })).toBe(220)
  })

  test('Veo 3.1 Quality 5с → 145', () => {
    const { model, version } = makeVideo('veo-3.1-quality', { '8s': 220, '5s': 145 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '5с' })).toBe(145)
  })

  test('Kling 2.5 Turbo 5с → 35', () => {
    const { model, version } = makeVideo('kling-2.5-turbo', { '5s': 35, '10s': 65 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '5с' })).toBe(35)
  })

  test('Kling 2.5 Turbo 10с → 65', () => {
    const { model, version } = makeVideo('kling-2.5-turbo', { '5s': 35, '10s': 65 })
    expect(computeDynamicCost({ ...baseParams, model, selectedVersion: version, isTextModel: false, videoDuration: '10с' })).toBe(65)
  })
})

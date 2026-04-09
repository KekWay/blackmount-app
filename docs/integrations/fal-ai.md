# Интеграция: fal.ai (генерация изображений)

## Описание
fal.ai — API для генерации изображений. NanoBanana и Flux доступны через fal.ai.
Оплата per-image или per-megapixel. Быстрый inference (~5-10 сек).

## URL
```
POST https://queue.fal.run/{model-endpoint}
```

## Заголовки
```typescript
headers: {
  'Authorization': `Key ${FAL_API_KEY}`,
  'Content-Type': 'application/json',
}
```

## Маппинг моделей
```typescript
const IMAGE_MODEL_MAP: Record<string, string> = {
  // NanoBanana
  'nanobanana-2': 'fal-ai/nano-banana-2',
  'nanobanana-pro': 'fal-ai/nano-banana/pro',
  'nanobanana': 'fal-ai/nano-banana',
  // Flux
  'flux-2-pro': 'fal-ai/flux-2-pro',
  'flux-1.1-pro-ultra': 'fal-ai/flux-pro/v1.1-ultra',
  'flux-1-pro': 'fal-ai/flux-pro/v1',
  'flux-1-dev': 'fal-ai/flux/dev',
}
```

## Запрос (text-to-image)
```typescript
const response = await fetch(`https://queue.fal.run/${IMAGE_MODEL_MAP[versionId]}`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    prompt: userPrompt,
    image_size: 'landscape_16_9', // или square_hd, portrait_4_3
    num_images: 1,
    enable_safety_checker: true,
  }),
})
const result = await response.json()
// result.images[0].url — URL сгенерированного изображения
```

## Асинхронный режим (для долгих генераций)
```typescript
// 1. Отправить задачу
const submitResponse = await fetch(`https://queue.fal.run/${model}`, {
  method: 'POST', headers,
  body: JSON.stringify({ prompt, image_size: 'square_hd' }),
})
const { request_id } = await submitResponse.json()

// 2. Поллинг статуса
const statusResponse = await fetch(`https://queue.fal.run/${model}/requests/${request_id}/status`, {
  headers,
})
// status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED'

// 3. Получить результат
const resultResponse = await fetch(`https://queue.fal.run/${model}/requests/${request_id}`, {
  headers,
})
const { images } = await resultResponse.json()
```

## Ценообразование (из docs/modules/chat.md)
| Модель | API стоимость | Цена (айкоины) |
|--------|---------------|----------------|
| NanoBanana | $0.039/img | 7 |
| NanoBanana Pro (1K/2K) | $0.15/img | 22 |
| NanoBanana Pro (4K) | $0.30/img | 43 |
| NanoBanana 2 (1K) | $0.08/img | 13 |
| NanoBanana 2 (2K) | $0.12/img | 19 |
| NanoBanana 2 (4K) | $0.16/img | 26 |
| Flux 2 Pro | $0.03/MP | 5 |
| Flux 1.1 Pro Ultra | $0.06/img | 15 |
| Flux 1.1 Pro | $0.04/MP | 7 |
| Flux 1 Dev | $0.025/MP | 4 |

## Ошибки
| Код | Значение | Действие |
|-----|---------|----------|
| 401 | Неверный API ключ | Проверить FAL_API_KEY |
| 422 | Невалидный запрос | Проверить параметры |
| 429 | Rate limit | Retry через 2 сек |
| 500 | Ошибка генерации | Retry 1×, ErrorScreen |

## .env
```
FAL_API_KEY=...
```

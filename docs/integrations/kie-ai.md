# Интеграция: kie.ai (генерация видео)

## Описание
kie.ai — API-агрегатор для генерации видео. Kling, Veo 3.1 доступны через единый API.
Асинхронная генерация: отправка → polling → получение результата (1-10 мин).

## URL
```
Base: https://api.kie.ai/api/v1/
```

## Заголовки
```typescript
headers: {
  'Authorization': `Bearer ${KIE_API_KEY}`,
  'Content-Type': 'application/json',
}
```

## Маппинг моделей → эндпойнтов
```typescript
const VIDEO_MODEL_MAP: Record<string, { endpoint: string; model: string }> = {
  'kling-3.0-pro':    { endpoint: 'kling/generate', model: 'kling3.0_pro' },
  'kling-3.0':        { endpoint: 'kling/generate', model: 'kling3.0' },
  'kling-2.6-pro':    { endpoint: 'kling/generate', model: 'kling2.6_pro' },
  'kling-2.6':        { endpoint: 'kling/generate', model: 'kling2.6' },
  'kling-2.5-turbo':  { endpoint: 'kling/generate', model: 'kling2.5_turbo' },
  'veo-3.1-quality':  { endpoint: 'veo/generate', model: 'veo3_quality' },
  'veo-3.1-fast':     { endpoint: 'veo/generate', model: 'veo3_fast' },
}
```

## Генерация видео (text-to-video)
```typescript
// 1. Отправить задачу
const { endpoint, model } = VIDEO_MODEL_MAP[versionId]
const response = await fetch(`https://api.kie.ai/api/v1/${endpoint}`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    prompt: userPrompt,
    model: model,
    aspect_ratio: '16:9',
    callBackUrl: 'https://blackmount.app/api/webhooks/kie',
  }),
})
const { data: { task_id } } = await response.json()

// 2. Поллинг статуса (или использовать callBackUrl)
const statusResponse = await fetch(`https://api.kie.ai/api/v1/${endpoint.split('/')[0]}/task/${task_id}/fetch`, {
  method: 'GET',
  headers,
})
const { data } = await statusResponse.json()
// data.status: 'processing' | 'completed' | 'failed'
// data.output.video_url — URL готового видео
```

## Veo 3.1 (пример)
```typescript
POST https://api.kie.ai/api/v1/veo/generate
{
  "prompt": "A dog playing in a park",
  "model": "veo3_fast",        // или veo3_quality
  "aspect_ratio": "16:9",
  "enableTranslation": true,    // поддержка русского языка
  "callBackUrl": "https://blackmount.app/api/webhooks/kie"
}
// Ответ: { data: { task_id: "xxx" } }
```

## Kling (пример)
```typescript
POST https://api.kie.ai/api/v1/kling/generate
{
  "prompt": "Городской пейзаж с движением",
  "model": "kling2.6",
  "duration": "5",              // 5 или 10 секунд
  "aspect_ratio": "16:9"
}
```

## Webhook (callBackUrl)
```typescript
// POST на ваш callBackUrl когда видео готово:
{
  "task_id": "xxx",
  "status": "completed",
  "output": {
    "video_url": "https://...",
    "duration": 8,
    "resolution": "1080p"
  }
}
```

## Ценообразование
| Модель | Длит. | Цена (айкоины) |
|--------|-------|----------------|
| Kling 3.0 Pro | 5с / 10с | 85 / 170 |
| Kling 3.0 | 5с / 10с | 55 / 110 |
| Kling 2.6 Pro (без звука) | 5с / 10с | 45 / 85 |
| Kling 2.6 Pro (со звуком) | 5с / 10с | 85 / 170 |
| Kling 2.6 (без звука) | 5с / 10с | 45 / 85 |
| Kling 2.6 (со звуком) | 5с / 10с | 85 / 170 |
| Kling 2.5 Turbo | 5с / 10с | 35 / 65 |
| Veo 3.1 Quality | 8с | 220 |
| Veo 3.1 Fast | 8с | 50 |

## Ошибки
| Код | Значение | Действие |
|-----|---------|----------|
| 401 | Неверный API ключ | Проверить KIE_API_KEY |
| 400 | Невалидный запрос | Проверить параметры |
| 429 | Rate limit | Retry через 5 сек |
| 500 | Ошибка генерации | Retry 1×, показать ошибку |

## .env
```
KIE_API_KEY=...
```

# Интеграция: OpenRouter (ТОЛЬКО текстовые модели)

## Описание
OpenRouter — единый API для текстовых AI-моделей. Один ключ, один эндпойнт.
⚠️ Изображения → fal.ai. Видео → kie.ai. OpenRouter ТОЛЬКО для текста.

## URL
```
POST https://openrouter.ai/api/v1/chat/completions
```

## Заголовки
```typescript
headers: {
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://blackmount.app',
  'X-Title': 'Blackmount AI Aggregator'
}
```

## Маппинг моделей
```typescript
const TEXT_MODEL_MAP: Record<string, string> = {
  'chatgpt-5.2': 'openai/gpt-5.2',
  'chatgpt-5': 'openai/gpt-5',
  'chatgpt-5-mini': 'openai/gpt-5-mini',
  'claude-opus-4.5': 'anthropic/claude-opus-4.5',
  'claude-sonnet-4.5': 'anthropic/claude-sonnet-4.5',
  'claude-sonnet-3.7': 'anthropic/claude-3.7-sonnet',
  'claude-haiku-4.5': 'anthropic/claude-haiku-4.5',
  'gemini-3-pro': 'google/gemini-3-pro',
  'gemini-2.5-pro': 'google/gemini-2.5-pro',
  'gemini-3-flash': 'google/gemini-3-flash',
  'gemini-2.5-flash': 'google/gemini-2.5-flash',
}
```

## Streaming (SSE)
```typescript
const response = await fetch(URL, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    model: TEXT_MODEL_MAP[versionId],
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  }),
})
// Читаем чанки: data: {"choices":[{"delta":{"content":"..."}}]}
```

## Ошибки
| Код | Значение | Действие |
|-----|---------|----------|
| 401 | Неверный API ключ | Проверить .env |
| 402 | Нет средств | Пополнить OpenRouter |
| 429 | Rate limit | Retry через 1 сек |
| 503 | Модель недоступна | Retry 1×, ErrorScreen |

## .env
```
OPENROUTER_API_KEY=sk-or-...
```

# Модуль: Chat (Чат с AI)

## User Stories
- Выбираю модель на главной → открывается /chat/[modelId]
- Переключаю версию в dropdown (заблокированные — с замком)
- Отправляю текст → streaming ответ
- Вижу изображения/видео inline
- Копирую, лайкаю, перегенерирую ответ
- Баланс=0 → PaymentOverlay

## Таблицы
```sql
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  model_id text NOT NULL,
  version_id text NOT NULL,
  title text DEFAULT 'Новый чат',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  media_type text CHECK (media_type IN ('image','video')),
  media_url text,
  cost_coins integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
-- RLS: через session → user_id
```

## API
| Метод | Путь | Тело | Ответ | Ошибки |
|-------|------|------|-------|--------|
| POST | /api/chat | `{modelId, versionId, messages[]}` | SSE stream | 402, 429 |
| POST | /api/chat/stop | `{sessionId}` | `{success}` | — |
| GET | /api/chat/history | `?limit=20&offset=0` | `{sessions[]}` | 401 |

## Пайплайн
```
User → /api/chat → [баланс >= cost?] → [лимит не исчерпан?] → [подписка позволяет версию?]
  → Текст:        OpenRouter API (streaming) → UI
  → Изображения:  fal.ai API (async/sync) → UI  
  → Видео:        kie.ai API (async + polling/webhook) → UI
  → [списание айкоинов] → [запись операции] → [инкремент счётчика]
```

## Роутинг по категории модели
```typescript
function getApiProvider(modelId: string): 'openrouter' | 'fal' | 'kie' {
  const model = getModelById(modelId)
  if (model.category === 'text') return 'openrouter'
  if (model.category === 'image') return 'fal'
  if (model.category === 'video') return 'kie'
}
```

## Ценообразование (айкоины за запрос)

### Текстовые модели
| Модель | Версия | Цена (₽) | Подписка |
|--------|--------|-----------|----------|
| ChatGPT | 5.4 | 6 | ✅ |
| ChatGPT | 5.3 | 5 | ✅ |
| ChatGPT | 5.2 | 5 | — |
| ChatGPT | 5 | 3 | — |
| ChatGPT | 5 mini | 1 | — (бесплатно для Pro/Max) |
| Claude | Opus 4.6 | 8 | ✅ |
| Claude | Sonnet 4.6 | 5 | — |
| Claude | Opus 4.5 | 8 | ✅ |
| Claude | Sonnet 4.5 | 5 | — |
| Claude | Sonnet 3.7 | 5 | — |
| Claude | Haiku 4.5 | 1.5 | — |
| Gemini | 3.1 Pro | 5 | ✅ |
| Gemini | 3 Pro | 5 | — |
| Gemini | 2.5 Pro | 3 | — |
| Gemini | 3 Flash | 1 | — (бесплатно для Pro/Max) |
| Gemini | 2.5 Flash | 1 | — (бесплатно для Pro/Max) |

### Модели изображений
| Модель | Версия | Цена (₽) | Подписка |
|--------|--------|-----------|----------|
| NanoBanana | 2 (1K/2K/4K) | 13 / 19 / 26 | ✅ |
| NanoBanana | Pro (1K/2K/4K) | 22 / 22 / 43 | ✅ |
| NanoBanana | (базовая) | 7 | — |
| Flux | 2 Pro | 5 | ✅ |
| Flux | 1.1 Pro Ultra | 15 | ✅ |
| Flux | 1 Pro | 7 | — |
| Flux | 1 Dev | 4 | — |

### Модели видео
| Модель | Версия | Длит. | Цена (₽) | Звук | Подписка |
|--------|--------|-------|-----------|------|----------|
| Kling | 3.0 Pro | 5с / 10с | 85 / 170 | всегда вкл | ✅ |
| Kling | 3.0 | 5с / 10с | 55 / 110 | всегда вкл | ✅ |
| Kling | 2.6 Pro | 5с / 10с | 45–170 | toggle | ✅ |
| Kling | 2.6 | 5с / 10с | 45–170 | toggle | — |
| Kling | 2.5 Turbo | 5с / 10с | 35 / 65 | нет | — |
| Veo 3.1 | Quality | 8с | 220 | — | ✅ |
| Veo 3.1 | Fast | 8с | 50 | — | ✅ |

## UI компоненты (src/components/features/chat/)
chat-container, chat-header, chat-empty-state, message-list, message-bubble, chat-input, chat-input-actions, chat-attach-menu, model-selector, message-actions, typing-indicator, media-preview

### Рендеринг ответов моделей
- ✅ Markdown-рендеринг ответов assistant (react-markdown + remark-gfm + rehype-highlight)
- ✅ Подсветка синтаксиса кода с кастомной тёмной темой
- ✅ Блоки кода с хедером (язык + кнопка "Копировать")
- ✅ Поддержка: заголовки, списки, таблицы, цитаты, inline-код, ссылки
- ✅ Streaming markdown в typewriter (рендерится по мере набора)
- ✅ Кнопка "Скачать" — экспорт ответа как .md файл
- ✅ Markdown в арене (voting view, winner card, winner grid)
- Сообщения пользователя (user) остаются plain text

## Edge Cases
- Баланс=0 → PaymentOverlay
- Лимит запросов → «Лимит исчерпан»
- OpenRouter 503 → retry 1×, потом ErrorScreen
- Смена модели во время генерации → abort

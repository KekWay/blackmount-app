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
| Модель | Цена |
|--------|------|
| ChatGPT 5.2 | 5 |
| ChatGPT 5 | 3 |
| ChatGPT 5 mini | 1 |
| Claude Opus 4.5 | 8 |
| Claude Sonnet 4.5/3.7 | 5 |
| Claude Haiku 4.5 | 1.5 |
| Gemini 3 Pro | 5 |
| Gemini 2.5 Pro | 3 |
| Gemini Flash | 1 |
| NanoBanana | 7 / Pro 22 |
| Flux | 7 / Ultra 15 |
| Sora 2 | 25 / Pro 115 |
| Kling 2.5 | 35 / 2.6 со звуком 170 |
| Veo 3.1 Fast | 50 / Quality 185 |

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

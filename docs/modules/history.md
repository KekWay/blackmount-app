# Модуль: History (История генераций)

---

## Описание
Раздел истории сохраняет все диалоги и генерации пользователя. Три вкладки: Текст, Изображения, Видео. На UI указано что данные хранятся 7 дней.

**Текущее хранение:** Zustand persist (localStorage).
**TODO:** Миграция на Supabase + автоудаление через pg_cron / Edge Function.

## Статус реализации
- ✅ Три вкладки с переключением (AnimatedToggle)
- ✅ Фильтрация по модели (dropdown)
- ✅ Удаление записей (с модалкой подтверждения)
- ✅ Просмотр медиа в lightbox (HistoryViewer)
- ✅ Шаринг генераций (HistoryShareModal)
- ✅ Индикаторы генерации в сетке (PendingCard)
- ✅ Пустые состояния с CTA-кнопками
- ✅ URL-параметр `?tab=text|images|video`
- ✅ Переход в чат из истории текста (`/chat/[modelId]?session=[id]`)
- ❌ Фильтрация по дате (не реализована)
- ❌ Скачивание медиа из истории (кнопка есть в viewer, но файлы заглушечные)
- ❌ Серверное хранение (Supabase)
- ❌ Автоудаление через 7 дней
- ❌ API эндпоинты

## User Stories
- Вижу все свои диалоги с текстовыми моделями во вкладке «Текст»
- Вижу все сгенерированные изображения во вкладке «Изображения»
- Вижу все сгенерированные видео во вкладке «Видео»
- Нажимаю на диалог → открывается чат с загруженным диалогом, могу продолжить
- Нажимаю на изображение/видео → открывается просмотрщик (HistoryViewer) с деталями, промптом, кнопками «Повторить», «Скачать», «Поделиться», «Удалить»
- Могу удалить любой чат/генерацию (модалка подтверждения)
- Если генерация ещё идёт — показывается анимированная карточка загрузки (PendingCard)
- Могу фильтровать по конкретной модели (dropdown с иконками моделей)
- Кнопки в пустом состоянии ведут на главную с фильтром (`/?filter=text|image|video`)

## Текущее хранение данных

### Текстовые сессии
Store: `src/stores/chat-sessions.ts` (Zustand persist, ключ `chat-sessions`)
```typescript
interface ChatSession {
  id: string
  modelId: string
  title: string          // первые 50 символов первого сообщения
  messages: Message[]
  createdAt: string
  updatedAt: string
}
```

### Медиа-генерации
Store: `src/stores/balance.ts` → `genHistory[]` (Zustand persist, ключ `balance`)
```typescript
interface GenHistoryItem {
  id: string
  modelId: string
  title: string
  preview: string
  time: string        // "16:30"
  dateStr: string     // "2026-02-23"
  type: 'text' | 'image' | 'video'
}
```

### Pending генерации
Store: `src/stores/generation.ts` → `pendingGenerations[]`
```typescript
interface PendingGeneration {
  id: string
  modelId: string
  type: 'image' | 'video' | 'text'
  status: 'pending' | 'completed'
  startedAt: number
  prompt: string
  sessionId?: string
}
```

## TODO: Таблицы Supabase

```sql
-- Текстовые чаты
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  title text DEFAULT 'Новый чат',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  media_type text CHECK (media_type IN ('image', 'video')),
  media_url text,
  cost_coins integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Генерации медиа
CREATE TABLE gen_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'image', 'video')),
  title text NOT NULL,
  preview text DEFAULT '',
  media_url text,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions" ON chat_sessions FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages" ON messages FOR SELECT
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

ALTER TABLE gen_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own history" ON gen_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users delete own history" ON gen_history FOR DELETE USING (auth.uid() = user_id);
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/history/text | Список текстовых сессий (сортировка по updated_at DESC) |
| GET | /api/history/media?type=image\|video | Список медиа-генераций |
| GET | /api/history/session/[id] | Все сообщения конкретной сессии |
| DELETE | /api/history/session/[id] | Удалить сессию и все сообщения |
| DELETE | /api/history/media/[id] | Удалить медиа-генерацию |

## TODO: Автоудаление (7 дней)
```sql
-- Cron job (pg_cron или Supabase Edge Function), запуск ежедневно 03:00 UTC
DELETE FROM messages WHERE created_at < now() - interval '7 days';
DELETE FROM chat_sessions WHERE id NOT IN (SELECT DISTINCT session_id FROM messages);
DELETE FROM gen_history WHERE created_at < now() - interval '7 days';
-- + удаление файлов из Supabase Storage через API
```

## Пустые состояния
| Вкладка | Иконка | Текст | Кнопка |
|---------|--------|-------|--------|
| Текст | history-dialog.png | «Начните диалог с текстовой моделью — история появится здесь» | «Начать диалог» → /?filter=text |
| Изображения | history-image.png | «Сгенерируйте изображение — результат сохранится здесь» | «Сгенерировать» → /?filter=image |
| Видео | history-video.png | «Создайте видео с помощью нейросети — оно появится здесь» | «Создать видео» → /?filter=video |

При активном фильтре по модели и пустом результате — отдельное пустое состояние: иконка search-empty.png, текст «По вашему запросу ничего не найдено», кнопка «Сбросить фильтр».

## UI компоненты
| Файл | Описание |
|------|----------|
| `src/app/(main)/history/page.tsx` | Страница с табами, фильтрацией, логикой удаления |
| `src/components/features/history/history-text-list.tsx` | Список текстовых чатов с иконками моделей, временем, превью |
| `src/components/features/history/history-media-grid.tsx` | Сетка фото/видео + PendingCard для генераций в процессе |
| `src/components/features/history/history-viewer.tsx` | Lightbox-просмотрщик медиа с деталями, промптом, кнопками |
| `src/components/features/history/history-filter.tsx` | Dropdown фильтр по модели с чекбоксами и бейджами |
| `src/components/features/history/history-share-modal.tsx` | Модалка шаринга (Копировать / Telegram / VK / Reddit) |
| `src/components/features/history/history-delete-modal.tsx` | Модалка подтверждения удаления |

## Фильтрация (реализовано)
- По типу: Текст / Изображения / Видео (AnimatedToggle табы)
- По модели: dropdown с иконками моделей, множественный выбор, бейджи выбранных

## TODO: Фильтрация (не реализовано)
- По дате: сегодня / вчера / неделя / все

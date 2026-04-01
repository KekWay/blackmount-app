# Модуль: Sharing (Шаринг результатов)

---

## Описание
Пользователь может поделиться результатом генерации по публичной ссылке. Получатель видит генерацию без регистрации. Шаринг доступен из чата, арены и каталога промптов.

**Текущая реализация:** Публичная страница `/share/[id]` работает с демо-данными (Zustand). Шаринг в соцсети (Telegram, VK, Reddit) реализован в промптах и арене.
**TODO:** Supabase хранение, реальные публичные ссылки, OG-теги.

## Статус реализации
- ✅ Кнопка «Поделиться» в чате (на ответе модели)
- ✅ Кнопка «Поделиться битвой» в арене
- ✅ Кнопка «Поделиться» в детальном просмотре промпта (PromptDetailModal)
- ✅ Share modal с вариантами: Telegram, VK, Reddit, копирование ссылки
- ✅ Публичная страница `/share/[id]` (базовая вёрстка)
- ✅ Логотип Blackmount на публичной странице
- ✅ Кнопка «Попробовать в Blackmount» → главная
- ❌ Реальное создание публичных ссылок (сейчас демо)
- ❌ OG-теги (og:title, og:description, og:image)
- ❌ Серверное хранение (Supabase)
- ❌ Деактивация (отзыв) ссылки
- ❌ Счётчик просмотров

## Текущие точки шаринга

| Место | Что шарится | Компонент |
|-------|-------------|-----------|
| Чат | Ответ модели (текст/фото/видео) | share button на сообщении |
| Арена | Битва двух моделей | share button в арене |
| Промпты | Отдельный промпт с изображением | `share-modal.tsx` в PromptDetailModal |

## Share Modal

Варианты шаринга:
- **Telegram** — `https://t.me/share/url?url=...`
- **VK** — `https://vk.com/share.php?url=...`
- **Reddit** — `https://reddit.com/submit?url=...`
- **Копировать ссылку** — clipboard API

## Публичная страница (/share/[id])

Текущая вёрстка:
- Логотип Blackmount сверху
- Промпт пользователя
- Ответ модели (текст / изображение / видео)
- Название и иконка модели
- Дата генерации
- Кнопка «Попробовать в Blackmount» → главная

## Приватность
- По умолчанию все генерации приватные
- Шаринг только по явному действию пользователя
- noindex, nofollow (не индексируется поисковиками)

## TODO: Таблица Supabase

```sql
CREATE TABLE shared_items (
  id text PRIMARY KEY,                    -- короткий хеш (8 символов)
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('text', 'image', 'video', 'arena')),
  model_id text NOT NULL,
  model_name text NOT NULL,
  prompt text NOT NULL,
  response text NOT NULL,
  media_url text,
  -- Для арены:
  model_b_id text,
  model_b_name text,
  response_b text,
  winner text CHECK (winner IN ('a', 'b', 'tie')),
  --
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shared_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON shared_items
  FOR SELECT USING (is_active = true);
CREATE POLICY "Users manage own" ON shared_items
  FOR ALL USING (auth.uid() = user_id);
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/share | Создать ссылку → `{ id, url }` |
| GET | /api/share/[id] | Данные для публичной страницы |
| DELETE | /api/share/[id] | Деактивировать ссылку |

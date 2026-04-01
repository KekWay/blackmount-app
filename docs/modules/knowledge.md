# Модуль: Knowledge (База знаний)

---

## Описание
Документация о каждой нейросети на платформе. Трёхколоночный layout на десктопе: список моделей слева, контент по центру, оглавление справа. На мобильных — однокалоночный с overlay-панелями. Контент создаётся и обновляется только администратором.

**Текущие данные:** Захардкожены в файлах `section-content-*.ts` и `knowledge-instructions-data.ts` — уникальный контент для каждой модели (внедрён из KNOWLEDGE-BASE-CONTENT.md).
**TODO:** Миграция в Supabase.

## Статус реализации
- ✅ Трёхколоночный layout (desktop)
- ✅ Список моделей в левой панели (с иконками и категориями)
- ✅ Отображение контента статьи по центру
- ✅ Оглавление в правой панели (навигация по секциям)
- ✅ Мобильный layout: overlay для списка моделей и оглавления
- ✅ Переключение между моделями
- ✅ Кнопка «Перейти в чат» из статьи
- ✅ Навигация по URL: `/knowledge/[modelId]`
- ✅ Подсветка текущей модели в списке
- ✅ Подсветка текущей секции в оглавлении (scroll spy)
- ❌ Серверное хранение (Supabase)
- ❌ API эндпоинты
- ❌ Поиск по базе знаний

## Модели (7 штук, без Sora 2)

| # | Модель | Категория | Разработчик | Версии |
|---|--------|-----------|-------------|--------|
| 1 | ChatGPT | Текст | OpenAI | 5.2, 5, 5 mini |
| 2 | Claude | Текст | Anthropic | Opus 4.5, Sonnet 4.5, Sonnet 3.7, Haiku 4.5 |
| 3 | Gemini | Текст | Google | 3 Pro, 2.5 Pro, 3 Flash, 2.5 Flash |
| 4 | NanoBanana | Изображение | Google (Imagen) | 2.0, Pro |
| 5 | Flux | Изображение | Black Forest Labs | 1 Pro, 1.1 Pro Ultra |
| 6 | Kling | Видео | Kuaishou | 2.5 Turbo, 2.6 |
| 7 | Veo 3.1 | Видео | Google DeepMind | Fast, Quality |

## Структура контента (для каждой модели)

Каждая статья содержит:

1. **Общее описание** — название, логотип, категория, краткое описание, разработчик
2. **Возможности** — что умеет, сильные стороны, ограничения
3. **Версии** — таблица версий: название, цена (айкоины), требуется ли подписка
4. **Как пользоваться** — пошаговая инструкция, 3-5 примеров промптов, советы
5. **Технические характеристики** — скорость, контекст (текст), разрешение (изображения), длительность/разрешение (видео)

## Текущее хранение данных

Контент разбит по файлам:

| Файл | Описание |
|------|----------|
| `knowledge-instructions-data.ts` | Инструкции и примеры промптов |
| `section-content-text.ts` | Контент для текстовых моделей (ChatGPT, Claude, Gemini) |
| `section-content-image.ts` | Контент для моделей изображений (NanoBanana, Flux) |
| `section-content-video.ts` | Контент для видео-моделей (Kling, Veo 3.1) |

## Layout

```
Desktop (3 колонки):
┌─────────────┬────────────────────────┬──────────────┐
│ Список      │ Контент статьи         │ Оглавление   │
│ моделей     │ (секции с текстом,     │ + быстрые    │
│ (left panel)│  таблицами, примерами) │ ссылки       │
│             │                        │ (right panel)│
└─────────────┴────────────────────────┴──────────────┘

Mobile (1 колонка):
- Кнопка слева — overlay со списком моделей
- Кнопка справа — overlay с оглавлением
- Контент на всю ширину
```

## TODO: Таблица Supabase

```sql
CREATE TABLE knowledge_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id text NOT NULL UNIQUE,
  title text NOT NULL,
  content_md text NOT NULL,
  examples jsonb DEFAULT '[]',
  specs jsonb DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON knowledge_articles
  FOR SELECT USING (is_published = true);
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/knowledge | Список всех статей (краткое) |
| GET | /api/knowledge/[modelId] | Полная статья для модели |

## UI компоненты
| Файл | Описание |
|------|----------|
| `src/app/(main)/knowledge/page.tsx` | Обёртка страницы |
| `src/components/features/knowledge/knowledge-page.tsx` | Основная страница: 3 колонки |
| `src/components/features/knowledge/knowledge-sidebar.tsx` | Левая панель: список моделей |
| `src/components/features/knowledge/knowledge-content.tsx` | Центр: контент статьи |
| `src/components/features/knowledge/knowledge-nav.tsx` | Правая панель: оглавление |
| `src/components/features/knowledge/section-content-text.ts` | Данные: текстовые модели |
| `src/components/features/knowledge/section-content-image.ts` | Данные: модели изображений |
| `src/components/features/knowledge/section-content-video.ts` | Данные: видео-модели |
| `src/components/features/knowledge/knowledge-instructions-data.ts` | Данные: инструкции/промпты |

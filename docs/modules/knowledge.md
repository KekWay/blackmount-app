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

## Модели (7 нейросетей, 32 версии)

| # | Модель | Категория | Разработчик | Версии |
|---|--------|-----------|-------------|--------|
| 1 | ChatGPT | Текст | OpenAI | 5.4, 5.3, 5.2, 5, 5 mini |
| 2 | Claude | Текст | Anthropic | Opus 4.6, Sonnet 4.6, Opus 4.5, Sonnet 4.5, Sonnet 3.7, Haiku 4.5 |
| 3 | Gemini | Текст | Google | 3.1 Pro, 3 Pro, 2.5 Pro, 3 Flash, 2.5 Flash |
| 4 | NanoBanana | Изображение | Google (Imagen) | 2, Pro, (базовая) |
| 5 | Flux | Изображение | Black Forest Labs | 2 Pro, 1.1 Pro Ultra, 1.1 Pro, 1 Dev |
| 6 | Kling | Видео | Kuaishou | 3.0 Pro, 3.0, 2.6 Pro, 2.6, 2.5 Turbo |
| 7 | Veo 3.1 | Видео | Google DeepMind | Quality, Fast |

## Структура контента (для каждой модели)

Каждая статья содержит 6 секций:

1. **О модели** (about) — название, логотип, категория, разработчик, описание
2. **Версии** (versions) — таблица версий: название, цена, подписка
3. **Сценарии использования** (usecases) — для чего подходит
4. **Промпты** (prompts) — 3-5 примеров промптов
5. **Советы** (tips) — лайфхаки и рекомендации
6. **Настройки** (settings) — технические параметры (контекст, разрешение, длительность)

## Текущее хранение данных

Контент разбит по файлам:

| Файл | Описание |
|------|----------|
| `knowledge-instructions-data.ts` | Инструкции и примеры промптов |
| `section-content-about.ts` | Секция «О модели» (описания для всех 7 моделей) |
| `section-content-versions.ts` | Секция «Версии» (таблицы версий и цен) |
| `section-content-usecases.ts` | Секция «Сценарии использования» |
| `section-content-prompts.ts` | Секция «Промпты» (примеры) |
| `section-content-tips.ts` | Секция «Советы» |
| `section-content-settings.ts` | Секция «Настройки» (тех. параметры) |

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
| `src/components/features/knowledge/knowledge-data.ts` | Список моделей и навигация |
| `src/components/features/knowledge/knowledge-sidebar.tsx` | Левая панель: список моделей |
| `src/components/features/knowledge/knowledge-content.tsx` | Центр: контент статьи |
| `src/components/features/knowledge/knowledge-hero.tsx` | Шапка статьи (название, описание) |
| `src/components/features/knowledge/knowledge-section.tsx` | Компонент секции |
| `src/components/features/knowledge/knowledge-sections-data.tsx` | Маппинг секций на данные |
| `src/components/features/knowledge/knowledge-toc.tsx` | Правая панель: оглавление |
| `src/components/features/knowledge/knowledge-instructions.tsx` | Блок инструкций |
| `src/components/features/knowledge/knowledge-cta.tsx` | Кнопка «Перейти в чат» |
| `src/components/features/knowledge/knowledge-icons.tsx` | Иконки моделей |
| `src/components/features/knowledge/knowledge-types.ts` | TypeScript типы |
| `src/components/features/knowledge/section-content-about.ts` | Данные: о модели |
| `src/components/features/knowledge/section-content-versions.ts` | Данные: версии |
| `src/components/features/knowledge/section-content-usecases.ts` | Данные: сценарии |
| `src/components/features/knowledge/section-content-prompts.ts` | Данные: промпты |
| `src/components/features/knowledge/section-content-tips.ts` | Данные: советы |
| `src/components/features/knowledge/section-content-settings.ts` | Данные: настройки |
| `src/components/features/knowledge/knowledge-instructions-data.ts` | Данные: инструкции |

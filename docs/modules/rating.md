# Модуль: Rating (Рейтинг моделей)

---

## Описание
Рейтинг AI-моделей с лидербордом, spotlight-карточками лучших в категориях, системой лайков/дизлайков, сравнением моделей и подробными характеристиками с radar-чартом.

**Текущие данные:** Захардкожены в `src/data/leaderboard.ts`. Лайки/дизлайки — localStorage.
**TODO:** Миграция на Supabase (таблицы model_ratings, model_votes), подсчёт usage % из реальных запросов.

## Статус реализации
- ✅ Лидерборд с 20 моделями (текст + фото + видео)
- ✅ Spotlight-карточки «Лучшие в категориях» (7 штук, горизонтальный скролл)
- ✅ Раскрываемые карточки моделей с подробными оценками + radar chart
- ✅ Сравнение до 4 моделей (оверлей с таблицей метрик)
- ✅ Фильтрация: по категории (Все/Текст/Изображения/Видео)
- ✅ Поиск по названию модели
- ✅ Сортировка: 5 вариантов (популярность, оценка, скорость, точность, цена)
- ✅ Фильтр «Доступные» (по текущему балансу пользователя)
- ✅ Лайки/дизлайки на каждую модель (localStorage, UserRating)
- ✅ Кнопка «Попробовать» → переход в чат
- ✅ Подписочный гейт (locked модели → SubscriptionGateModal)
- ✅ Lazy load (кнопка «Загрузить ещё»)
- ✅ ТОП-3 выделены медалями (золото/серебро/бронза) с цветной полоской слева
- ❌ Фильтрация по периоду (неделя/месяц/всё время)
- ❌ Серверное хранение рейтингов
- ❌ Автоматический подсчёт usage % из реальных запросов
- ❌ API эндпоинты

## Модели в рейтинге (21 штука)

### Текстовые (11):
ChatGPT 5.2, ChatGPT 5, ChatGPT 5 mini, Claude Opus 4.5, Claude Sonnet 4.5, Claude Sonnet 3.7, Claude Haiku 4.5, Gemini 3 Pro, Gemini 2.5 Pro, Gemini 3 Flash, Gemini 2.5 Flash

### Изображения (4):
Flux 1.1 Pro Ultra, Flux 1 Pro, NanoBanana Pro, NanoBanana

### Видео (6):
Kling 3.0 Pro, Kling 3.0, Veo 3.1 Quality, Veo 3.1 Fast, Kling 2.6, Kling 2.5 Turbo

> Примечание: после добавления новых моделей в `leaderboard.ts`, в рейтинг также войдут: ChatGPT 5.4, 5.3, Claude Opus/Sonnet 4.6, Gemini 3.1 Pro, NanoBanana 2, Flux 2 Pro, Flux 1 Dev, Kling 2.6 Pro.

## Метрики моделей

### Текстовые модели (6 метрик):
| Метрика | Поле | Описание |
|---------|------|----------|
| Скорость | speed | Скорость ответа |
| Точность | accuracy | Точность и корректность |
| Выгода | costEfficiency | Цена/качество |
| Креативность | creativity | Креативные задачи |
| Логика | reasoning | Рассуждения, цепочки |
| Аналитика | analytics | Анализ данных |

### Модели изображений (5 метрик):
| Метрика | Поле | Описание |
|---------|------|----------|
| Качество | creativity | Общее качество генерации |
| Детализация | accuracy | Проработанность деталей |
| Скорость генерации | speed | Скорость |
| Цена/Качество | costEfficiency | Соотношение |
| Фотореализм | score | Реалистичность |

### Модели видео (5 метрик):
| Метрика | Поле | Описание |
|---------|------|----------|
| Кинематографичность | creativity | Кинематографический стиль |
| Стабильность кадра | accuracy | Стабильность движения |
| Скорость генерации | speed | Скорость |
| Цена/Качество | costEfficiency | Соотношение |
| Качество видео | score | Общее качество |

## Spotlight-карточки (лучшие в категориях)

7 карточек в горизонтальном скролле:
| Название | Модель | Метрика | Значение |
|----------|--------|---------|----------|
| Лучший для кода | Claude Sonnet 4.5 | Точность | 96% |
| Креативность | Flux 1.1 Pro Ultra | Арт | 97 |
| Доступность | ChatGPT 5 mini | Цена | 1 ₿ |
| Быстрый ответ | Gemini 2.5 Flash | Скорость | 98 |
| Лучшее видео | Kling 3.0 Pro | Качество | 92 |
| Рассуждения | Claude Opus 4.5 | Логика | 99 |
| Аналитика | Claude Opus 4.5 | Аналитика | 99 |

## Функции страницы

### FilterBar (sticky)
- Категории: Все модели / Текст / Изображения / Видео (с счётчиком)
- Поиск по названию (input)
- Фильтр «Доступные» (по балансу, с иконкой монеты)
- Кнопка «Сравнить» (активна при ≥2 выбранных, до 4)
- Сортировка: Популярность / Оценка / Скорость / Точность / Цена (с индикатором ↑↓)

### Карточка модели (compact)
- Позиция (#1, #2... или медаль для ТОП-3)
- Иконка модели + название + тренд (↑3.6% / ↓0.6%)
- Категория: «Текст & Код» / «Генерация фото» / «Генерация видео»
- % аудитории (usage_percent)
- ScoreRing (кольцо с оценкой 0-100, цвет зависит от значения)
- Цена за запрос (в айкоинах)
- Кнопка сравнения (весы)
- Кнопка раскрытия (chevron)

### Карточка модели (expanded)
При клике раскрывается блок с тремя колонками:
1. **Описание** — текст о модели + UserRating (лайки/дизлайки) + статистика (аудитория, оценки) + кнопка «Попробовать»
2. **Подробные оценки** — прогресс-бары по всем метрикам (зависят от типа модели)
3. **Radar chart** — SVG паутинная диаграмма (CustomRadar)

### Сравнение моделей (CompareOverlay)
- Оверлей с таблицей: модели по колонкам, метрики по строкам
- Максимальные значения выделены жирным
- Прогресс-бары для каждого значения
- Стоимость внизу (в айкоинах)

### Лайки/Дизлайки (UserRating)
- Кнопки 👍 👎 на каждой развёрнутой карточке
- Один голос на модель (можно изменить, можно снять)
- Хранение: localStorage (`userVote_[modelId]`, `modelLikes_[modelId]`, `modelDislikes_[modelId]`)
- Базовое значение: votes из leaderboard data, split 82% likes / 18% dislikes
- Счётчики видны всем

### Locked модели
Модели привязанные к подписке (RATING_LOCKED_MAP) — из текущих 21 модели рейтинга:
- claude-opus-4.5, flux-1.1-pro-ultra, nanobanana-pro, kling-3.0-pro, kling-3.0, veo-3.1-quality, veo-3.1-fast
- При клике «Попробовать» → SubscriptionGateModal

> Примечание: при добавлении новых моделей в рейтинг, в RATING_LOCKED_MAP также нужно добавить: gpt-5.4, gpt-5.3, claude-opus-4.6, gemini-3.1-pro, nanobanana-2, flux-2-pro, kling-2.6-pro.

## Текущее хранение данных

### Leaderboard
Файл: `src/data/leaderboard.ts`
```typescript
interface LeaderboardModel {
  id: string
  name: string
  category: 'text' | 'image' | 'video'
  score: number           // 0-100, общая оценка
  speed: number           // 0-100
  accuracy: number        // 0-100
  costEfficiency: number  // 0-100
  creativity: number      // 0-100
  reasoning: number       // 0-100 (только для текста)
  analytics: number       // 0-100 (только для текста)
  price: number           // айкоины за запрос
  votes: number           // общее кол-во голосов
  trend: number           // % роста/падения
  description: string     // описание модели
  useCases: string[]      // примеры использования
  gradient: string        // CSS gradient
  aiModelRef: string | null  // ссылка на id из ai-models.ts
  usagePercent: number    // % пользователей
}
```

## TODO: Таблицы Supabase

```sql
CREATE TABLE model_ratings (
  model_id text PRIMARY KEY,
  usage_count integer DEFAULT 0,
  usage_percent numeric(5,1) DEFAULT 0,
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  score_speed integer DEFAULT 0,
  score_accuracy integer DEFAULT 0,
  score_creativity integer DEFAULT 0,
  score_cost_efficiency integer DEFAULT 0,
  score_reasoning integer DEFAULT 0,
  score_analytics integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE model_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON model_ratings FOR SELECT USING (true);

CREATE TABLE model_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  vote text NOT NULL CHECK (vote IN ('like', 'dislike')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, model_id)
);

ALTER TABLE model_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own votes" ON model_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own votes" ON model_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own votes" ON model_votes FOR UPDATE USING (auth.uid() = user_id);
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/rating | Лидерборд всех моделей |
| GET | /api/rating/[modelId] | Подробная информация о модели |
| POST | /api/rating/vote | Лайк/дизлайк `{ modelId, vote }` |
| GET | /api/rating/compare?models=id1,id2 | Сравнение моделей |

## TODO: Автоматический подсчёт usage %
```sql
SELECT model_id, COUNT(*) as usage_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as usage_percent
FROM (
  SELECT model_id FROM chat_sessions WHERE created_at > now() - interval '30 days'
  UNION ALL
  SELECT model_id FROM gen_history WHERE created_at > now() - interval '30 days'
) all_usage
GROUP BY model_id
ORDER BY usage_count DESC;
```

## UI компоненты
| Файл | Описание |
|------|----------|
| `src/app/(main)/rating/page.tsx` | Обёртка |
| `src/components/features/rating/rating-page.tsx` | Основная страница с логикой фильтрации, сортировки, сравнения |
| `src/components/features/rating/spotlight-cards.tsx` | Горизонтальный скролл «Лучшие в категориях» |
| `src/components/features/rating/rating-filter-bar.tsx` | Sticky панель фильтров и сортировки |
| `src/components/features/rating/rating-model-card.tsx` | Карточка модели (compact + expanded) |
| `src/components/features/rating/model-card-expanded.tsx` | Раскрытый блок: описание, оценки, radar |
| `src/components/features/rating/compare-overlay.tsx` | Оверлей сравнения моделей |
| `src/components/features/rating/custom-radar.tsx` | SVG radar chart |
| `src/components/features/rating/score-ring.tsx` | Кольцо оценки (animated SVG) |
| `src/components/features/rating/user-rating.tsx` | Лайки/дизлайки (localStorage) |
| `src/components/features/rating/rating-model-icon.tsx` | Иконка модели (через ModelIcon или fallback) |
| `src/components/features/rating/scales-icon.tsx` | Иконка весов (mask) |

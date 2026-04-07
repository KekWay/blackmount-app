# Модуль: Subscription (Подписки)

## Тарифы
| План | Цена/мес | Айкоины | Запросы/день | Скидка | Бесплатные модели | Реф. бонус |
|------|---------|---------|-------------|--------|-------------------|------------|
| Free | 0₽ | 20 (единоразово) | 50 | — | — | 15% |
| Basic | 499₽ | 300 | 100 | 10% | — | 20% |
| Pro ⭐ | 999₽ | 550 | 150 | 15% | ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash | 25% |
| Max | 1799₽ | 1200 | 200 | 20% | ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash | 30% |

## Таблица
```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  tier text NOT NULL CHECK (tier IN ('basic','pro','max')),
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
-- RLS: SELECT WHERE auth.uid() = user_id
```

## Гейтинг (заблокированные версии без подписки)
```typescript
const LOCKED_VERSIONS = new Set([
  'chatgpt-5.2','claude-opus-4.5','gemini-3-pro',
  'nb-pro','flux-1.1-pro-ultra',
  'sora-2-pro','kling-2.6','veo-3.1-quality'
])
const LOCKED_MODELS = new Set(['veo31'])
const FREE_FOR_SUBSCRIBERS = new Set(['chatgpt-5-mini','gemini-2.5-flash'])
```

## UI
- `/subscription` — полноэкранная страница с карточками Basic/Pro/Max
- Toggle месяц/год (-15%)
- Таблица "Сравнение тарифов" (Видео/Изображения/Текст/Особенности)
- PaymentOverlay при выборе плана

# SPECIFICATION.md — Blackmount AI Aggregator

> Техническая спецификация по Spec-First. Каждый модуль — для реализации без уточнений.

---

## Модуль 1: Auth

### User Stories
- Как новый пользователь, я регистрируюсь по email+пароль → получаю 20 айкоинов
- Как пользователь, я вхожу через Google OAuth одним кликом
- Как неавторизованный, я вижу «Войти» вместо «Профиль» в sidebar

### Данные
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text DEFAULT '',
  avatar_url text DEFAULT '',
  referral_code text UNIQUE DEFAULT gen_random_uuid()::text,
  referred_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);
-- RLS: SELECT/UPDATE WHERE auth.uid() = id
```

### API
| Метод | Путь | Тело | Ответ | Ошибки |
|-------|------|------|-------|--------|
| POST | /api/auth/signup | `{email, password, name}` | `{user, session}` | 400, 409, 422 |
| POST | /api/auth/login | `{email, password}` | `{user, session}` | 401 |
| POST | /api/auth/google | redirect | `{user, session}` | 500 |
| POST | /api/auth/logout | — | `{success}` | — |

### Edge Cases
- Двойная регистрация → «Email уже используется»
- Истёкшая сессия → редирект /auth с return URL
- Google OAuth отмена → возврат без ошибки

---

## Модуль 2: Balance

### User Stories
- При регистрации получаю 20 айкоинов
- Вижу баланс в sidebar
- При генерации списываются айкоины по тарифу
- Подписчик Pro/Max: GPT-5 mini и Gemini Flash бесплатно (cost=0)

### Данные
```sql
CREATE TABLE balances (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  coins integer NOT NULL DEFAULT 20 CHECK (coins >= 0),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  type text NOT NULL CHECK (type IN ('topup','spent','bonus','referral','subscription')),
  amount integer NOT NULL,
  label text NOT NULL,
  model_id text,
  version_id text,
  created_at timestamptz DEFAULT now()
);
-- RLS: SELECT WHERE auth.uid() = user_id
```

### API
| Метод | Путь | Тело | Ответ | Ошибки |
|-------|------|------|-------|--------|
| GET | /api/balance | — | `{coins, operations[]}` | 401 |
| POST | /api/balance/deduct | `{amount, modelId, versionId, label}` | `{coins, operation}` | 402, 401 |
| POST | /api/balance/topup | `{packageId}` | `{paymentUrl}` | 400, 401 |

### Пакеты
```typescript
const PACKAGES = [
  { id: 'start', name: 'СТАРТ', price: 149, coins: 90 },
  { id: 'basic', name: 'БАЗОВЫЙ', price: 349, coins: 220 },
  { id: 'advanced', name: 'ПРОДВИНУТЫЙ', price: 499, coins: 350, featured: true },
  { id: 'professional', name: 'ПРОФЕССИОНАЛЬНЫЙ', price: 799, coins: 650 },
  { id: 'business', name: 'БИЗНЕС', price: 1499, coins: 1200 },
] as const
```

### Логика списания
```
1. Определить cost = MODEL_PRICES[modelId][versionId]
2. Если подписчик Pro/Max и модель в FREE_FOR_SUBSCRIBERS → cost = 0
3. Проверка balance.coins >= cost → иначе PaymentOverlay
4. Supabase RPC: coins -= cost, INSERT operation
5. Запрос к OpenRouter
```

---

## Модуль 3: Chat

### User Stories
- Выбираю модель на главной → открывается чат
- Переключаю версию в dropdown (заблокированные — с замком)
- Отправляю текст → streaming ответ
- Вижу изображения/видео inline
- Копирую, лайкаю, перегенерирую ответ
- Баланс=0 → PaymentOverlay

### Данные
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

### API
| Метод | Путь | Тело | Ответ | Ошибки |
|-------|------|------|-------|--------|
| POST | /api/chat | `{modelId, versionId, messages[]}` | SSE stream | 402, 429 |
| POST | /api/chat/stop | `{sessionId}` | `{success}` | — |
| GET | /api/chat/history | `?limit=20&offset=0` | `{sessions[]}` | 401 |

### OpenRouter маппинг
```typescript
const MODEL_MAP: Record<string, string> = {
  'chatgpt-5.2': 'openai/gpt-5.2',
  'chatgpt-5': 'openai/gpt-5',
  'chatgpt-5-mini': 'openai/gpt-5-mini',
  'claude-opus-4.5': 'anthropic/claude-opus-4.5',
  'claude-sonnet-4.5': 'anthropic/claude-sonnet-4.5',
  'claude-haiku-4.5': 'anthropic/claude-haiku-4.5',
  'gemini-3-pro': 'google/gemini-3-pro',
  'gemini-2.5-pro': 'google/gemini-2.5-pro',
  'gemini-3-flash': 'google/gemini-3-flash',
  'gemini-2.5-flash': 'google/gemini-2.5-flash',
  // image + video models mapped similarly
}
```

### UI (src/components/features/chat/)
chat-container, message-list, message-bubble, chat-input, model-selector, message-actions, typing-indicator, media-preview — каждый ≤150 строк

### Edge Cases
- Баланс=0 → PaymentOverlay
- Лимит запросов → «Лимит исчерпан»
- OpenRouter 503 → retry 1×, потом ErrorScreen
- Смена модели во время генерации → abort

---

## Модуль 4: Arena

### User Stories
- Выбираю 2 модели, отправляю промпт → 2 ответа рядом
- Голосую за лучший → обновляется рейтинг (ELO)
- Могу выбрать «случайную пару»

### Данные
```sql
CREATE TABLE arena_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  prompt text NOT NULL,
  model_a text NOT NULL, response_a text NOT NULL,
  model_b text NOT NULL, response_b text NOT NULL,
  winner text NOT NULL CHECK (winner IN ('a','b','tie')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE model_ratings (
  model_id text PRIMARY KEY,
  wins integer DEFAULT 0, losses integer DEFAULT 0, ties integer DEFAULT 0,
  total_votes integer DEFAULT 0, elo_score integer DEFAULT 1200
);
```

### API
| Метод | Путь | Тело | Ответ |
|-------|------|------|-------|
| POST | /api/arena/battle | `{prompt, modelA, modelB}` | `{responseA, responseB, battleId}` |
| POST | /api/arena/vote | `{battleId, winner}` | `{updatedRatings}` |
| GET | /api/arena/leaderboard | — | `{ratings[]}` |

---

## Модуль 5: Subscription

### Данные
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

### Гейтинг
```typescript
const LOCKED_VERSIONS = new Set(['chatgpt-5.2','claude-opus-4.5','gemini-3-pro','nb-pro','flux-1.1-pro-ultra','sora-2-pro','kling-2.6','veo-3.1-quality'])
const LOCKED_MODELS = new Set(['veo31'])
const FREE_FOR_SUBSCRIBERS = new Set(['chatgpt-5-mini','gemini-2.5-flash'])
```

### Лимиты
| Тариф | Запросы/день | Реф. бонус |
|-------|-------------|------------|
| Free | 50 | 15% |
| Basic | 100 | 20% |
| Pro | 150 | 25% |
| Max | 200 | 30% |

---

## Модуль 6: Referral

### Данные
```sql
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id),
  referred_id uuid NOT NULL REFERENCES profiles(id),
  bonus_percent integer NOT NULL DEFAULT 15,
  total_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);
```

### Логика
1. Реферер делится ссылкой `blackmount.app/?ref=CODE`
2. Регистрация → profiles.referred_by = referrer.id
3. Покупка referred → referrer получает bonus_percent%
4. Бонус: Free 15%, Basic 20%, Pro 25%, Max 30%

---

## Модуль 7: Shared

| Компонент | Назначение |
|-----------|-----------|
| ErrorScreen | network/server/404/generic |
| SkeletonLoader | Home, Chat, Generic |
| MediaViewer | Полноэкранный image/video |
| PaymentOverlay | Покупка пакета |
| SubscriptionGate | «Нужна подписка» |
| ConnectionToast | Online/offline |
| CommandPalette | Cmd+K навигация |

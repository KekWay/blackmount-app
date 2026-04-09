# Модуль: Balance (Айкоины)

## User Stories
- При регистрации получаю 20 айкоинов
- Вижу баланс в sidebar (клик → пополнение)
- При генерации списываются айкоины по тарифу
- Подписчик Pro/Max: ChatGPT 5 mini, Gemini 3 Flash и Gemini 2.5 Flash бесплатно (cost=0)
- Покупаю пакет айкоинов через ЮKassa

## Таблицы
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

## API
| Метод | Путь | Тело | Ответ | Ошибки |
|-------|------|------|-------|--------|
| GET | /api/balance | — | `{coins, operations[]}` | 401 |
| POST | /api/balance/deduct | `{amount, modelId, versionId, label}` | `{coins, operation}` | 402, 401 |
| POST | /api/balance/topup | `{packageId}` | `{paymentUrl}` | 400, 401 |

## Пакеты
| ID | Название | Цена | Айкоинов |
|----|----------|------|----------|
| start | СТАРТ | 149₽ | 90 |
| basic | БАЗОВЫЙ | 349₽ | 220 |
| advanced | ПРОДВИНУТЫЙ ⭐ | 499₽ | 350 |
| professional | ПРОФЕССИОНАЛЬНЫЙ | 799₽ | 650 |
| business | БИЗНЕС | 1499₽ | 1200 |

## Логика списания
1. cost = MODEL_PRICES[modelId][versionId]
2. Если подписчик Pro/Max и модель в FREE_FOR_SUBSCRIBERS → cost = 0
3. balance.coins >= cost → иначе PaymentOverlay
4. Supabase RPC: coins -= cost, INSERT operation
5. Запрос к OpenRouter

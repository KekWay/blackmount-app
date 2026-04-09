# Агент: Supabase / Database

> Claude Code ОБЯЗАН читать при работе с таблицами, миграциями, RLS, API routes, auth.

---

## Ключевые документы (читать перед работой)

- **docs/MIGRATION_PLAN.md** — порядок 22 миграций, SQL всех таблиц и RLS-политик
- **docs/models/MODEL_REGISTRY.md** — единый реестр моделей (для маппинга model_id/version_id)
- **docs/ENV_TEMPLATE.md** — все переменные окружения
- **docs/security/SECURITY.md** — общие правила безопасности
- **docs/security/api-security.md** — rate limiting, валидация, security headers
- **docs/security/auth.md** — 4 способа авторизации (Email, Google, VK, Telegram)
- **docs/integrations/supabase.md** — клиенты, таблицы, RLS, триггер

---

## Клиенты Supabase

### ВСЕГДА используй @supabase/ssr (НЕ @supabase/supabase-js)

```typescript
// 1. Browser (клиент) — для компонентов с 'use client'
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 2. Server (API routes) — для авторизованных запросов (RLS работает)
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
// + cookies() для сессий
// Использует NEXT_PUBLIC_SUPABASE_ANON_KEY

// 3. Admin (серверный, обходит RLS) — для начисления монет, блокировки
import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
// ⛔ ТОЛЬКО в API routes, НИКОГДА на клиенте
```

---

## Правила

- КАЖДАЯ таблица ОБЯЗАНА иметь RLS
- Primary key: `uuid DEFAULT gen_random_uuid()` (или `text` для model_ratings)
- Foreign keys: с `ON DELETE CASCADE`
- Timestamps: `timestamptz DEFAULT now()`
- CHECK constraints для enum-полей: `CHECK (type IN ('topup','spent','bonus','referral','subscription'))`
- Баланс меняется ТОЛЬКО через RPC `deduct_coins` (не UPDATE напрямую)
- Подробный SQL для каждой таблицы — в docs/MIGRATION_PLAN.md

---

## Миграции

Порядок миграций КРИТИЧЕН (foreign keys). Полный план: docs/MIGRATION_PLAN.md.

```
supabase/migrations/
  001_profiles.sql        — зависит от auth.users
  002_balances.sql        — зависит от profiles
  003_operations.sql      — зависит от profiles
  004_subscriptions.sql   — зависит от profiles
  005_daily_requests.sql  — зависит от profiles
  006_chat_sessions.sql   — зависит от profiles
  007_messages.sql        — зависит от chat_sessions
  ...
```

---

## RLS паттерны

```sql
-- Пользовательские данные (profiles, balances, operations, subscriptions...)
ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own data" ON tablename
  FOR SELECT USING (auth.uid() = user_id);

-- Публичные данные (model_ratings, knowledge_articles)
CREATE POLICY "Public read" ON tablename
  FOR SELECT USING (true);
-- ⛔ Запись ТОЛЬКО через service_role (API routes с admin client)

-- Данные через join (messages → через chat_sessions.user_id)
CREATE POLICY "Users read own messages" ON messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );
```

---

## Переменные окружения

Полный список: docs/ENV_TEMPLATE.md

```
🟢 Клиентские (безопасны):
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL

🔴 Серверные (НИКОГДА в NEXT_PUBLIC_):
SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY
FAL_API_KEY
KIE_API_KEY
YUKASSA_SHOP_ID / SECRET_KEY / WEBHOOK_SECRET
```

---

## Фазы реализации (из MIGRATION_PLAN.md)

1. **Auth + Core** — profiles, balances, operations, subscriptions, daily_requests + триггер handle_new_user
2. **Chat + History** — chat_sessions, messages, gen_history
3. **Arena + Rating** — arena_votes, model_ratings, model_votes
4. **Social** — referrals, favorite_models, shared_items
5. **Content + Support** — knowledge_articles, support_tickets, support_messages, security_logs
6. **Functions + Storage** — deduct_coins, check_and_increment_limit, cleanup_old_data, storage buckets

---

## Запрещено

- ⛔ Запросы без RLS
- ⛔ `SUPABASE_SERVICE_ROLE_KEY` на клиенте или в `'use client'` файлах
- ⛔ Секреты в коде (только .env.local)
- ⛔ N+1 запросы (используй joins или RPC)
- ⛔ UPDATE balances напрямую (только через RPC deduct_coins)
- ⛔ Обработка вебхука без проверки подписи

---

## Чеклист

```
[ ] RLS включён на каждой новой таблице
[ ] Миграция следует порядку из MIGRATION_PLAN.md
[ ] FK с ON DELETE CASCADE
[ ] Индексы на часто фильтруемых полях (user_id, created_at)
[ ] Серверные ключи только в API routes
[ ] Баланс через RPC, не через прямой UPDATE
```

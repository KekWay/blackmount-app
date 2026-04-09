# MIGRATION_PLAN.md — План миграций Supabase

> Порядок создания таблиц, RLS-политик, функций и триггеров.
> Каждая миграция — отдельный файл в `supabase/migrations/`.
> Порядок КРИТИЧЕН: foreign keys требуют создания таблиц-зависимостей первыми.
> Источники: docs/modules/*.md, docs/security/*.md, docs/integrations/supabase.md

---

## Порядок миграций

| # | Файл миграции | Таблица/объект | Зависит от | Источник |
|---|--------------|----------------|------------|----------|
| 001 | profiles | profiles | auth.users | docs/modules/auth.md |
| 002 | balances | balances | profiles | docs/modules/balance.md |
| 003 | operations | operations | profiles | docs/modules/balance.md |
| 004 | subscriptions | subscriptions | profiles | docs/modules/subscription.md |
| 005 | daily_requests | daily_requests | profiles | docs/security/api-security.md |
| 006 | chat_sessions | chat_sessions | profiles | docs/modules/chat.md |
| 007 | messages | messages | chat_sessions | docs/modules/chat.md |
| 008 | gen_history | gen_history | profiles | docs/modules/history.md |
| 009 | arena_votes | arena_votes | profiles | docs/modules/arena.md |
| 010 | model_ratings | model_ratings | — (нет FK) | docs/modules/arena.md |
| 011 | model_votes | model_votes | profiles | docs/modules/rating.md |
| 012 | referrals | referrals | profiles × 2 | docs/modules/referral.md |
| 013 | favorite_models | favorite_models | profiles | docs/modules/favorites.md |
| 014 | shared_items | shared_items | profiles | docs/modules/sharing.md |
| 015 | knowledge_articles | knowledge_articles | — (нет FK) | docs/modules/knowledge.md |
| 016 | support_tickets | support_tickets | profiles | docs/modules/support.md |
| 017 | support_messages | support_messages | support_tickets | docs/modules/support.md |
| 018 | security_logs | security_logs | profiles | docs/security/api-security.md |
| 019 | functions | handle_new_user, deduct_coins, check_and_increment_limit, cleanup_old_data | все таблицы | docs/security/*.md, docs/integrations/supabase.md |
| 020 | triggers | on_auth_user_created | handle_new_user | docs/security/auth.md |
| 021 | storage_buckets | user-uploads, generations, avatars | — | docs/modules/file-storage.md |
| 022 | storage_policies | RLS на storage.objects | — | docs/modules/file-storage.md |

---

## 001: profiles

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text DEFAULT '',
  avatar_url text DEFAULT '',
  referral_code text UNIQUE DEFAULT upper(substr(gen_random_uuid()::text, 1, 8)),
  referred_by uuid REFERENCES profiles(id),
  is_blocked boolean DEFAULT false,
  block_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
-- Публичное чтение referral_code для реферальной программы
CREATE POLICY "Public read referral codes" ON profiles
  FOR SELECT USING (true);
```

> Источник: docs/modules/auth.md, docs/modules/profile.md

---

## 002: balances

```sql
CREATE TABLE balances (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  coins integer NOT NULL DEFAULT 20 CHECK (coins >= 0),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own balance" ON balances
  FOR SELECT USING (auth.uid() = user_id);
-- ⛔ НЕТ INSERT/UPDATE политик — баланс меняется ТОЛЬКО через серверный RPC (deduct_coins)
```

> Источник: docs/modules/balance.md, docs/security/SECURITY.md

---

## 003: operations

```sql
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

ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own operations" ON operations
  FOR SELECT USING (auth.uid() = user_id);
```

> Источник: docs/modules/balance.md

---

## 004: subscriptions

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

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

> Источник: docs/modules/subscription.md

---

## 005: daily_requests

```sql
CREATE TABLE daily_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  count integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

ALTER TABLE daily_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own limits" ON daily_requests
  FOR SELECT USING (auth.uid() = user_id);
```

> Источник: docs/security/api-security.md

---

## 006: chat_sessions

```sql
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  version_id text NOT NULL,
  title text DEFAULT 'Новый чат',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

> Источник: docs/modules/chat.md, docs/modules/history.md

---

## 007: messages

```sql
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

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages" ON messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );
```

> Источник: docs/modules/chat.md

---

## 008: gen_history

```sql
CREATE TABLE gen_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('text','image','video')),
  title text NOT NULL,
  preview text DEFAULT '',
  media_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gen_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own history" ON gen_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users delete own history" ON gen_history
  FOR DELETE USING (auth.uid() = user_id);
```

> Источник: docs/modules/history.md

---

## 009: arena_votes

```sql
CREATE TABLE arena_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  prompt text NOT NULL,
  model_a text NOT NULL,
  response_a text NOT NULL,
  model_b text NOT NULL,
  response_b text NOT NULL,
  winner text NOT NULL CHECK (winner IN ('a','b','tie')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE arena_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own votes" ON arena_votes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own votes" ON arena_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

> Источник: docs/modules/arena.md

---

## 010: model_ratings

```sql
CREATE TABLE model_ratings (
  model_id text PRIMARY KEY,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  ties integer DEFAULT 0,
  total_votes integer DEFAULT 0,
  elo_score integer DEFAULT 1200,
  usage_count integer DEFAULT 0,
  usage_percent numeric(5,1) DEFAULT 0,
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE model_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ratings" ON model_ratings
  FOR SELECT USING (true);
-- ⛔ Запись ТОЛЬКО через серверный RPC (service role)
```

> Источник: docs/modules/arena.md, docs/modules/rating.md (объединение двух определений)

---

## 011: model_votes

```sql
CREATE TABLE model_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  vote text NOT NULL CHECK (vote IN ('like','dislike')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, model_id)
);

ALTER TABLE model_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own votes" ON model_votes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own votes" ON model_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own votes" ON model_votes
  FOR UPDATE USING (auth.uid() = user_id);
```

> Источник: docs/modules/rating.md

---

## 012: referrals

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

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);
```

> Источник: docs/modules/referral.md

---

## 013: favorite_models

```sql
CREATE TABLE favorite_models (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  model_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, model_id)
);

ALTER TABLE favorite_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON favorite_models
  FOR ALL USING (auth.uid() = user_id);
```

> Источник: docs/modules/favorites.md

---

## 014: shared_items

```sql
CREATE TABLE shared_items (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('text','image','video','arena')),
  model_id text NOT NULL,
  model_name text NOT NULL,
  prompt text NOT NULL,
  response text NOT NULL,
  media_url text,
  model_b_id text,
  model_b_name text,
  response_b text,
  winner text CHECK (winner IN ('a','b','tie')),
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

> Источник: docs/modules/sharing.md

---

## 015: knowledge_articles

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

> Источник: docs/modules/knowledge.md

---

## 016: support_tickets

```sql
CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  category text NOT NULL CHECK (category IN ('general','payment','withdrawal','technical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','answered','closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

> Источник: docs/modules/support.md

---

## 017: support_messages

```sql
CREATE TABLE support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user','support')),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages" ON support_messages
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
  );
CREATE POLICY "Users send messages" ON support_messages
  FOR INSERT WITH CHECK (
    ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
  );
```

> Источник: docs/modules/support.md

---

## 018: security_logs

```sql
CREATE TABLE security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  ip_address text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
-- ⛔ НЕТ политик для anon/authenticated — только service_role может писать и читать
```

> Источник: docs/security/api-security.md

---

## 019: functions

```sql
-- 1. Триггер регистрации (создаёт profiles + balances + реферал)
-- Полный код: docs/security/auth.md секция 7
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$ ... $$;

-- 2. Атомарное списание (баланс + операция в одной транзакции)
-- Полный код: docs/security/SECURITY.md секция 6.2
CREATE OR REPLACE FUNCTION deduct_coins(p_user_id uuid, p_cost int, p_label text) RETURNS int AS $$ ... $$;

-- 3. Rate limiting (проверка + инкремент дневного лимита)
-- Полный код: docs/security/api-security.md
CREATE OR REPLACE FUNCTION check_and_increment_limit(p_user_id uuid) RETURNS json AS $$ ... $$;

-- 4. Автоочистка данных старше 7 дней
-- Полный код: docs/security/SECURITY.md секция 8.3
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS void AS $$ ... $$;
```

> Полные тела функций — в указанных файлах-источниках. При создании миграции — скопировать оттуда.

---

## 020: triggers

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 021-022: storage (buckets + policies)

```sql
-- Buckets:
-- 1. user-uploads (приватный) — загрузки пользователей
-- 2. generations (приватный) — результаты генераций
-- 3. avatars (публичный) — аватары

-- Полные RLS-политики: docs/modules/file-storage.md
```

---

## Итого: 18 таблиц + 4 функции + 1 триггер + 3 storage bucket

| Категория | Кол-во |
|-----------|--------|
| Таблицы | 18 |
| RLS-политики | ~30 |
| Функции | 4 |
| Триггеры | 1 |
| Storage buckets | 3 |
| Storage policies | 5 |

---

## Порядок реализации (рекомендуемый)

### Фаза 1: Auth + Core (миграции 001-005)
profiles → balances → operations → subscriptions → daily_requests
+ handle_new_user() + on_auth_user_created trigger

### Фаза 2: Chat + History (миграции 006-008)
chat_sessions → messages → gen_history

### Фаза 3: Arena + Rating (миграции 009-011)
arena_votes → model_ratings → model_votes

### Фаза 4: Social (миграции 012-014)
referrals → favorite_models → shared_items

### Фаза 5: Content + Support (миграции 015-018)
knowledge_articles → support_tickets → support_messages → security_logs

### Фаза 6: Functions + Storage (миграции 019-022)
deduct_coins + check_and_increment_limit + cleanup_old_data
+ storage buckets + storage policies

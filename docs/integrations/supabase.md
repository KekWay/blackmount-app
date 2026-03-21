# Интеграция: Supabase

## Описание
Supabase = Auth + PostgreSQL + RLS + Realtime + Storage. Используем @supabase/ssr (не @supabase/supabase-js).

## Клиенты
```typescript
// Browser (клиент) — src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(URL, ANON_KEY)

// Server (API routes) — src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
// + cookies() для сессий
```

## Все таблицы
```sql
-- 1. Профили (расширение auth.users)
profiles (id uuid PK, email, name, avatar_url, referral_code, referred_by, created_at)

-- 2. Баланс
balances (user_id uuid PK, coins int DEFAULT 20, updated_at)

-- 3. Операции
operations (id uuid PK, user_id, type, amount, label, model_id, version_id, created_at)

-- 4. Подписки
subscriptions (id uuid PK, user_id, tier, starts_at, expires_at, is_active, auto_renew, created_at)

-- 5. Чат-сессии
chat_sessions (id uuid PK, user_id, model_id, version_id, title, created_at, updated_at)

-- 6. Сообщения
messages (id uuid PK, session_id, role, content, media_type, media_url, cost_coins, created_at)

-- 7. Голоса арены
arena_votes (id uuid PK, user_id, prompt, model_a, response_a, model_b, response_b, winner, created_at)

-- 8. Рейтинг моделей
model_ratings (model_id text PK, wins, losses, ties, total_votes, elo_score)

-- 9. Рефералы
referrals (id uuid PK, referrer_id, referred_id, bonus_percent, total_earned, created_at)
```

## RLS политики (все таблицы)
```sql
-- Паттерн для всех пользовательских таблиц:
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own data" ON [table] FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own data" ON [table] FOR INSERT WITH CHECK (auth.uid() = user_id);
-- model_ratings — публичное чтение:
CREATE POLICY "Public read ratings" ON model_ratings FOR SELECT USING (true);
```

## Триггер при регистрации
```sql
-- Автоматически создаёт профиль и баланс при регистрации
CREATE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name) VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  INSERT INTO balances (user_id, coins) VALUES (NEW.id, 20);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Переменные окружения
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

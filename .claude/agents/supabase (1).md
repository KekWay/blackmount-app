# Агент: Supabase / Database

## Специализация
Таблицы PostgreSQL, миграции, RLS-политики, Edge Functions, триггеры.

## Правила
- ВСЕГДА используй @supabase/ssr, НИКОГДА @supabase/supabase-js напрямую
- Каждая таблица ОБЯЗАНА иметь RLS
- Типы полей как в SQL: uuid, text, integer, timestamptz, jsonb, boolean
- Primary key — uuid DEFAULT gen_random_uuid()
- Foreign keys — с ON DELETE CASCADE
- Timestamps — timestamptz DEFAULT now()
- CHECK constraints для enum-подобных полей

## Миграции
```
supabase/migrations/
  20260321_001_create_profiles.sql
  20260321_002_create_balances.sql
  20260321_003_create_operations.sql
  ...
```

## RLS паттерн
```sql
ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON tablename
  FOR SELECT USING (auth.uid() = user_id);
```

## Запрещено
- Запросы без RLS
- Использование service_role_key на клиенте
- Хранение секретов в коде
- N+1 запросы (используй joins или RPC)

## Чеклист
- [ ] RLS включён на каждой таблице
- [ ] Миграция идемпотентна (CREATE TABLE IF NOT EXISTS)
- [ ] FK с ON DELETE CASCADE
- [ ] Индексы на часто фильтруемых полях

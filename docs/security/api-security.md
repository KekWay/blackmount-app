# Безопасность API — Rate Limiting и защита

---

## Rate Limiting

### Таблица в Supabase:
```sql
CREATE TABLE daily_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  count integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- RLS: только чтение своих
ALTER TABLE daily_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own" ON daily_requests FOR SELECT USING (auth.uid() = user_id);
```

### Серверная функция:
```sql
CREATE FUNCTION check_and_increment_limit(p_user_id uuid)
RETURNS json AS $$
DECLARE
  user_tier text;
  day_limit int;
  current_count int;
BEGIN
  -- Определить тариф
  SELECT COALESCE(s.tier, 'free') INTO user_tier
  FROM profiles p
  LEFT JOIN subscriptions s ON s.user_id = p.id AND s.is_active = true
  WHERE p.id = p_user_id;

  -- Лимит по тарифу
  day_limit := CASE user_tier
    WHEN 'free' THEN 50
    WHEN 'basic' THEN 100
    WHEN 'pro' THEN 150
    WHEN 'max' THEN 200
    ELSE 50
  END;

  -- Получить или создать счётчик
  INSERT INTO daily_requests (user_id, date, count)
  VALUES (p_user_id, CURRENT_DATE, 0)
  ON CONFLICT (user_id, date) DO NOTHING;

  SELECT count INTO current_count
  FROM daily_requests
  WHERE user_id = p_user_id AND date = CURRENT_DATE;

  IF current_count >= day_limit THEN
    RETURN json_build_object('allowed', false, 'remaining', 0, 'limit', day_limit);
  END IF;

  -- Инкремент
  UPDATE daily_requests SET count = count + 1
  WHERE user_id = p_user_id AND date = CURRENT_DATE;

  RETURN json_build_object('allowed', true, 'remaining', day_limit - current_count - 1, 'limit', day_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Использование в API route:
```typescript
// В КАЖДОМ API route для генерации:
const { data: limitCheck } = await supabase.rpc('check_and_increment_limit', {
  p_user_id: user.id
})

if (!limitCheck.allowed) {
  return Response.json({
    error: 'Лимит запросов на сегодня исчерпан',
    remaining: 0,
    limit: limitCheck.limit,
  }, { status: 429 })
}
```

---

## Защита от IP-спама

```typescript
// src/lib/ip-limiter.ts
// Для защиты эндпоинтов регистрации и платежей

// Хранить в Supabase или KV (Railway Redis)
const IP_LIMITS = {
  registration: { max: 3, window: '24h' },
  payment: { max: 10, window: '1h' },
  api: { max: 1000, window: '1h' },
}
```

---

## Валидация входных данных

```typescript
// src/lib/validators.ts
// Используй Zod для валидации:

import { z } from 'zod'

export const chatRequestSchema = z.object({
  modelId: z.string().min(1).max(50),
  versionId: z.string().min(1).max(50),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(50000), // макс 50k символов
  })).min(1).max(100), // макс 100 сообщений в контексте
})

export const topupRequestSchema = z.object({
  packageId: z.enum(['start', 'basic', 'advanced', 'professional', 'business']),
})

// В API route:
const parsed = chatRequestSchema.safeParse(body)
if (!parsed.success) {
  return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
}
```

---

## Security Headers

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

---

## CORS

```typescript
// src/app/api/[...]/route.ts
// Для вебхуков — разрешить только ЮKassa:
const ALLOWED_ORIGINS = [
  'https://blackmount.app',
  'https://yookassa.ru',
]
```

---

## Логирование безопасности

```sql
CREATE TABLE security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL, -- 'login_failed', 'rate_limited', 'blocked', 'suspicious'
  ip_address text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Только сервер может писать (через service role)
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
-- НЕТ политик для anon/authenticated — только service role
```

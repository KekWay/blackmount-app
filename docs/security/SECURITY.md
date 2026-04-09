# SECURITY.md — Blackmount AI Aggregator

> Главный документ безопасности. Claude Code ОБЯЗАН читать этот файл при работе с auth, платежами, API, данными пользователей.

---

## 1. Принципы безопасности

- **Нулевое доверие** — каждый запрос проверяется на авторизацию, даже если клиент «авторизован»
- **Минимальные привилегии** — пользователь видит/изменяет ТОЛЬКО свои данные
- **Секреты на сервере** — API ключи НИКОГДА не попадают на клиент
- **Атомарные операции** — списание + генерация = единая транзакция, не раздельные
- **Защита в глубину** — RLS (БД) + middleware (сервер) + проверка (клиент) = 3 уровня
- **Хранение с ограничением** — файлы и диалоги хранятся 7 дней, потом удаляются автоматически

---

## 2. Классификация данных

| Уровень | Данные | Где хранить | Доступ |
|---------|--------|-------------|--------|
| 🔴 КРИТИЧЕСКИЙ | API ключи, секреты ЮKassa, service_role_key | .env.local (ТОЛЬКО сервер) | Только API routes |
| 🟠 ВЫСОКИЙ | Пароли, сессии, токены авторизации | Supabase Auth (хеширование) | httpOnly cookies |
| 🟡 СРЕДНИЙ | Email, имя, баланс, история чатов | Supabase (RLS) | Только владелец |
| 🟢 НИЗКИЙ | Рейтинги моделей, публичные промпты | Supabase (public read) | Все пользователи |

---

## 3. Переменные окружения

### 🔴 Серверные (НИКОГДА в NEXT_PUBLIC_):
```env
# Supabase
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # Полный доступ к БД

# AI провайдеры
OPENROUTER_API_KEY=sk-or-...            # Текстовые модели
FAL_API_KEY=...                          # fal.ai — изображения
KIE_API_KEY=...                          # kie.ai — видео

# Платежи
YUKASSA_SHOP_ID=123456
YUKASSA_SECRET_KEY=live_...
YUKASSA_WEBHOOK_SECRET=...
```

### 🟢 Клиентские (безопасны):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...    # Ограничен RLS
NEXT_PUBLIC_APP_URL=https://blackmount.app
```

### Правила:
- ⛔ API ключ в `NEXT_PUBLIC_` = любой пользователь украдёт и потратит ваши деньги
- ⛔ `SUPABASE_SERVICE_ROLE_KEY` в клиентском коде = полный доступ к ВСЕМ данным всех пользователей
- ✅ `.env.local` в `.gitignore` (ОБЯЗАТЕЛЬНО)
- ✅ В CI/CD секреты через environment variables платформы (Railway)

---

## 4. Supabase Row Level Security (RLS)

### Правило: КАЖДАЯ таблица ОБЯЗАНА иметь RLS

```sql
-- ШАБЛОН для всех пользовательских таблиц:
ALTER TABLE имя_таблицы ENABLE ROW LEVEL SECURITY;

-- Чтение только своих данных
CREATE POLICY "Users read own data" ON имя_таблицы
  FOR SELECT USING (auth.uid() = user_id);

-- Создание только от своего имени
CREATE POLICY "Users insert own data" ON имя_таблицы
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Обновление только своих данных
CREATE POLICY "Users update own data" ON имя_таблицы
  FOR UPDATE USING (auth.uid() = user_id);

-- Удаление только своих данных
CREATE POLICY "Users delete own data" ON имя_таблицы
  FOR DELETE USING (auth.uid() = user_id);
```

### Таблицы с особыми правилами:
```sql
-- model_ratings — публичное чтение, запись только через RPC
CREATE POLICY "Public read" ON model_ratings FOR SELECT USING (true);
-- НЕТ INSERT/UPDATE/DELETE политик — запись только через серверный RPC

-- profiles — чтение своего + публичные поля для реферальной программы
CREATE POLICY "Read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Read referral codes" ON profiles
  FOR SELECT USING (true) -- но SELECT только referral_code, name
  WITH CHECK (false);     -- НЕЛЬЗЯ менять чужие профили

-- balances — ТОЛЬКО чтение. Изменение ТОЛЬКО через серверный RPC
CREATE POLICY "Read own balance" ON balances FOR SELECT USING (auth.uid() = user_id);
-- ⛔ НЕТ INSERT/UPDATE политик — баланс меняется ТОЛЬКО сервером
```

### ⛔ БЕЗ RLS = катастрофа:
Любой пользователь с anon_key может прочитать ВСЕ данные всех пользователей.

---

## 5. Защита API Routes

### Каждый API route ОБЯЗАН:

```typescript
// src/app/api/chat/route.ts
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // 1. АВТОРИЗАЦИЯ — проверить что пользователь залогинен
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. ВАЛИДАЦИЯ — проверить входные данные
  const body = await request.json()
  if (!body.modelId || typeof body.modelId !== 'string') {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  // 3. АВТОРИЗАЦИЯ ДЕЙСТВИЯ — проверить что пользователь МОЖЕТ это делать
  // (баланс, подписка, лимиты)
  const { data: balance } = await supabase
    .from('balances')
    .select('coins')
    .eq('user_id', user.id)
    .single()

  if (balance.coins < cost) {
    return Response.json({ error: 'Insufficient balance' }, { status: 402 })
  }

  // 4. ВЫПОЛНЕНИЕ — только после всех проверок
  // ...
}
```

### Rate Limiting (защита от спама):

```typescript
// src/lib/rate-limiter.ts
// Хранить в Supabase или Redis — НЕ в localStorage

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

// Лимиты по подпискам:
const LIMITS: Record<string, number> = {
  free: 50,     // 50 запросов/день
  basic: 100,   // 100 запросов/день
  pro: 150,     // 150 запросов/день
  max: 200,     // 200 запросов/день
}

// Проверка в КАЖДОМ API route:
async function checkRateLimit(userId: string, tier: string): Promise<RateLimitResult> {
  const limit = LIMITS[tier] || LIMITS.free
  // SELECT count FROM daily_requests WHERE user_id = userId AND date = today
  // Если count >= limit → return { allowed: false }
  // Иначе → INCREMENT и return { allowed: true }
}
```

---

## 6. Защита от злоупотреблений

### 6.1 Многократная регистрация (фарминг айкоинов)
**Атака:** создать 100 аккаунтов → получить 100 × 20 = 2000 бесплатных айкоинов
**Защита:**
- Лимит регистраций с одного IP: максимум 3 аккаунта в день
- Подтверждение email перед начислением айкоинов
- Капча при регистрации (hCaptcha или Turnstile)
- Мониторинг: алерт если с одного IP > 5 регистраций за неделю

### 6.2 Манипуляция балансом
**Атака:** отправить запрос к API с подменённым балансом
**Защита:**
- Баланс проверяется ТОЛЬКО на сервере через Supabase RLS
- Клиент НЕ МОЖЕТ изменить баланс — только через серверный RPC
- Списание через атомарную транзакцию:
```sql
-- Атомарное списание: если баланс < cost — ошибка, не спишет
CREATE FUNCTION deduct_coins(p_user_id uuid, p_cost int, p_label text)
RETURNS int AS $$
DECLARE
  new_balance int;
BEGIN
  UPDATE balances SET coins = coins - p_cost, updated_at = now()
    WHERE user_id = p_user_id AND coins >= p_cost
    RETURNING coins INTO new_balance;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  INSERT INTO operations (user_id, type, amount, label)
    VALUES (p_user_id, 'spent', -p_cost, p_label);
  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.3 Обход лимита запросов
**Атака:** сбросить счётчик через localStorage или смену браузера
**Защита:**
- Счётчик ТОЛЬКО на сервере (таблица daily_requests в Supabase)
- Привязан к user_id, не к IP/cookie
- Сбрасывается автоматически в полночь (cron или check по дате)

### 6.4 Использование заблокированных моделей
**Атака:** подменить modelId в запросе — отправить 'claude-opus-4.5' без подписки
**Защита:**
```typescript
// В API route — ПЕРЕД отправкой к AI провайдеру:
const LOCKED_VERSIONS = new Set(['gpt-5.4', 'claude-opus-4.6', 'gemini-3.1-pro', ...])

if (LOCKED_VERSIONS.has(versionId)) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('tier, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!sub) {
    return Response.json({ error: 'Subscription required' }, { status: 403 })
  }
}
```

### 6.5 Реферальный абьюз
**Атака:** создать фейковые аккаунты и «приглашать» их
**Защита:**
- Бонус начисляется только после подтверждения email приглашённого
- Максимум 10 реферальных бонусов в день
- Если referrer и referred с одного IP — пометить как подозрительное
- Бонус за покупку — только если приглашённый потратил реальные деньги (не бонусные)

### 6.6 Прямой доступ к API провайдерам
**Атака:** украсть OpenRouter ключ и использовать напрямую
**Защита:**
- Ключи ТОЛЬКО в .env.local, НИКОГДА в клиентском коде
- В API routes — не возвращать ключи в ответах
- Мониторинг расходов на OpenRouter/fal.ai/kie.ai — алерт при аномальном использовании
- Ротация ключей при подозрении на утечку

### 6.7 Подозрительная активность — блокировка
```
1-я попытка нарушения → предупреждение (toast + email)
2-я попытка → временная блокировка 1 час
3-я попытка → блокировка 24 часа
4+ → блокировка аккаунта + email с объяснением
```

---

## 7. Финансовая безопасность (ЮKassa)

### 7.1 Вебхуки — проверка подписи
```typescript
// src/app/api/webhooks/yukassa/route.ts
import crypto from 'crypto'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('Content-SHA256')

  // 1. ПРОВЕРИТЬ ПОДПИСЬ — без этого ЛЮБОЙ может подделать вебхук
  const expectedSignature = crypto
    .createHmac('sha256', process.env.YUKASSA_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return Response.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // 2. ПРОВЕРИТЬ ИДЕМПОТЕНТНОСТЬ — не обрабатывать один платёж дважды
  const payment = JSON.parse(body)
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('external_id', payment.object.id)
    .single()

  if (existing) {
    return Response.json({ ok: true }) // Уже обработан
  }

  // 3. ОБРАБОТАТЬ ПЛАТЁЖ
  // Начислить айкоины / активировать подписку
  // ...
}
```

### 7.2 Защита от двойного списания
```
Сценарий: пользователь нажал «Купить» дважды быстро
Защита:
1. Кнопка disabled после первого клика
2. Уникальный idempotency_key в каждом запросе к ЮKassa
3. Проверка на сервере: если платёж с таким ключом уже создан — вернуть существующий
```

### 7.3 Атомарные транзакции
```
Правило: НИКОГДА не начислять айкоины до подтверждения платежа
Поток:
1. Пользователь нажимает «Купить» → создаётся платёж в ЮKassa
2. ЮKassa показывает форму оплаты
3. Пользователь платит
4. ЮKassa отправляет webhook → payment.succeeded
5. ТОЛЬКО ПОСЛЕ webhook → начислить айкоины
6. Если webhook не пришёл → НЕ начислять (polling через 5 мин)
```

---

## 8. Безопасность файлов пользователей

### 8.1 Загрузка файлов
```typescript
// Правила загрузки:
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Проверки:
// 1. Тип файла — по MIME type И по содержимому (magic bytes), не по расширению
// 2. Размер — максимум 50MB
// 3. Имя файла — санитизация (убрать спецсимволы, ../ и т.д.)
// 4. Вирусы — опционально, через ClamAV или сервис сканирования
```

### 8.2 Хранение (Supabase Storage)
```sql
-- Bucket с RLS:
-- Каждый пользователь может читать/загружать только в свою папку
-- Путь: users/{user_id}/uploads/{filename}

CREATE POLICY "Users access own files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'user-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### 8.3 Автоудаление через 7 дней
```sql
-- Cron job (Supabase Edge Function или pg_cron):
-- Запускается ежедневно в 03:00
-- Удаляет файлы, чаты и генерации старше 7 дней

CREATE FUNCTION cleanup_old_data() RETURNS void AS $$
BEGIN
  -- Удалить старые сообщения
  DELETE FROM messages WHERE created_at < now() - interval '7 days';
  -- Удалить пустые сессии
  DELETE FROM chat_sessions WHERE id NOT IN (SELECT DISTINCT session_id FROM messages);
  -- Удалить старые генерации из истории
  DELETE FROM gen_history WHERE created_at < now() - interval '7 days';
  -- Файлы из storage — через Supabase Storage API
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 8.4 Приватность генераций
- По умолчанию все генерации ПРИВАТНЫЕ
- Шаринг — только если пользователь ЯВНО нажал "Поделиться"
- Шаред ссылки можно отозвать (удалить)
- Шаред контент НЕ индексируется поисковиками (noindex, nofollow)

---

## 9. Безопасность авторизации

Подробно описано в `docs/modules/auth.md`.

Ключевые правила:
- Пароли хешируются Supabase Auth (bcrypt) — мы НИКОГДА не видим пароль
- Сессии через httpOnly cookies — JavaScript не может прочитать
- OAuth токены хранятся в Supabase, не на клиенте
- Refresh токены ротируются автоматически
- При подозрительной активности — блокировка аккаунта

---

## 10. Чеклист перед деплоем

### 🔴 Критическое:
- [ ] `.env.local` в `.gitignore`
- [ ] Все API ключи ТОЛЬКО в серверных переменных (не NEXT_PUBLIC_)
- [ ] RLS включён на КАЖДОЙ таблице Supabase
- [ ] Вебхуки ЮKassa проверяют подпись
- [ ] Баланс изменяется ТОЛЬКО через серверный RPC
- [ ] Rate limiting включён на всех API routes

### 🟠 Важное:
- [ ] Капча при регистрации
- [ ] Подтверждение email
- [ ] Лимит регистраций с одного IP
- [ ] Идемпотентность платежей
- [ ] Автоудаление данных через 7 дней

### 🟡 Рекомендуемое:
- [ ] Мониторинг расходов на API провайдерах
- [ ] Алерты при аномальной активности
- [ ] Ротация API ключей раз в квартал
- [ ] Бэкапы БД

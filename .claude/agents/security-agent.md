# Правила безопасности для Claude Code

> Claude Code ОБЯЗАН следовать этим правилам при написании ЛЮБОГО кода. Нарушение = уязвимость в продакшене.

## Ключевые документы
- docs/security/SECURITY.md — полные правила
- docs/security/api-security.md — rate limiting
- docs/security/auth.md — OAuth, триггеры, middleware
- docs/ENV_TEMPLATE.md — все переменные (серверные/клиентские)

---

## 🔴 НИКОГДА (нарушение = критическая уязвимость)

### API ключи:
- ❌ НИКОГДА не помещай API ключи в переменные с NEXT_PUBLIC_
- ❌ НИКОГДА не хардкодь ключи в коде: `const key = 'sk-or-...'`
- ❌ НИКОГДА не логируй API ключи: `console.log(process.env.OPENROUTER_API_KEY)`
- ❌ НИКОГДА не возвращай ключи в Response: `return Response.json({ key: process.env.API_KEY })`
- ❌ НИКОГДА не передавай ключи на клиент через props, context, или zustand store

### Авторизация:
- ❌ НИКОГДА не доверяй данным от клиента — проверяй auth на СЕРВЕРЕ
- ❌ НИКОГДА не используй `supabaseClient` (browser) для проверки auth в API routes — используй `createServerClient`
- ❌ НИКОГДА не используй `SUPABASE_SERVICE_ROLE_KEY` на клиенте
- ❌ НИКОГДА не отключай RLS на таблице с пользовательскими данными
- ❌ НИКОГДА не создавай API route без проверки `auth.getUser()`

### Баланс и платежи:
- ❌ НИКОГДА не изменяй баланс на клиенте (zustand store — только для ОТОБРАЖЕНИЯ)
- ❌ НИКОГДА не начисляй айкоины без подтверждения платежа
- ❌ НИКОГДА не обрабатывай вебхук ЮKassa без проверки подписи
- ❌ НИКОГДА не доверяй сумме из клиентского запроса — бери из БД

### Данные:
- ❌ НИКОГДА не возвращай данные других пользователей
- ❌ НИКОГДА не используй SQL инъекции (всегда параметризированные запросы через Supabase SDK)
- ❌ НИКОГДА не сохраняй пароли в открытом виде

---

## 🟠 ОБЯЗАТЕЛЬНО (при каждом изменении)

### API Routes — каждый route содержит:
```typescript
// 1. Auth check
const { data: { user } } = await supabase.auth.getUser()
if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

// 2. Input validation
if (!body.modelId || typeof body.modelId !== 'string') {
  return Response.json({ error: 'Invalid input' }, { status: 400 })
}

// 3. Authorization check (баланс, подписка, лимиты)
// 4. Rate limiting
// 5. Бизнес-логика
// 6. Error handling (не раскрывай внутренние ошибки)
```

### Supabase:
- ✅ ВСЕГДА используй `@supabase/ssr` (не `@supabase/supabase-js`)
- ✅ ВСЕГДА включай RLS при создании таблицы
- ✅ ВСЕГДА проверяй `auth.uid() = user_id` в политиках
- ✅ ВСЕГДА используй `SECURITY DEFINER` для серверных RPC функций

### Платежи:
- ✅ ВСЕГДА проверяй подпись вебхука
- ✅ ВСЕГДА проверяй идемпотентность (не обрабатывай платёж дважды)
- ✅ ВСЕГДА используй атомарные транзакции (списание + начисление)

### Файлы:
- ✅ ВСЕГДА проверяй MIME type при загрузке
- ✅ ВСЕГДА ограничивай размер файла (50MB макс)
- ✅ ВСЕГДА санитизируй имя файла
- ✅ ВСЕГДА храни файлы в папке пользователя: `users/{user_id}/`

---

## 🟡 РЕКОМЕНДУЕТСЯ

- Логируй подозрительные действия (неудачные попытки auth, обход лимитов)
- Используй TypeScript strict — никакого `any`
- Обрабатывай ошибки — не раскрывай стек-трейс пользователю
- Возвращай общие сообщения об ошибках: "Invalid credentials" (не "User not found" / "Wrong password")
- Добавляй CORS headers для API routes
- Устанавливай security headers: X-Frame-Options, CSP, HSTS

---

## Паттерны безопасного кода

### ✅ Правильно — проверка на сервере:
```typescript
// API route
export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: balance } = await supabase
    .from('balances')
    .select('coins')
    .eq('user_id', user.id)
    .single()

  if (balance.coins < cost) {
    return Response.json({ error: 'Insufficient balance' }, { status: 402 })
  }

  // Атомарное списание через RPC
  const { data, error } = await supabase.rpc('deduct_coins', {
    p_user_id: user.id,
    p_cost: cost,
    p_label: `${modelName} — генерация`
  })
}
```

### ❌ Неправильно — доверие клиенту:
```typescript
// НИКОГДА ТАК:
export async function POST(req: Request) {
  const { userId, balance, modelId } = await req.json()
  // ⛔ userId из клиента — можно подменить на чужой
  // ⛔ balance из клиента — можно подменить на 999999
  // ⛔ Нет проверки auth
  await generateAI(modelId) // ⛔ Нет проверки лимитов/подписки
}
```

---

## При код-ревью проверяй:

1. [ ] API route имеет `auth.getUser()` проверку?
2. [ ] Входные данные валидируются?
3. [ ] Баланс/лимиты проверяются на СЕРВЕРЕ?
4. [ ] Нет API ключей в клиентском коде?
5. [ ] RLS включён для таблицы?
6. [ ] Ошибки не раскрывают внутреннюю информацию?

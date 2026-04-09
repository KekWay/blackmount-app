# ENV_TEMPLATE.md — Переменные окружения Blackmount

> Все переменные, необходимые для работы проекта.
> Копируй `.env.example` → `.env.local` и заполни значениями.
> 🔴 = серверный секрет (НИКОГДА в NEXT_PUBLIC_).
> 🟢 = клиентский (безопасен для браузера).

---

## Supabase

| Переменная | Тип | Описание | Где взять |
|-----------|-----|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | 🟢 | URL проекта Supabase | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🟢 | Публичный ключ (ограничен RLS) | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 | Полный доступ к БД, обходит RLS | Supabase Dashboard → Settings → API |

**⛔ `SUPABASE_SERVICE_ROLE_KEY` в клиентском коде = полный доступ ко ВСЕМ данным всех пользователей.**

---

## AI-провайдеры

| Переменная | Тип | Описание | Где взять |
|-----------|-----|----------|-----------|
| `OPENROUTER_API_KEY` | 🔴 | Текстовые модели (ChatGPT, Claude, Gemini) | openrouter.ai → Settings → API Keys |
| `FAL_API_KEY` | 🔴 | Изображения (NanoBanana, Flux) | fal.ai → Dashboard → API Keys |
| `KIE_API_KEY` | 🔴 | Видео (Kling, Veo 3.1) | kie.ai → Dashboard → API Keys |

**⛔ Утечка любого ключа = кто угодно тратит ваши деньги.**
Мониторьте расход на дашбордах провайдеров. Ротируйте ключи при подозрении.

---

## Платежи (ЮKassa)

| Переменная | Тип | Описание | Где взять |
|-----------|-----|----------|-----------|
| `YUKASSA_SHOP_ID` | 🔴 | ID магазина | yookassa.ru → Настройки |
| `YUKASSA_SECRET_KEY` | 🔴 | Секретный ключ | yookassa.ru → Настройки → Ключи |
| `YUKASSA_WEBHOOK_SECRET` | 🔴 | Подпись вебхуков (проверка подлинности) | yookassa.ru → Настройки → Вебхуки |

**⛔ Без проверки подписи вебхуков любой может подделать платёж.**

---

## OAuth (VK + Telegram) — v1.1

| Переменная | Тип | Описание | Где взять |
|-----------|-----|----------|-----------|
| `VK_CLIENT_ID` | 🔴 | ID приложения VK | dev.vk.com → Приложения |
| `VK_CLIENT_SECRET` | 🔴 | Секрет приложения VK | dev.vk.com → Приложения |
| `TELEGRAM_BOT_TOKEN` | 🔴 | Токен бота Telegram | @BotFather → /newbot |

> VK и Telegram OAuth реализуются в v1.1, не в MVP.

---

## Приложение

| Переменная | Тип | Описание | Значение |
|-----------|-----|----------|----------|
| `NEXT_PUBLIC_APP_URL` | 🟢 | URL приложения | `https://blackmount.app` (prod) / `http://localhost:3000` (dev) |

---

## Использование в коде

### Клиент (браузер):
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Сервер (API Routes):
```typescript
// src/lib/supabase/server.ts — для запросов от авторизованного пользователя
import { createServerClient } from '@supabase/ssr'
// Использует NEXT_PUBLIC_SUPABASE_ANON_KEY + cookies (RLS работает)

// Для административных операций (начисление монет, блокировка):
import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // обходит RLS
)
```

### AI-провайдеры:
```typescript
// Все ключи доступны ТОЛЬКО в API Routes (серверный код)
const openrouterHeaders = {
  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
}
const falHeaders = {
  'Authorization': `Key ${process.env.FAL_API_KEY}`,
}
const kieHeaders = {
  'Authorization': `Bearer ${process.env.KIE_API_KEY}`,
}
```

---

## Railway деплой

В Railway → Settings → Variables добавить ВСЕ переменные из этого документа.
Railway автоматически инжектит их в `process.env` при билде и рантайме.

Порядок настройки:
1. Создать проект Supabase → скопировать URL + ключи
2. Зарегистрироваться на OpenRouter, fal.ai, kie.ai → получить API-ключи
3. Подключить ЮKassa → получить shop_id + secret_key + webhook_secret
4. Добавить все переменные в Railway
5. (v1.1) Создать VK-приложение + Telegram-бота → добавить ключи

---

## Чеклист безопасности

- [ ] `.env.local` в `.gitignore`
- [ ] Ни один `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `FAL_API_KEY`, `KIE_API_KEY` не в `NEXT_PUBLIC_`
- [ ] Ни один серверный ключ не используется в файлах с `'use client'`
- [ ] Вебхуки ЮKassa проверяют `YUKASSA_WEBHOOK_SECRET`
- [ ] В Railway все переменные добавлены через UI (не в коде)

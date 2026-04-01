# Модуль: Auth (Авторизация) — Полная документация

> 4 способа авторизации: Email + Google + VK + Telegram. Всё через Supabase Auth.

---

## 1. Способы авторизации

| Способ | Провайдер | Supabase | Статус |
|--------|-----------|----------|--------|
| Email + пароль | Supabase Auth (встроенный) | `signUp`, `signInWithPassword` | MVP |
| Google OAuth | Supabase Auth + Google | `signInWithOAuth({ provider: 'google' })` | MVP |
| VK OAuth | Supabase Auth + Custom | Через Edge Function / кастомный OAuth | v1.1 |
| Telegram Login | Supabase Auth + Custom | Через Telegram Login Widget + верификация | v1.1 |

---

## 2. Supabase Auth — базовая настройка

### Включить провайдеры в Supabase Dashboard:
```
Authentication → Providers:
  - Email: ВКЛЮЧИТЬ (confirm email: ДА)
  - Google: ВКЛЮЧИТЬ (добавить Client ID + Secret из Google Cloud Console)
  - VK: кастомная реализация (Supabase не поддерживает VK нативно)
  - Telegram: кастомная реализация
```

### URL конфигурация:
```
Authentication → URL Configuration:
  - Site URL: https://blackmount.app
  - Redirect URLs: 
    - https://blackmount.app/auth/callback
    - http://localhost:3000/auth/callback (для разработки)
```

---

## 3. Email + пароль

### Регистрация:
```typescript
// src/app/api/auth/signup/route.ts
export async function POST(request: Request) {
  const { email, password, name, referralCode } = await request.json()

  // 1. Валидация
  if (!email || !password || password.length < 8) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  // 2. Регистрация в Supabase Auth
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // metadata
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return Response.json({ error: 'Email уже используется' }, { status: 409 })
    }
    return Response.json({ error: 'Registration failed' }, { status: 400 })
  }

  // 3. Профиль и баланс создаются АВТОМАТИЧЕСКИ через триггер (handle_new_user)
  // 4. Реферальный бонус обрабатывается в триггере

  return Response.json({ user: data.user, session: data.session })
}
```

### Логин:
```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: Request) {
  const { email, password } = await request.json()

  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // ⛔ НЕ говори "пользователь не найден" или "неверный пароль" отдельно
    return Response.json({ error: 'Неверный email или пароль' }, { status: 401 })
  }

  return Response.json({ user: data.user, session: data.session })
}
```

---

## 4. Google OAuth

### Настройка Google Cloud Console:
```
1. console.cloud.google.com → Создать проект
2. APIs & Services → Credentials → Create OAuth Client ID
3. Тип: Web Application
4. Authorized redirect URIs:
   - https://YOUR_SUPABASE_URL/auth/v1/callback
5. Скопировать Client ID и Client Secret
6. Вставить в Supabase Dashboard → Authentication → Providers → Google
```

### Клиентский код:
```typescript
// src/app/(auth)/auth/page.tsx
async function handleGoogleLogin() {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}
```

### Auth Callback:
```typescript
// src/app/auth/callback/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Проверить реферальный код из localStorage (через client-side script)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth?error=callback_failed', request.url))
}
```

---

## 5. VK OAuth (кастомная реализация)

Supabase не поддерживает VK нативно. Реализуем через Edge Function.

### Настройка VK:
```
1. dev.vk.com → Создать приложение
2. Тип: Веб-сайт
3. Redirect URI: https://blackmount.app/api/auth/vk/callback
4. Получить client_id и client_secret
```

### Flow:
```
1. Клиент → /api/auth/vk → redirect на VK OAuth
2. VK → пользователь разрешает → redirect на /api/auth/vk/callback?code=...
3. Сервер → обменивает code на access_token
4. Сервер → получает данные пользователя (email, name, avatar)
5. Сервер → создаёт/находит пользователя в Supabase Auth через admin API
6. Сервер → создаёт сессию → redirect на /
```

### API Route:
```typescript
// src/app/api/auth/vk/route.ts
export async function GET() {
  const VK_CLIENT_ID = process.env.VK_CLIENT_ID
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/vk/callback`

  const url = `https://oauth.vk.com/authorize?client_id=${VK_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=email&response_type=code&v=5.131`

  return NextResponse.redirect(url)
}

// src/app/api/auth/vk/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // 1. Обменять code на token
  const tokenRes = await fetch('https://oauth.vk.com/access_token?' + new URLSearchParams({
    client_id: process.env.VK_CLIENT_ID!,
    client_secret: process.env.VK_CLIENT_SECRET!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/vk/callback`,
    code: code!,
  }))
  const { access_token, email, user_id } = await tokenRes.json()

  // 2. Получить данные пользователя
  const userRes = await fetch(`https://api.vk.com/method/users.get?access_token=${access_token}&fields=photo_200&v=5.131`)
  const { response: [vkUser] } = await userRes.json()

  // 3. Создать/найти в Supabase через service role
  const supabaseAdmin = createServiceRoleClient()
  // ... создать пользователя или войти

  // 4. Redirect
  return NextResponse.redirect(new URL('/', request.url))
}
```

---

## 6. Telegram Login

### Настройка:
```
1. @BotFather → /newbot → создать бота
2. /setdomain → установить домен blackmount.app
3. Получить bot_token
```

### Telegram Login Widget (на странице auth):
```html
<script async src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="BlackmountBot"
  data-size="large"
  data-auth-url="https://blackmount.app/api/auth/telegram/callback"
  data-request-access="write">
</script>
```

### Верификация (ОБЯЗАТЕЛЬНО — без неё можно подделать):
```typescript
// src/app/api/auth/telegram/callback/route.ts
import crypto from 'crypto'

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams)
  const { hash, ...data } = params

  // 1. ВЕРИФИКАЦИЯ — проверить что данные от Telegram
  const secret = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN!).digest()
  const checkString = Object.keys(data).sort().map(k => `${k}=${data[k]}`).join('\n')
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')

  if (hmac !== hash) {
    return Response.json({ error: 'Invalid Telegram data' }, { status: 403 })
  }

  // 2. Проверить свежесть (не старше 1 часа)
  if (Date.now() / 1000 - Number(data.auth_date) > 3600) {
    return Response.json({ error: 'Expired' }, { status: 403 })
  }

  // 3. Создать/найти пользователя в Supabase
  // data.id, data.first_name, data.username, data.photo_url

  // 4. Redirect
  return NextResponse.redirect(new URL('/', request.url))
}
```

---

## 7. Триггер при регистрации

```sql
-- Автоматически создаёт профиль и баланс для КАЖДОГО нового пользователя
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$
DECLARE
  ref_code text;
  bonus int := 20; -- стандартный бонус
BEGIN
  -- Создать профиль
  INSERT INTO profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'photo_url', '')
  );

  -- Проверить реферальный код (передаётся через metadata при регистрации)
  ref_code := NEW.raw_user_meta_data->>'referral_code';
  IF ref_code IS NOT NULL THEN
    -- Найти реферера
    UPDATE profiles SET referred_by = (
      SELECT id FROM profiles WHERE referral_code = ref_code LIMIT 1
    ) WHERE id = NEW.id;

    -- Бонус +20 за реферала
    bonus := 40;

    -- Записать операцию бонуса
    INSERT INTO operations (user_id, type, amount, label)
    VALUES (NEW.id, 'bonus', 20, 'Бонус за приглашение');

    -- Создать запись реферала
    INSERT INTO referrals (referrer_id, referred_id, bonus_percent)
    SELECT p.id, NEW.id, 15
    FROM profiles p WHERE p.referral_code = ref_code;
  END IF;

  -- Создать баланс
  INSERT INTO balances (user_id, coins) VALUES (NEW.id, bonus);

  -- Записать операцию начального баланса
  INSERT INTO operations (user_id, type, amount, label)
  VALUES (NEW.id, 'bonus', 20, 'Приветственный бонус');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 8. Middleware (проверка auth на всех страницах)

```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Защищённые маршруты
  const protectedRoutes = ['/profile', '/chat', '/history', '/subscription']
  const isProtected = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // Если авторизован и на /auth → редирект на главную
  if (session && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|api/webhooks).*)'],
}
```

---

## 9. Безопасность сессий

- Сессии хранятся в httpOnly cookies (не в localStorage)
- Refresh token ротируется при каждом обновлении
- Сессия истекает через 1 час, refresh через 7 дней
- При подозрительной активности → принудительный logout:

```typescript
// Блокировка аккаунта:
async function blockUser(userId: string, reason: string) {
  const supabaseAdmin = createServiceRoleClient()

  // 1. Заблокировать в profiles
  await supabaseAdmin.from('profiles').update({ is_blocked: true, block_reason: reason }).eq('id', userId)

  // 2. Завершить все сессии
  await supabaseAdmin.auth.admin.signOut(userId)

  // 3. Залогировать
  await supabaseAdmin.from('security_logs').insert({
    user_id: userId, action: 'block', reason, created_at: new Date()
  })
}
```

---

## 10. Edge Cases

| Сценарий | Поведение |
|----------|-----------|
| Двойная регистрация email | "Email уже используется" (не раскрываем что аккаунт существует) |
| Google OAuth отмена | Возврат на /auth без ошибки |
| VK OAuth отмена | Возврат на /auth без ошибки |
| Telegram виджет не загрузился | Показать альтернативу (email/Google) |
| Email не подтверждён | Разрешить вход но показать баннер "Подтвердите email" |
| Истёкшая сессия | Redirect на /auth с return URL |
| Заблокированный аккаунт | "Аккаунт заблокирован. Обратитесь в поддержку" |
| Реферальный код не найден | Игнорировать (не показывать ошибку), начислить стандартные 20 айкоинов |
| OAuth без email (VK/Telegram) | Попросить ввести email после первого входа |

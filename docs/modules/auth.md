# Модуль: Auth (Авторизация)

## User Stories
- Регистрация по email+пароль → 20 бесплатных айкоинов
- Вход через Google OAuth
- Неавторизованный видит "Войти" вместо "Профиль" в sidebar

## Таблица
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text DEFAULT '',
  avatar_url text DEFAULT '',
  referral_code text UNIQUE DEFAULT gen_random_uuid()::text,
  referred_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);
-- RLS: SELECT/UPDATE WHERE auth.uid() = id
```

## API
| Метод | Путь | Тело | Ответ | Ошибки |
|-------|------|------|-------|--------|
| POST | /api/auth/signup | `{email, password, name}` | `{user, session}` | 400, 409, 422 |
| POST | /api/auth/login | `{email, password}` | `{user, session}` | 401 |
| POST | /api/auth/google | redirect | `{user, session}` | 500 |
| POST | /api/auth/logout | — | `{success}` | — |

## Edge Cases
- Двойная регистрация → «Email уже используется»
- Истёкшая сессия → редирект /auth с return URL
- Google OAuth отмена → возврат без ошибки

## UI
- `/auth` — форма логина/регистрации с табами
- Sidebar: «Профиль» (авторизован) / «Войти» (не авторизован)

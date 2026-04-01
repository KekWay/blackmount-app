# Модуль: Profile (Профиль пользователя)

---

## Описание
Личный кабинет пользователя. Полноэкранная страница с собственной боковой панелью (не основной sidebar). Содержит настройки аккаунта, баланс, реферальную программу и историю операций. Подписка вынесена на отдельную страницу `/subscription`.

**Текущее хранение:** Zustand persist (localStorage) — stores: auth, balance, subscription.
**TODO:** Миграция на Supabase.

## Статус реализации
- ✅ Боковая панель профиля (desktop + mobile overlay)
- ✅ Вкладка «Профиль» — аватар (буква), имя, email (редактируемые)
- ✅ Вкладка «Пополнить баланс» — 5 пакетов, демо-оплата через PaymentOverlay
- ✅ Вкладка «Реферальная программа» — полная реализация (ссылка, код, уровни, статистика, конвертация, вывод, график, список рефералов, транзакции)
- ✅ Вкладка «История операций» — группировка по дате, поиск, фильтрация, expand/collapse
- ✅ Кнопка «Подписки» → редирект на /subscription
- ✅ Кнопка «Выход» (logout + redirect /auth)
- ✅ Кнопка «Удалить аккаунт» (UI есть, логика заглушечная)
- ✅ Техподдержка / Выйти из всех сеансов (UI кнопки)
- ✅ Мобильная адаптивность (overlay sidebar)
- ❌ Загрузка аватара (используется буква имени)
- ❌ Отображение способа авторизации
- ❌ Дата регистрации
- ❌ Автопродление подписки
- ❌ Серверное хранение (Supabase)
- ❌ API эндпоинты

## Разделы профиля

### 1. Профиль (account)
**Реализовано:**
- Аватар — цветной круг (#b93d3d) с первой буквой имени, не загружаемый
- Имя — редактируемое поле (useState, без сохранения на сервер)
- Email — редактируемое поле (useState)
- Кнопка «Изменить» → раскрывает форму с полями + кнопки «Сохранить» / «Отмена»
- Блок баланса с кнопкой «Пополнить» → переход на вкладку topup
- Блок подписки — если есть: PRO/MAX бейдж, дата, кнопка «Управление»; если нет: CTA «Оформить подписку» с градиентным фоном → /subscription
- Техподдержка (кнопка «Написать» — заглушка)
- Выйти из всех сеансов (кнопка «Завершить» — заглушка)
- Удалить аккаунт (кнопка с иконкой Trash2 — заглушка)

**TODO:**
- Загрузка аватара в Supabase Storage
- Сохранение имени на сервер (PATCH /api/profile)
- Email readonly (привязан к auth)
- Отображение способа авторизации
- Реальное удаление аккаунта (CASCADE)

### 2. Подписки
**Реализовано:** Кнопка в sidebar → `router.push('/subscription')`. Отдельная полноэкранная страница.
Страница подписки: `/src/app/(main)/subscription/page.tsx` → `SubscriptionPageContent`

### 3. Пополнить баланс (topup)
**Реализовано:**
- 5 пакетов: 90/149₽, 220/349₽, 350/499₽, 650/799₽, 1200/1499₽
- Бейдж «Лучший выбор» на пакете 350
- Таблица «Генерации за N айкоинов» (TopupComparisonTable)
- Кнопка «Цены моделей» → PricingInfoOverlay
- PaymentOverlay: форма карты (демо), обработка 2сек, зачисление на баланс

### 4. Реферальная программа (referral)
**Реализовано (полная реализация):**
- Hero-блок: ссылка `blackmount.ai/ref/artur2026`, код `ARTUR2026`, кнопка копирования
- Шаринг: Telegram, VK, Reddit
- Система уровней (4 уровня):
  - Bronze (10%, от 0 рефералов)
  - Silver (15%, от 5 рефералов) — текущий
  - Gold (20%, от 15 рефералов)
  - Diamond (25%, от 50 рефералов)
- Прогресс-бар до следующего уровня
- Реферальный баланс: 1000₽ + кнопки «В айкоины» / «Вывести»
- Статистика: заработано 2500₽, приглашено 12, выведено 1500₽
- График заработка (SVG): день / неделя / месяц
- Список рефералов (5 демо): имя, дата, заработано, статус (active/new/inactive)
- Транзакции: бонусы, выводы, конвертации
- Оверлеи: TierOverlay (система уровней), ConvertOverlay (конвертация в айкоины), WithdrawOverlay (вывод средств)
- Описание: «Как это работает» (3 шага)

**TODO:**
- Подключение к бэкенду (реальные данные)
- Генерация уникальных ссылок
- Начисление бонусов реальным рефералам

### 5. История операций (history)
**Реализовано:**
- Summary: 3 карточки (Потрачено / Пополнено / Операций)
- Фильтры: Все / Пополнения / Расходы (AnimatedToggle)
- Поиск по операциям
- Группировка по дате с expand/collapse
- Каждая операция: иконка модели, название, тип, сумма, время
- Иконки моделей определяются из label операции (getModelIconForLabel)
- Пустое состояние при отсутствии операций

## Боковая панель профиля
**Реализация:** Отдельная sidebar внутри profile/page.tsx (не основной sidebar приложения).

Desktop: фиксированная левая панель 230px, цвет `#181724`.
Mobile: overlay с анимацией translate, backdrop.

Секции:
1. «Настройки аккаунта»: Профиль, Подписки, Пополнить баланс
2. «Финансы»: Реферальная программа, История операций
3. Внизу: кнопка «Выход» (danger стиль)

## Текущее хранение данных

### Auth
Store: `src/stores/auth.ts` (Zustand persist, ключ `auth`)
```typescript
interface AuthState {
  isLoggedIn: boolean
  user: { email: string; name: string } | null
}
```

### Баланс и операции
Store: `src/stores/balance.ts` (Zustand persist, ключ `balance`)
- `balance: number` (по умолчанию 550)
- `operations: OperationItem[]` (демо-данные: 9 операций)
- `genHistory: GenHistoryItem[]` (демо-данные: 23 записи)

### Подписка
Store: `src/stores/subscription.ts` (Zustand persist, ключ `subscription`)
```typescript
interface SubscriptionData {
  tier: 'free' | 'basic' | 'pro' | 'ultra'
  expiresAt: string | null
}
```

## TODO: Таблица Supabase
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
```

## TODO: API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/profile | Получить профиль текущего пользователя |
| PATCH | /api/profile | Обновить имя, аватар |
| POST | /api/profile/avatar | Загрузить аватар |
| DELETE | /api/profile | Удалить аккаунт (с подтверждением) |
| POST | /api/auth/logout | Выйти из системы |

## TODO: Удаление аккаунта
```
1. Пользователь нажимает «Удалить аккаунт»
2. Модальное окно подтверждения
3. Сервер: удалить profile → CASCADE удалит всё связанное
4. Удалить файлы из Supabase Storage
5. supabaseAdmin.auth.admin.deleteUser(userId)
6. Redirect на /auth
```

## UI компоненты
| Файл | Описание |
|------|----------|
| `src/app/(main)/profile/page.tsx` | Страница: sidebar + контент, мобильный overlay |
| `src/components/features/profile/profile-sidebar.tsx` | SidebarItem, SectionLabel |
| `src/components/features/profile/profile-data.ts` | Константы, типы, данные пакетов и планов |
| `src/components/features/profile/account-tab.tsx` | Вкладка «Профиль» (композиция) |
| `src/components/features/profile/account-tab-header.tsx` | Аватар, имя, email, редактирование |
| `src/components/features/profile/account-tab-balance.tsx` | Блок баланса с кнопкой «Пополнить» |
| `src/components/features/profile/account-tab-subscription.tsx` | Блок подписки / CTA |
| `src/components/features/profile/account-tab-extras.tsx` | Поддержка, сеансы, удаление |
| `src/components/features/profile/topup-tab.tsx` | Вкладка «Пополнить баланс» |
| `src/components/features/profile/referral-tab.tsx` | Вкладка «Реферальная программа» (композиция) |
| `src/components/features/profile/referral-hero.tsx` | Hero: ссылка, код, уровни |
| `src/components/features/profile/referral-balance-stats.tsx` | Баланс + статистика |
| `src/components/features/profile/referral-earnings-chart.tsx` | SVG график заработка |
| `src/components/features/profile/referral-how-it-works.tsx` | 3 шага «Как это работает» |
| `src/components/features/profile/referral-list.tsx` | Список рефералов + транзакции |
| `src/components/features/profile/referral-data.ts` | Демо-данные рефералов |
| `src/components/features/profile/referral-tier-overlay.tsx` | Оверлей системы уровней |
| `src/components/features/profile/referral-convert-overlay.tsx` | Оверлей конвертации |
| `src/components/features/profile/referral-withdraw-overlay.tsx` | Оверлей вывода средств |
| `src/components/features/profile/tier-icon.tsx` | Иконка уровня (gradient mask) |
| `src/components/features/profile/tier-ring.tsx` | Кольцо прогресса уровня |
| `src/components/features/profile/history-tab.tsx` | Вкладка «История операций» |
| `src/components/features/profile/history-tab-summary.tsx` | 3 карточки summary |
| `src/components/features/profile/history-tab-group.tsx` | Группа операций по дате |
| `src/components/features/profile/history-tab-utils.ts` | Утилиты: группировка, иконки |
| `src/components/features/profile/plans-comparison-table.tsx` | Таблица сравнения планов |
| `src/components/features/profile/pricing-info-overlay.tsx` | Оверлей «Цены моделей» |
| `src/components/features/profile/all-models-overlay.tsx` | Оверлей всех моделей |

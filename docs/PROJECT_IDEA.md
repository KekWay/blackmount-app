# PROJECT_IDEA.md — Blackmount AI Aggregator

> Документ идеи по методологии Spec-First. Входные данные для генерации спецификации и конфигурации Claude Code.
> Последнее обновление: Апрель 2026.

---

## 1. Проблема

Пользователи в России и СНГ сталкиваются с тремя барьерами при работе с AI-моделями:

- **Фрагментация доступа.** ChatGPT, Claude, Gemini, Midjourney, Kling — 5+ аккаунтов, 5+ подписок, VPN для каждого. Суммарно $100–200/мес.
- **Невозможность сравнения.** Нельзя отправить один промпт в две модели и сравнить. Нет A/B-тестирования.
- **Ценовая непрозрачность.** У каждого сервиса своя система (токены, кредиты, минуты). Пользователь не понимает реальную стоимость.

**Обходные решения:** VPN + подписки ($200+/мес), Telegram-боты, Study24 и SyntX с неполным покрытием.

---

## 2. Решение

**Blackmount** — веб-платформа (AI-агрегатор), 7 нейросетей в едином интерфейсе.

### Процесс пользователя:
1. Регистрация (email/Google/VK/Telegram) → 20 бесплатных айкоинов
2. Библиотека моделей → выбор → чат (текст/изображения/видео)
3. Арена → один промпт, два ответа, голосование
4. Рейтинг моделей на основе голосов
5. Пополнение баланса (пакеты айкоинов) или подписка
6. Библиотека промптов + база знаний

### Модели (7 нейросетей, 30+ версий):

| Категория | Модель | Провайдер | Версии |
|-----------|--------|-----------|--------|
| Текст | ChatGPT | OpenRouter | 5.4, 5.3, 5.2, 5, 5 mini |
| Текст | Claude | OpenRouter | Opus 4.6, Sonnet 4.6, Opus 4.5, Sonnet 4.5, Sonnet 3.7, Haiku 4.5 |
| Текст | Gemini | OpenRouter | 3.1 Pro, 3 Pro, 2.5 Pro, 3 Flash, 2.5 Flash |
| Изображения | NanoBanana | fal.ai | 2 (1K/2K/4K), Pro (1K/2K/4K), стандартная |
| Изображения | Flux | fal.ai | 1.1 Pro Ultra, 1 Pro |
| Видео | Kling | kie.ai | 3.0 Pro, 3.0, 2.6 Pro, 2.6, 2.5 Turbo |
| Видео | Veo 3.1 | kie.ai | Quality, Fast |

---

## 3. Почему сейчас

- Взрывной рост моделей (ChatGPT 5.4, Claude Opus 4.6, Kling 3.0, Veo 3.1) — перегрузка выбором
- Блокировки в РФ → спрос на агрегаторы без VPN
- Рынок агрегаторов формируется — Study24/SyntX показали жизнеспособность
- Снижение стоимости API → маржинальность растёт

---

## 4. Целевая аудитория

### Основная (80%):
| Сегмент | Кто | Задача | Боль |
|---------|-----|--------|------|
| Студенты | 16-25 лет | Рефераты, курсовые, переводы | VPN нестабилен, дорого |
| Контент-мейкеры | 20-35 лет | Тексты, изображения, видео | 3+ подписки, $80+/мес |
| Фрилансеры | 25-40 лет | Контент для клиентов | Переключение, расходы |

### Вторичная (20%):
| Сегмент | Задача |
|---------|--------|
| Разработчики | Тестирование промптов, сравнение моделей |
| Малый бизнес | Маркетинговые материалы |
| Любопытные | Знакомство с AI бесплатно |

---

## 5. Архитектура

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14 App Router)        │
│  TypeScript + Tailwind CSS 4 + shadcn/ui + Zustand   │
│  Главная, Чат, Арена, Рейтинг, Профиль, Подписки,   │
│  История, Промпты, База знаний, Авторизация          │
├─────────────────────────────────────────────────────┤
│              API LAYER (Next.js API Routes)           │
│  /api/chat       → роутинг по провайдерам + streaming│
│  /api/balance    → Supabase RPC                      │
│  /api/arena      → Параллельный запрос 2 моделей     │
│  /api/webhooks   → ЮKassa вебхуки                    │
├─────────────────────────────────────────────────────┤
│              AI ПРОВАЙДЕРЫ                            │
│  OpenRouter  — единый API для текстовых моделей      │
│  fal.ai      — генерация изображений (NanoBanana,    │
│                Flux)                                  │
│  kie.ai      — генерация видео (Kling, Veo)          │
├─────────────────────────────────────────────────────┤
│              BACKEND SERVICES                         │
│  Supabase (Auth + PostgreSQL + RLS + Realtime +      │
│            Storage)                                   │
│  ЮKassa (платежи в рублях)                           │
├─────────────────────────────────────────────────────┤
│              INFRASTRUCTURE                           │
│  Railway (full-stack deploy: frontend + API + jobs)   │
└─────────────────────────────────────────────────────┘
```

### Стек:

| Технология | Зачем |
|-----------|-------|
| Next.js 14 App Router | SSR, API Routes, Server Components |
| TypeScript strict | Типобезопасность |
| Tailwind CSS 4 | Тёмная тема через CSS-переменные |
| shadcn/ui + Radix | Кастомизируемые компоненты |
| Framer Motion | Анимации и переходы |
| Supabase | Auth + PostgreSQL + RLS + Realtime + Storage |
| OpenRouter | Единый API для текстовых AI-моделей |
| fal.ai | API для генерации изображений |
| kie.ai | API для генерации видео |
| Zustand | Легковесный state management |
| ЮKassa | Платежи в рублях |
| Railway | Деплой full-stack (Next.js + background jobs) |

### Дизайн-система:
- Шрифты: Manrope (body), Maven Pro (headings), Bakbak One (accent)
- Тема: тёмная (#121118 фон, #888AE5 акцент, #65DED8 CTA)
- Sidebar: #181724
- Анимации: Framer Motion

### AI-пайплайн:
```
User → /api/chat → [авторизация] → [баланс >= cost?] → [лимит?] → [подписка?]
  → Текст:        OpenRouter API (streaming) → UI
  → Изображения:  fal.ai API (async/sync) → UI
  → Видео:        kie.ai API (async + polling/webhook) → UI
  → [списание айкоинов] → [запись операции] → [инкремент счётчика]
```

---

## 6. Монетизация

### 6.1 Айкоины (1 айкоин = 1₽)

**Текстовые модели (OpenRouter):**

| Модель | Цена (айкоины) | Подписка |
|--------|---------------|----------|
| ChatGPT 5.4 | 6 | subscriptionOnly |
| ChatGPT 5.3 | 5 | subscriptionOnly |
| ChatGPT 5.2 | 5 | subscriptionOnly |
| ChatGPT 5 | 3 | pro |
| ChatGPT 5 mini | 1 | free (бесплатна для Pro/Max) |
| Claude Opus 4.6 | 8 | subscriptionOnly |
| Claude Sonnet 4.6 | 5 | доступна без подписки |
| Claude Opus 4.5 | 8 | subscriptionOnly |
| Claude Sonnet 4.5 | 5 | pro |
| Claude Sonnet 3.7 | 5 | pro |
| Claude Haiku 4.5 | 1.5 | free |
| Gemini 3.1 Pro | 5 | subscriptionOnly |
| Gemini 3 Pro | 5 | pro |
| Gemini 2.5 Pro | 3 | pro |
| Gemini 3 Flash | 1 | free (бесплатна для Pro/Max) |
| Gemini 2.5 Flash | 1 | free (бесплатна для Pro/Max) |

**Изображения (fal.ai):**

| Модель | Цена (айкоины) | Подписка |
|--------|---------------|----------|
| NanoBanana 2 (1K/2K/4K) | 13 / 19 / 26 | subscriptionOnly |
| NanoBanana Pro (1K/2K/4K) | 22 / 22 / 43 | subscriptionOnly |
| NanoBanana (стандартная) | 7 | pro |
| Flux 1.1 Pro Ultra | 15 | subscriptionOnly |
| Flux 1.1 Pro | 7 | pro |

Динамические цены NanoBanana 2 и Pro — через настройку разрешения (1K/2K/4K).

**Видео (kie.ai):**

| Модель | Длит. | Цена (айкоины) | Подписка |
|--------|-------|---------------|----------|
| Kling 3.0 Pro | 5с / 10с | 85 / 170 | subscriptionOnly |
| Kling 3.0 | 5с / 10с | 55 / 110 | subscriptionOnly |
| Kling 2.6 Pro | 5с / 10с | 45–85 / 85–170 | subscriptionOnly |
| Kling 2.6 | 5с / 10с | 45–85 / 85–170 | pro |
| Kling 2.5 Turbo | 5с / 10с | 35 / 65 | pro |
| Veo 3.1 Quality | 8с | 220 | subscriptionOnly |
| Veo 3.1 Fast | 8с | 50 | pro |

Динамические цены Kling — через длительность (5с/10с) + звук.
- Kling 3.0 / 3.0 Pro — звук всегда включён (нет toggle).
- Kling 2.6 / 2.6 Pro — звук опциональный (toggle в настройках, с/без аудио разная цена).
- Kling 2.5 Turbo — звука нет.

### 6.2 Пакеты айкоинов

| Пакет | Цена | Айкоинов |
|-------|------|----------|
| СТАРТ | 149₽ | 90 |
| БАЗОВЫЙ | 349₽ | 220 |
| ПРОДВИНУТЫЙ ⭐ | 499₽ | 350 |
| ПРОФЕССИОНАЛЬНЫЙ | 799₽ | 650 |
| БИЗНЕС 🏆 | 1499₽ | 1200 |

### 6.3 Подписки

| План | Цена/мес | Айкоины/мес | Запросы/день | Скидка | Бесплатные модели | Реф. бонус |
|------|---------|------------|-------------|--------|-------------------|------------|
| Free | 0₽ | 20 (единоразово) | 50 | — | — | 15% |
| Basic | 499₽ | 300 | 100 | 10% | — | 20% |
| Pro ⭐ | 999₽ | 550 | 150 | 15% | ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash | 25% |
| Max | 1799₽ | 1200 | 200 | 20% | ChatGPT 5 mini, Gemini 3 Flash, Gemini 2.5 Flash | 30% |

Все новые модели `subscriptionOnly: true` кроме Claude Sonnet 4.6 (доступна всем без подписки).

### 6.4 Реферальная программа
Бонус от покупок приглашённых: Free 15%, Basic 20%, Pro 25%, Max 30%.
Система уровней: Bronze (15%, от 0 рефералов), Silver (20%, от 5), Gold (25%, от 15), Diamond (30%, от 35).

---

## 7. Конкурентный анализ

| Критерий | **Blackmount** | **SyntX.AI** | **Study24.ai** |
|----------|---------------|-------------|----------------|
| Моделей | 7 (фокус качество) | 90+ (количество) | 11+ |
| Текст | ChatGPT 5.4, Claude 4.6, Gemini 3.1 | +DeepSeek, Grok | +YandexGPT |
| Изображения | NanoBanana 2, Flux | +Midjourney, DALL-E | Midjourney, DALL-E |
| Видео | Kling 3.0, Veo 3.1 | +Hailuo | Kling, Veo |
| Арена сравнения | ✅ | ❌ | ❌ |
| Рейтинг моделей | ✅ (голоса + ELO) | ❌ | ❌ |
| Библиотека промптов | ✅ (30 категорий) | ❌ | Шаблоны |
| База знаний | ✅ (7 моделей) | ❌ | Обучающие |
| Мин. подписка | 499₽/мес | ~$15/мес | ~290₽/мес |
| Telegram-бот | ❌ (v2) | ✅ | ✅ |
| UX/Дизайн | Премиум тёмная тема | Утилитарный | Стандартный |

### Уникальные преимущества:
1. **Арена** — A/B сравнение в реальном времени (нет у конкурентов)
2. **Рейтинг** — органический лидерборд от голосов (ELO-система)
3. **1 айкоин = 1₽** — максимально прозрачно
4. **Премиум UI** — тёмная тема, градиенты, анимации Framer Motion
5. **Промпты + база знаний** — обучение работе с AI
6. **Claude Sonnet 4.6 без подписки** — единственная топовая модель доступна бесплатно

---

## 8. План запуска

### Текущий статус (Апрель 2026):
- [x] Фронтенд готов — 10 страниц, полностью мигрированы с Figma на Next.js 14
- [x] Моковые данные (Zustand + localStorage)
- [x] Дизайн-система (Manrope/Maven Pro/Bakbak One, тёмная тема, Framer Motion)
- [x] Obsidian vault (43 заметки) для управления знаниями
- [ ] Бэкенд — Supabase Auth, RLS, API Routes
- [ ] Платежи — ЮKassa интеграция
- [ ] AI-интеграции — OpenRouter, fal.ai, kie.ai

### MVP (v1.0) — полный функционал:
- [x] Авторизация UI (email + Google + VK + Telegram)
- [x] Главная с библиотекой моделей
- [x] Чат с 7 нейросетями (UI + демо-режим)
- [x] Система айкоинов (UI баланса, пакеты, PaymentOverlay)
- [x] Подписки (Basic/Pro/Max) — UI + гейтинг
- [x] Арена сравнения моделей (2-4 модели)
- [x] Рейтинг моделей (26 версий, spotlight, radar chart)
- [x] Реферальная программа (полный UI: уровни, график, список)
- [x] Библиотека промптов (30 категорий, 18 промптов)
- [x] База знаний (7 моделей, 3-колоночный layout)
- [x] История чатов (текст/фото/видео, фильтрация)
- [x] Профиль + настройки (5 вкладок)
- [x] Горячие клавиши (Cmd+K, навигация)
- [x] Уведомления о генерации (toast + badge)
- [x] Шаринг (Telegram/VK/Reddit + публичная страница)
- [ ] Supabase Auth (Email/Google/VK/Telegram OAuth)
- [ ] Supabase RLS + миграции
- [ ] API Routes + серверная валидация
- [ ] OpenRouter интеграция (streaming)
- [ ] fal.ai интеграция (NanoBanana, Flux)
- [ ] kie.ai интеграция (Kling, Veo)
- [ ] ЮKassa (пакеты + подписки)
- [ ] Rate limiting (серверный)
- [ ] Деплой на Railway
- **Цель:** 500 регистраций, конверсия > 5%, MRR > 50k₽

### v2.0 — расширение:
- [ ] Telegram-бот
- [ ] PWA (мобильное приложение)
- [ ] Новые модели (Midjourney, DALL-E, Grok)
- [ ] API для разработчиков
- **Цель:** 5000 регистраций, MRR > 300k₽

---

## 9. Риски

| Риск | Вероятность | Влияние | Митигация |
|------|------------|---------|-----------|
| OpenRouter изменит цены | Средняя | Высокое | Прямые API-ключи как fallback |
| Блокировка OpenRouter в РФ | Низкая | Критическое | Прокси на Railway |
| Блокировка fal.ai/kie.ai | Низкая | Высокое | Альтернативные провайдеры (Replicate) |
| Низкая конверсия free→paid | Высокая | Высокое | A/B тесты цен, триалы, Claude Sonnet бесплатно |
| Конкуренты снизят цены | Высокая | Среднее | Фокус на Арену и рейтинг |
| DDoS/злоупотребление | Средняя | Среднее | Rate limiting, captcha, серверный лимит |
| Фарминг айкоинов (мульти-аккаунты) | Высокая | Среднее | Лимит регистраций с IP, email confirmation |

---

## 10. Технические детали

### Структура репозитория:
```
blackmount-app/
├── CLAUDE.md                    # Правила для AI-агентов
├── .claude/
│   └── agents/                  # Субагенты (security, code-quality, testing, payments, frontend)
├── docs/
│   ├── PROJECT_IDEA.md          # Этот документ
│   ├── SPECIFICATION.md         # Техническая спецификация
│   ├── modules/                 # Документация модулей (16 файлов)
│   ├── security/                # Безопасность (3 файла)
│   └── integrations/            # Интеграции (5 файлов: openrouter, fal-ai, kie-ai, supabase, yukassa)
├── src/
│   ├── app/(main)/              # Страницы с sidebar (10 страниц)
│   ├── app/(auth)/              # Авторизация
│   ├── app/api/                 # API Routes (TODO)
│   ├── app/share/               # Публичная страница шаринга
│   ├── components/
│   │   ├── ui/                  # shadcn/ui компоненты
│   │   ├── layout/              # Sidebar, MobileSidebar, MobileNav
│   │   ├── features/            # Chat, Home, Arena, Rating, Profile, Subscription,
│   │   │                        # History, Prompts, Knowledge, Auth, Models, Support
│   │   └── shared/              # ErrorScreen, MediaViewer, PaymentOverlay,
│   │                            # SubscriptionGate, AnimatedToggle, ModelIcon,
│   │                            # MarkdownRenderer
│   ├── lib/                     # utils, supabase (client/server), assets, constants
│   ├── stores/                  # Zustand: auth, balance, subscription, favorites,
│   │                            # generation, chat-sessions, request-limiter, shared, arena-guard, support
│   ├── types/                   # TypeScript: models, chat, subscription
│   └── data/                    # Данные: ai-models, arena-models, leaderboard, trending
├── public/assets/models/        # Изображения моделей и UI
├── ../blackmount-vault/         # Obsidian Knowledge Vault (43 заметки)
└── supabase/migrations/         # SQL-миграции (TODO)
```

### Ключевые таблицы Supabase:
```sql
profiles       (id uuid PK, email, name, avatar_url, referral_code, referred_by, is_blocked, created_at)
balances       (user_id uuid PK, coins int DEFAULT 20, updated_at)
operations     (id uuid PK, user_id, type, amount, label, model_id, version_id, created_at)
subscriptions  (id uuid PK, user_id, tier, starts_at, expires_at, is_active, auto_renew, created_at)
chat_sessions  (id uuid PK, user_id, model_id, version_id, title, created_at, updated_at)
messages       (id uuid PK, session_id, role, content, media_type, media_url, cost_coins, created_at)
arena_votes    (id uuid PK, user_id, prompt, model_a, response_a, model_b, response_b, winner, created_at)
model_ratings  (model_id text PK, wins, losses, ties, total_votes, elo_score)
referrals      (id uuid PK, referrer_id, referred_id, bonus_percent, total_earned, created_at)
daily_requests (id uuid PK, user_id, date, count)
favorite_models(user_id, model_id — composite PK)
shared_items   (id text PK, user_id, type, model_id, prompt, response, media_url, is_active, views_count, created_at)
security_logs  (id uuid PK, user_id, action, ip_address, details, created_at)
```

### Веб-поиск (TODO — бэкенд)

Тогл "Веб-поиск" уже есть в UI (webSearchActive). OpenRouter предоставляет веб-поиск из коробки для ВСЕХ текстовых моделей.

Способы активации:
1. Добавить `:online` к slug модели (например `anthropic/claude-sonnet-4.6:online`)
2. Использовать `openrouter:web_search` server tool (рекомендуется — модель сама решает когда искать)

Стоимость: $4 за 1000 результатов (по умолчанию 5 = ~$0.02 за запрос).
- Anthropic, OpenAI — нативный поиск провайдера
- Остальные — через Exa

Веб-поиск доступен для ВСЕХ текстовых моделей ниже. Не применим к image/video моделям (NanoBanana, Flux, Kling, Veo).

Бэкенд-логика:
1. Пользователь включает тогл → webSearchActive = true
2. API route добавляет web_search tool или `:online` к slug
3. OpenRouter выполняет поиск и добавляет результаты в контекст
4. Модель отвечает с учётом найденной информации

Ценообразование: +0.5–1 айкоин к базовой цене запроса.

### Режим думанья / Thinking (TODO — бэкенд)

Тогл "Глубокое исследование" в UI (deepResearchActive). OpenRouter предоставляет единый параметр `reasoning` для управления thinking.

#### Полная таблица поддержки:

**ChatGPT (OpenRouter):**
| Версия | Thinking | Механизм | Effort |
|--------|---------|----------|--------|
| ChatGPT 5.4 | ✅ | Reasoning tokens (GPT-5 серия) | none, low, medium, high |
| ChatGPT 5.3 | ✅ | Adaptive reasoning | none, low, medium, high |
| ChatGPT 5.2 | ✅ | Adaptive reasoning | none, low, medium, high |
| ChatGPT 5 | ✅ | Dynamic reasoning ("think hard about this") | low, medium, high |
| ChatGPT 5 Mini | ✅ | Reasoning (наследник o4-mini) | low, medium, high |

**Claude (OpenRouter):**
| Версия | Thinking | Механизм | Effort |
|--------|---------|----------|--------|
| Claude Opus 4.6 | ✅ | Adaptive Thinking (сам решает глубину) | low, medium, high, max |
| Claude Sonnet 4.6 | ✅ | Adaptive Thinking | low, medium, high, max |
| Claude Opus 4.5 | ✅ | Extended Thinking (budget_tokens) | low, medium, high |
| Claude Sonnet 4.5 | ✅ | Extended Thinking (budget_tokens) | low, medium, high |
| Claude Sonnet 3.7 | ✅ | Extended Thinking (:thinking вариант) | low, medium, high |
| Claude Haiku 4.5 | ✅ | Extended Thinking (первый Haiku с thinking) | low, medium, high |

**Gemini (OpenRouter):**
| Версия | Thinking | Механизм | Effort |
|--------|---------|----------|--------|
| Gemini 3.1 Pro | ✅ | thinkingLevel (через reasoning.effort) | low, medium, high |
| Gemini 3 Pro | ✅ | thinkingLevel (нельзя отключить thinking) | low, high |
| Gemini 2.5 Pro | ✅ | thinkingBudget (старый API) | low, medium, high |
| Gemini 3 Flash | ✅ | thinkingLevel | minimal, low, medium, high |
| Gemini 2.5 Flash | ✅ | thinkingBudget | low, medium, high |

Итого: ВСЕ 16 версий текстовых моделей поддерживают thinking через OpenRouter.

Бэкенд-логика:
1. Пользователь включает тогл → deepResearchActive = true
2. API route добавляет `reasoning: { effort: "high" }` в запрос
3. OpenRouter передаёт параметр провайдеру нативно
4. API возвращает: reasoning_details[] (рассуждение) + content (ответ)
5. Фронтенд: reasoning → сворачиваемый блок "Ход мысли", content → MarkdownRenderer

Особенности по провайдерам:
- Claude 4.6 (Opus/Sonnet): Adaptive Thinking по умолчанию, effort "max" только для них
- Claude 4.5 и старше: budget_tokens, effort "max" не поддерживается
- ChatGPT 5.2+: effort "none" доступен (отключает thinking полностью)
- Gemini 3 Pro: thinking нельзя отключить (минимум "low")

UI компонент (TODO — фронтенд):
- Сворачиваемый блок перед ответом assistant
- Заголовок: "Ход мысли" с иконкой Brain
- Текст thinking приглушённым цветом rgba(255,255,255,0.4)
- По умолчанию свёрнут
- Анимация раскрытия (Framer Motion)

Ценообразование: thinking-токены = output-токены. Запрос с thinking стоит дороже.

Не применимо к: NanoBanana, Flux (fal.ai — изображения), Kling, Veo (kie.ai — видео).

### Страницы приложения (10):
| Страница | Путь | Описание |
|----------|------|----------|
| Главная | `/` | Библиотека моделей, trending, промпты, новости |
| Чат | `/chat/[modelId]` | Чат с выбранной моделью (текст/фото/видео) |
| Арена | `/arena` | A/B сравнение 2-4 моделей |
| Рейтинг | `/rating` | Лидерборд, spotlight, radar chart, сравнение |
| Промпты | `/prompts` | 30 категорий, 18+ промптов, фильтрация |
| База знаний | `/knowledge` | 7 моделей, 3-колоночный layout |
| История | `/history` | Текст/фото/видео, фильтрация по моделям |
| Профиль | `/profile` | 5 вкладок: аккаунт, пополнение, реферальная, история операций |
| Подписки | `/subscription` | 3 плана, сравнительная таблица |
| Поддержка | `/support` | Чат с поддержкой, тикеты, история обращений |
| Авторизация | `/auth` | Email/Google/VK/Telegram |
# CLAUDE.md — Blackmount AI Aggregator

## Проект
Русскоязычный AI-агрегатор: 7 нейросетей (ChatGPT, Claude, Gemini, NanoBanana, Flux, Kling, Veo 3.1) в едином интерфейсе.
Монетизация: айкоины (1₽=1) + подписки (Free/Basic 499₽/Pro 999₽/Max 1799₽). Деплой: Railway.
Текущее состояние: фронтенд готов (10 страниц), моковые данные Zustand, бэкенд не подключён.

## Стек
Next.js 14 App Router · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Zustand · Supabase (Auth+DB+RLS) · OpenRouter · fal.ai · kie.ai · ЮKassa · Railway

## Документация
При выполнении задачи — ПРОЧИТАЙ нужный файл перед началом работы.

### Модули (docs/modules/)
- auth.md — авторизация (Email/Google/VK/Telegram OAuth)
- chat.md — чат с моделями
- balance.md — айкоины, пакеты
- subscription.md — подписки, гейтинг
- arena.md — сравнение моделей
- referral.md — реферальная программа
- history.md — история чатов
- profile.md — профиль пользователя
- rating.md — рейтинг моделей
- prompts.md — промпт-каталог
- knowledge.md — база знаний
- favorites.md — избранное
- sharing.md — шаринг
- notifications.md — уведомления
- file-storage.md — файлы
- keyboard-shortcuts.md — горячие клавиши

### Безопасность (docs/security/)
- SECURITY.md — общие правила
- api-security.md — защита API
- auth.md — авторизация и OAuth

### Интеграции (docs/integrations/)
- openrouter.md — текстовые модели (ChatGPT, Claude, Gemini)
- fal-ai.md — изображения (NanoBanana, Flux)
- kie-ai.md — видео (Kling, Veo)
- supabase.md — таблицы, RLS
- yukassa.md — платежи

### Агенты (.claude/agents/)
- security-agent.md — проверка безопасности
- code-quality.md — качество кода
- testing.md — тестирование
- payments.md — платежи
- frontend.md — дизайн-система

### Проект
- docs/PROJECT_IDEA.md — идея, аудитория, конкуренты, план
- docs/models/MODEL_REGISTRY.md — реестр моделей (источник правды)
- docs/MIGRATION_PLAN.md — план миграций Supabase
- docs/ENV_TEMPLATE.md — переменные окружения

### Качество кода
- docs/code-rules.md — правила чистого кода (ОБЯЗАТЕЛЬНО прочитать перед любым изменением кода)

### Ключевые документы (обязательно к прочтению)
- docs/models/MODEL_REGISTRY.md — единый реестр всех 32 моделей, цен, API-маппингов, тиров
- docs/MIGRATION_PLAN.md — 22 миграции Supabase в правильном порядке
- docs/ENV_TEMPLATE.md — все переменные окружения (серверные и клиентские)

## Архитектура
```
src/app/(main)/          — страницы с sidebar
src/app/(auth)/          — авторизация
src/app/api/             — API routes
src/components/ui/       — shadcn/ui
src/components/layout/   — Sidebar, MobileNav
src/components/features/ — Chat, Home, Arena, Rating, Profile, Subscription
src/components/shared/   — ErrorScreen, MediaViewer, PaymentOverlay
src/lib/                 — utils, supabase, assets, constants
src/stores/              — auth, balance, subscription, request-limiter
src/types/               — типы
src/data/                — моковые данные (ai-models, arena, leaderboard, trending)
```

## Нейросети и модели
7 нейросетей, 32 версии. Цены в айкоинах (1 айкоин = 1₽). Полный реестр: docs/models/MODEL_REGISTRY.md.

ChatGPT (OpenRouter): 5.4 (6₽), 5.3 (5₽), 5.2 (5₽), 5 (3₽), 5 mini (1₽)
Claude (OpenRouter): Opus 4.6 (8₽), Sonnet 4.6 (5₽, доступна без подписки), Opus 4.5 (8₽), Sonnet 4.5 (5₽), Sonnet 3.7 (5₽), Haiku 4.5 (1.5₽)
Gemini (OpenRouter): 3.1 Pro (5₽), 3 Pro (5₽), 2.5 Pro (3₽), 3 Flash (1₽), 2.5 Flash (1₽)
NanoBanana (fal.ai): NanoBanana 2 (13/19/26₽ — 1K/2K/4K), Pro (22/22/43₽ — 1K/2K/4K), оригинал (7₽)
Flux (fal.ai): 2 Pro (5₽), 1.1 Pro Ultra (15₽), 1 Pro (7₽), 1 Dev (4₽)
Kling (kie.ai): 3.0 Pro (85/170₽), 3.0 (55/110₽), 2.6 Pro (45-170₽), 2.6 (45-170₽), 2.5 Turbo (35/65₽)
Veo 3.1 (kie.ai): Quality (220₽), Fast (50₽)


Динамические цены: Kling через настройки длительности (5с/10с) + звук. NanoBanana 2 и Pro через разрешение (1K/2K/4K).
Kling 3.0/3.0 Pro — звук всегда включён. Kling 2.6/2.6 Pro — звук опциональный. Kling 2.5 Turbo — звука нет.

## Правила
- Max 150 строк → разбивай. 'use client' только при hooks/events
- Именованный экспорт. TypeScript strict, no `any`
- next/image, next/link, Tailwind ONLY, @supabase/ssr
- Визуал из ../blackmount-old/ — копируй className БУКВАЛЬНО
- GPT всегда пишется ChatGPT (ChatGPT 5.4, не GPT-5.4)
- Описания моделей — 2-3 слова по смыслу

## Дизайн-токены
Фон: #121118 · Акцент: #888AE5 · CTA: #65DED8 · Sidebar: #181724
Шрифты: Manrope (body) · Maven Pro (headings) · Bakbak One (accent)

## Запрещено
❌ figma:asset · ../../imports/ · data-name · any · console.log · >150 строк
⚠️ style={{}} — избегать, но допустимо для dynamic gradients, mask-image, CSS custom properties

## Obsidian Knowledge Vault
Хранилище знаний: ../blackmount-vault/

### При старте сессии
1. Прочитай 00-home/index.md
2. Прочитай 00-home/текущие приоритеты.md
3. Если задача касается конкретного модуля — прочитай заметку из knowledge/

### При завершении (пользователь говорит "сохрани сессию")
1. Создай заметку в sessions/ с датой и кратким описанием
2. Обнови текущие приоритеты.md
3. Если принято решение — создай заметку в knowledge/decisions/
4. Если найден и решён баг — создай в knowledge/debugging/
5. Обнови index.md если добавлены новые заметки

## Git
- После каждого промпта: `git add -A && git commit -m "..." && git push origin main`
- Перед коммитом: запусти `/code-review` для проверки качества
- Перед коммитом: `npx vitest run` для проверки бизнес-логики
- Перед коммитом: запусти `bash scripts/integrity-check.sh` для проверки целостности данных
- Формат коммита: `type: описание` (fix, feat, refactor, docs, a11y, cleanup, vault)
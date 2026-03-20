# CLAUDE.md — Blackmount AI Aggregator

## Проект
AI-агрегатор: 8 моделей (ChatGPT, Claude, Gemini, NanoBanana, Flux, Sora, Kling, Veo) в едином интерфейсе.
Монетизация: айкоины (1₽=1), подписки (Free/Basic 499₽/Pro 999₽/Max 1799₽). Деплой: Railway.

## Стек
Next.js 14 App Router · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Zustand · Supabase (Auth+DB+RLS) · OpenRouter · Railway

## Архитектура
```
src/app/(main)/          — страницы с sidebar
src/app/(auth)/          — авторизация
src/app/api/             — chat proxy, balance, arena, webhooks
src/components/ui/       — shadcn/ui
src/components/layout/   — Sidebar, Header, MobileNav
src/components/features/ — Chat, Home, Arena, Rating, Profile, Subscription
src/components/shared/   — ErrorScreen, MediaViewer, PaymentOverlay, SubscriptionGate
src/lib/                 — utils, supabase/{client,server}, assets, constants
src/stores/              — auth, balance, subscription, request-limiter
src/types/               — models, chat, subscription
src/data/                — ai-models, trending
docs/                    — PROJECT_IDEA.md, SPECIFICATION.md
.claude/agents/          — субагенты (database, backend, frontend, qa)
.claude/rules/           — контекстные правила
```

## Источник кода — Figma Make
Проект сгенерирован Figma Make. При работе с ЛЮБЫМ файлом:
- Нет `figma:asset/` → MODEL_ASSETS из @/lib/assets
- Нет `../../imports/` → создавай компоненты заново
- Нет `style={{}}` → Tailwind
- Нет `data-name` → удаляй
- Нет абсолютных px → flex/grid
- Нет `react-router` → next/navigation, next/link

## Конвертация
```
figma:asset/HASH.png     → <Image src={MODEL_ASSETS[id].logo} />
useNavigate()            → useRouter() из next/navigation
<Link to="/">            → <Link href="/"> из next/link
mask-image иконки        → Lucide (Share2, Mic, etc.)
8×CardModel              → 1×ModelCard с пропсом model
font-['Manrope:Bold']   → font-manrope font-bold
```

## Правила
- Max 150 строк/компонент. Больше → разбивай
- 'use client' ТОЛЬКО при useState/useEffect/onClick
- Именованный экспорт: `export function Component()`
- TypeScript strict, никакого `any`
- `<Image>` из next/image, `<Link>` из next/link
- Tailwind ONLY (кроме dynamic gradient)
- Mobile-first: base → md: → lg:
- Supabase ТОЛЬКО через @supabase/ssr

## Дизайн-токены
```
Фон: #121118  Текст: #fff  Card: rgba(255,255,255,0.05)  Border: rgba(255,255,255,0.1)
Акцент: #888AE5  CTA: #65DED8  Sidebar: #181724
Шрифты: Manrope (body) · Maven Pro (headings) · Bakbak One (accent)
```

## Монетизация
```
Free:  20 айкоинов + 50 запросов/день + реф 15%
Basic: 499₽/мес · 350 айкоинов · 100/день · скидка 10% · реф 20%
Pro:   999₽/мес · 600 айкоинов · 150/день · скидка 10% · реф 25% · бесплатно GPT-5 mini + Gemini Flash
Max:   1799₽/мес · 1200 айкоинов · 200/день · скидка 15% · реф 30% · бесплатно GPT-5 mini + Gemini Flash
```

## Запрещено
❌ figma:asset · ../../imports/ · data-name · any · style={{}} · <img> · <a href>
❌ console.log · >150 строк · px из Figma · кириллица в именах · useEffect для fetch

## Документация
docs/PROJECT_IDEA.md — идея, конкуренты, монетизация, архитектура
docs/SPECIFICATION.md — таблицы БД, API endpoints, UI компоненты, edge cases
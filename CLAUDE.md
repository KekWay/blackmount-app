# CLAUDE.md — Blackmount AI Aggregator

## Проект
AI-агрегатор: 8 моделей (ChatGPT, Claude, Gemini, NanoBanana, Flux, Sora, Kling, Veo) в едином интерфейсе.
Монетизация: айкоины (1₽=1) + подписки (Free/Basic/Pro/Max). Деплой: Railway.

## Стек
Next.js 14 App Router · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Zustand · Supabase (Auth+DB+RLS) · OpenRouter · Railway

## Документация (читай только нужный модуль)
- docs/PROJECT_IDEA.md — идея, аудитория, конкуренты, план
- docs/modules/auth.md — авторизация
- docs/modules/chat.md — чат с моделями
- docs/modules/balance.md — айкоины, пакеты
- docs/modules/subscription.md — подписки, гейтинг
- docs/modules/arena.md — сравнение моделей
- docs/modules/referral.md — реферальная программа
- docs/integrations/openrouter.md — текстовые модели (ChatGPT, Claude, Gemini)
- docs/integrations/fal-ai.md — генерация изображений (NanoBanana, Flux)
- docs/integrations/kie-ai.md — генерация видео (Sora, Kling, Veo)
- docs/integrations/supabase.md — таблицы, RLS
- docs/integrations/yukassa.md — платежи

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
src/types/ · src/data/   — типы и данные
```

## Правила
- Max 150 строк → разбивай. 'use client' только при hooks/events
- Именованный экспорт. TypeScript strict, no `any`
- next/image, next/link, Tailwind ONLY, @supabase/ssr
- Визуал из ../blackmount-old/ — копируй className БУКВАЛЬНО

## Дизайн-токены
Фон: #121118 · Акцент: #888AE5 · CTA: #65DED8 · Sidebar: #181724
Шрифты: Manrope (body) · Maven Pro (headings) · Bakbak One (accent)

## Запрещено
❌ figma:asset · ../../imports/ · data-name · any · style={{}} · console.log · >150 строк


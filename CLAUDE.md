# CLAUDE.md — Blackmount AI Aggregator

## О проекте

AI-агрегатор нейросетей. Пользователи могут пробовать и сравнивать AI-модели (ChatGPT, Claude, Gemini, Flux, Sora, Kling, Veo, NanoBanana) через единый интерфейс. Монетизация через систему монет (coins) и подписки.

**Стек:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Railway
**Дизайн:** Тёмная тема, шрифты Manrope + Maven Pro, акцентные градиенты

---

## 🔴 КРИТИЧЕСКИЕ ПРАВИЛА

### Источник кода — Figma Make

Этот проект изначально сгенерирован через Figma Make. Весь код требует полной переработки.

**ЗАПРЕЩЕНО оставлять в продакшн-коде:**
- `figma:asset/HASH.png` — эти импорты не работают вне Figma Make → заменяй на `/assets/filename.png`
- Файлы из `src/imports/` — это сырой выход Figma Make с бессмысленными именами (Group35-182-751.tsx, Container-392-3500.tsx, ЗакрепленныйЧатНейросетей-388-3073.tsx) → НИКОГДА не импортируй из этой папки, создавай новые компоненты
- `data-name="Container"` — Figma-атрибуты, удаляй
- `style={{ maskImage: url('...'), WebkitMaskImage: ... }}` — паттерн mask-icon из Figma Make → заменяй на SVG-компоненты или Lucide иконки
- Абсолютное позиционирование с пиксельными координатами (`left-[86.2px] top-[25.2px]`) → заменяй на flex/grid

### При работе с любым файлом — всегда проверяй:
1. Нет ли `figma:asset` импортов
2. Нет ли импортов из `../../imports/`
3. Нет ли inline стилей `style={{}}`
4. Нет ли абсолютных px-позиций из Figma

---

## Архитектура

```
src/
├── app/
│   ├── (main)/                    # Основной layout с sidebar
│   │   ├── page.tsx               # Главная
│   │   ├── chat/[modelId]/page.tsx
│   │   ├── rating/page.tsx
│   │   ├── arena/page.tsx
│   │   ├── history/page.tsx
│   │   ├── prompts/page.tsx
│   │   ├── knowledge/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx             # Sidebar + Header wrapper
│   ├── (auth)/
│   │   └── auth/page.tsx
│   ├── api/                       # API routes (OpenRouter proxy, webhooks)
│   ├── layout.tsx                 # Root layout (fonts, providers)
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn/ui атомарные компоненты
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   ├── features/
│   │   ├── chat/                  # 10+ подкомпонентов чата
│   │   ├── models/                # ModelCard, ModelGrid
│   │   ├── home/                  # Секции главной страницы
│   │   ├── arena/                 # Арена сравнения моделей
│   │   ├── rating/                # Лидерборд
│   │   ├── profile/               # Секции профиля
│   │   └── subscription/          # Тарифные планы
│   └── shared/                    # ErrorScreen, MediaViewer, SkeletonLoader
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── utils.ts                   # cn()
│   ├── constants.ts
│   └── assets.ts                  # Маппинг ассетов моделей
├── hooks/
│   ├── use-auth.ts
│   ├── use-balance.ts
│   └── use-subscription.ts
├── types/
│   ├── models.ts                  # AIModel, ModelVersion
│   ├── chat.ts                    # Message, ChatSession
│   └── subscription.ts           # Tier, Balance
├── stores/                        # Zustand
│   ├── balance.ts
│   ├── subscription.ts
│   ├── auth.ts
│   └── theme.ts
└── data/
    └── ai-models.ts              # Конфигурация всех AI моделей
```

---

## Маппинг: старые файлы → новые

| Старый файл (Figma Make) | Новое расположение | Размер | Действие |
|---|---|---|---|
| `components/home-page.tsx` | `features/home/` (6 файлов) | 680 строк | Разбить |
| `components/chat-page.tsx` | `features/chat/` (10 файлов) | 1977 строк | Разбить |
| `components/profile-page.tsx` | `features/profile/` (7 файлов) | 2027 строк | Разбить |
| `components/arena-page.tsx` | `features/arena/` (3 файла) | 839 строк | Разбить |
| `components/rating-page.tsx` | `features/rating/` (3 файла) | 780 строк | Разбить |
| `components/subscription-page.tsx` | `features/subscription/` (3 файла) | 622 строк | Разбить |
| `components/layout.tsx` + `layout-shell.tsx` | `layout/` (3 файла) | 643 строк | Переписать |
| `components/ai-models-data.tsx` | `data/ai-models.ts` + `types/models.ts` | 188 строк | Рефакторинг |
| `components/ui/*` | `components/ui/*` | ~50 файлов | Перенести as-is |
| `imports/Card*.tsx` (8 файлов) | `features/models/model-card.tsx` | 1 файл | Объединить |
| `imports/Group*.tsx, Container*.tsx, etc.` | ❌ УДАЛИТЬ | ~140 файлов | Удалить |
| `imports/svg-*.ts` | `components/icons/` | ~60 файлов | Извлечь SVG |

---

## Конвертация типичных паттернов Figma Make

### Mask-image иконки → SVG-компоненты
```tsx
// ❌ Figma Make выход
<div style={{
  width: 24, height: 24,
  backgroundColor: "currentColor",
  maskImage: `url('${imgShareMask}')`,
  WebkitMaskImage: `url('${imgShareMask}')`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
}} />

// ✅ Продакшн
import { Share2 } from 'lucide-react'
<Share2 className="size-6 text-current" />
// Если нет в Lucide — создай SVG компонент
```

### Абсолютные координаты → Flex/Grid
```tsx
// ❌ Figma Make
<div className="absolute left-[86.2px] top-[25.2px] w-[1053px] h-[19px]">
  <p className="absolute font-['Manrope'] left-[52px] top-[51px]">ChatGPT</p>
</div>

// ✅ Продакшн
<div className="flex items-center gap-3 px-4 py-2">
  <p className="font-manrope text-base">ChatGPT</p>
</div>
```

### figma:asset → public/assets/
```tsx
// ❌ Figma Make
import imgLogo from "figma:asset/e4ed614bc725465a9064a38e53c100a7a89134ee.png";

// ✅ Продакшн
import Image from 'next/image'
<Image src="/assets/logo.png" alt="Logo" width={40} height={40} />
```

### 8 одинаковых Card компонентов → 1 универсальный
```tsx
// ❌ Figma Make — 8 отдельных файлов
import CardChatGpt from "../../imports/CardChatGpt"
import CardClaude from "../../imports/CardClaude"
import CardGemini from "../../imports/CardGemini"
// ...

// ✅ Продакшн — один компонент
import { ModelCard } from '@/components/features/models/model-card'
{models.map(model => <ModelCard key={model.id} model={model} />)}
```

### react-router → Next.js
```tsx
// ❌ Старый
import { useNavigate, useParams } from "react-router"
const navigate = useNavigate()
navigate('/chat/claude')

// ✅ Next.js
import { useRouter, useParams } from "next/navigation"
const router = useRouter()
router.push('/chat/claude')
```

---

## Дизайн-токены (из theme.css проекта)

```css
/* Тёмная тема — основная */
--background: #121118;
--foreground: #ffffff;
--card: rgba(255, 255, 255, 0.05);
--border: rgba(255, 255, 255, 0.1);
--muted-foreground: rgba(255, 255, 255, 0.5);

/* Акцентные цвета моделей */
--chatgpt-gradient: linear-gradient(120deg, #4BDB52, #94B985);
--claude-gradient: linear-gradient(120deg, #D4A574, #C8956B);
--gemini-gradient: linear-gradient(120deg, #4285F4, #34A853);
--primary-accent: #888AE5;  /* Фиолетовый акцент бренда */
--teal-accent: #65DED8;     /* Бирюзовый для CTA */
```

**Шрифты:**
- Manrope — основной текстовый шрифт (weight: 200-800)
- Maven Pro — для заголовков карточек (weight: 400-900)
- Bakbak One — для акцентных/декоративных элементов

---

## Правила компонентов

- Максимум 150 строк на компонент. Если больше — разбивай
- `'use client'` — только если есть useState/useEffect/onClick
- По умолчанию всё — Server Components
- Именованный экспорт: `export function ModelCard()`, НЕ `export default`
- TypeScript strict — никакого `any`
- `<Image>` из `next/image`, `<Link>` из `next/link`
- Tailwind ONLY — никаких inline стилей (кроме динамических gradient)
- Mobile-first responsive: базовый → `md:` → `lg:`

---

## Переменные окружения

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Blackmount
```

---

## Запрещено

- ❌ Импорты из `src/imports/` или `../../imports/`
- ❌ `figma:asset/` в любой форме
- ❌ `data-name` атрибуты
- ❌ `any` в TypeScript
- ❌ `style={{}}` inline стили
- ❌ `<img>` вместо `<Image>`
- ❌ `<a>` вместо `<Link>`
- ❌ `console.log` в продакшн коде
- ❌ Компоненты длиннее 150 строк
- ❌ Абсолютные px-позиции из Figma без причины
- ❌ Кириллические имена файлов
- ❌ Числовые ID в именах файлов (Container-392-3500)
- ❌ `useEffect` для data fetching — Server Components или React Query
- ❌ `@supabase/supabase-js` напрямую — только через `@supabase/ssr`
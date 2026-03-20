# Coding Conventions

**Analysis Date:** 2026-03-20

## Naming Patterns

**Files:**
- kebab-case for all source files: `chat-container.tsx`, `model-card.tsx`, `balance-section.tsx`
- Feature directories group related components: `features/chat/`, `features/home/`, `features/profile/`
- Store files match their domain: `auth.ts`, `balance.ts`, `subscription.ts`, `request-limiter.ts`
- Data files use descriptive names: `ai-models.ts`, `arena-models.ts`, `trending.ts`

**Components:**
- PascalCase named exports: `export function ChatContainer()`, `export function ModelCard()`
- Next.js page/layout files use `export default function`: `export default function HomePage()`
- Page-level defaults named with `Page` suffix: `HomePage`, `ArenaPage`, `ProfilePage`, `AuthPage`
- Layout defaults named with `Layout` suffix: `MainLayout`, `RootLayout`

**Functions:**
- camelCase handlers with `handle` prefix: `handleSend`, `handleGenerate`, `handleReset`, `handleVote`, `handleModelSwitch`
- Toggle functions with `toggle` prefix: `togglePin`, `toggleRecording`, `toggleModel`
- Boolean state setters passed as props use `set` prefix: `setInput`, `setMessages`, `setIsGenerating`

**Variables:**
- camelCase for all local variables and state
- SCREAMING_SNAKE_CASE for module-level constants: `DEFAULT_BALANCE`, `FREE_LIMIT`, `SUB_LIMIT`, `MOCK_RESPONSES`
- SCREAMING_SNAKE_CASE for exported constants: `LOCKED_MODEL_IDS`, `LOCKED_VERSION_IDS`, `NAV_ITEMS`, `APP_ASSETS`, `MODEL_ASSETS`
- Config lookup tables typed as `Record<string, ...>` named with `_MAP` or `_CONFIG` suffix: `CARD_CONFIGS`, `ICON_MAP`, `CATEGORY_LABELS`, `ERROR_CONFIG`

**Types/Interfaces:**
- PascalCase interfaces with `Props` suffix for component props: `ModelCardProps`, `ErrorScreenProps`, `ChatInputProps`
- PascalCase interfaces without suffix for domain models: `User`, `BalanceState`, `SubscriptionState`, `Message`, `ChatSession`
- Union string types use `type` keyword: `type Phase = 'idle' | 'generating' | 'voting' | 'winner'`
- Types exported from domain files, re-exported through `src/types/index.ts` barrel

**Stores:**
- Hook-style exports: `useAuthStore`, `useBalanceStore`, `useSubscriptionStore`, `useRequestLimiterStore`
- Separate interface for state shape: `AuthState`, `BalanceState`, `SubscriptionState`, `RequestLimiterState`

## Code Style

**Formatting:**
- Prettier 3.x with `prettier-plugin-tailwindcss` for class sorting
- Single quotes for all strings: `'use client'`, `'@/stores/auth'`
- Semicolons present at statement ends
- 2-space indentation

**Linting:**
- ESLint 9 via `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Config: `eslint.config.mjs`
- TypeScript strict mode: `"strict": true` in `tsconfig.json`
- No `any` — all types are explicit

## Import Organization

**Order (consistent across files):**
1. React hooks: `import { useState, useEffect, useRef } from 'react'`
2. Next.js: `import { useRouter } from 'next/navigation'`, `import Image from 'next/image'`, `import Link from 'next/link'`
3. Third-party libraries: `import { Sparkles } from 'lucide-react'`
4. Internal data/lib: `import { aiModels } from '@/data/ai-models'`
5. Internal stores: `import { useBalanceStore } from '@/stores/balance'`
6. Internal types (type-only imports): `import type { AIModel } from '@/types'`
7. Internal components (same feature first, then cross-feature): `import { ModelCard } from '@/components/features/models/model-card'`

**Path Aliases:**
- `@/*` maps to `./src/*` — use for all cross-directory imports
- Relative imports only for same-directory siblings: `import { VersionDropdown } from './version-dropdown'`

## Client vs Server Directives

**`'use client'` placed at top of file (before all imports) when component uses:**
- `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`
- `useRouter`, `usePathname`, `useParams`, `useSearchParams`
- Event handlers attached to elements (`onClick`, `onChange`, `onSubmit`)
- All feature components, layout components, and shared interactive components are client components

**`'use client'` absent on:**
- `src/app/(main)/layout.tsx` — pure server layout wrapping client children
- `src/app/(main)/arena/page.tsx` — thin server wrapper delegating to `<ArenaBattle />`
- `src/app/(main)/chat/[modelId]/page.tsx` — thin server wrapper
- `src/lib/supabase/server.ts` — server-only Supabase client

## Error Handling

**Patterns:**
- localStorage/`JSON.parse` always wrapped in `try { } catch { /* empty */ }` — silently swallowed for non-critical storage reads
- Async clipboard operations use `.catch(() => {})` to suppress failures
- `copyToClipboard()` in `src/lib/utils.ts` returns `boolean` — callers check return value
- Next.js error boundary at `src/app/(main)/error.tsx` delegates to `ErrorScreen` component
- `ErrorScreen` in `src/components/shared/error-screen.tsx` supports typed variants: `'network' | 'server' | 'notfound' | 'generic'`
- Supabase cookie `setAll` silences server component errors with explanatory comment in `src/lib/supabase/server.ts`
- No `throw` statements in component code — errors handled defensively through UI state flags

**Guard pattern for user actions (early return chain):**
```typescript
const handleSend = () => {
  if (!input.trim()) return
  if (!isLoggedIn) { setShowAuthGate(true); return }
  if (modelLocked) { router.push('/profile?tab=subscription'); return }
  if (!useRequestLimiterStore.getState().canMakeRequest()) { setShowLimitReached(true); return }
  // ... proceed with action
}
```

## State Management

**Zustand stores (`src/stores/`):**
- Always typed with an explicit state interface before `create<StateInterface>()`
- All stores use `persist` middleware with a unique localStorage `name` key
- Store methods defined inline with `(set, get) => ({})` factory pattern
- Direct `.getState()` calls for non-reactive reads inside event handlers: `useBalanceStore.getState().balance`
- Selector functions for reactive reads in components: `useBalanceStore((s) => s.balance)`
- Avoid subscribing to the full store object — always select a specific slice

**Local component state:**
- `useState` for UI state (modal open/closed, text inputs, selections, flags)
- `useRef` for timer handles: `useRef<ReturnType<typeof setTimeout> | null>(null)`
- `useMemo` for derived filtered lists computed from deps (not `useEffect` + state)
- `useCallback` for stable handlers passed to child components as props

## Logging

No `console.log` or `console.error` calls exist in the codebase. Errors surface through UI state (modal flags, `ErrorScreen` component) rather than logs.

## Comments

**When to Comment:**
- Section dividers in JSX: `{/* Header row */}`, `{/* Chat area */}`, `{/* Bottom: user / login */}`
- Silent `catch` blocks: always annotated `catch { /* empty */ }`
- Asset file context: `// Asset mappings — converted from Figma Make figma:asset imports`
- Suppressing lint warnings: `// Suppress unused var warning`

**JSDoc/TSDoc:**
- Not used in this codebase

## Function Design

**Size:** Feature components target ≤150 lines per the project rule. `src/components/features/chat/chat-container.tsx` at 537 lines is the known exception. Most feature components are 60–150 lines. shadcn/ui primitives in `src/components/ui/` may exceed 150 lines — acceptable as generated code.

**Parameters:** Props always destructured inline with type annotation in the function signature:
```typescript
export function ModelCard({ model, locked, onClick }: ModelCardProps) {
```

**Return Values:**
- Boolean from store methods indicating success/failure: `deductBalance(amount): boolean`, `consumeRequest(): boolean`
- Void for event handlers
- Typed primitives from utility functions: `formatNumber(num: number): string`, `formatDate(date: string | Date): string`

## Module Design

**Exports:**
- Named exports for all components and utilities: `export function ComponentName()`
- `export default` only for Next.js page/layout/error/loading files (framework requirement)
- Constants exported from `src/lib/constants.ts` and `src/lib/assets.ts`
- Store hooks exported from `src/stores/` files

**Barrel Files:**
- `src/types/index.ts` re-exports from `./models`, `./chat`, `./subscription`
- No barrel files for components — import directly from the specific file path

## Tailwind Usage

**Rule:** Tailwind-only for styling. `style={{}}` is used only for runtime-dynamic values that cannot be expressed as static Tailwind classes: radial gradients with model-specific colors, mask images, complex animation properties.

**Class patterns:**
- Opacity modifiers with Tailwind syntax: `text-white/50`, `bg-white/[0.06]`, `border-white/[0.08]`
- Design token colors via CSS vars: `bg-primary`, `text-foreground`, `bg-card`, `border-border`
- Raw hex for colors without a token: `bg-[#121118]`, `bg-[#39375b]`
- Responsive mobile-first: `px-[24px] lg:px-[40px]`, `hidden md:flex`
- Arbitrary values with bracket notation: `rounded-[20px]`, `size-[34px]`, `gap-[16px]`

---

*Convention analysis: 2026-03-20*

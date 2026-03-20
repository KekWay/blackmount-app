# Architecture

**Analysis Date:** 2026-03-20

## Pattern Overview

**Overall:** Feature-Sliced Component Architecture on Next.js 14 App Router

**Key Characteristics:**
- Route groups `(main)` and `(auth)` enforce layout isolation at the filesystem level
- Pages are thin shells — they import a single feature component that owns all logic
- Client state (auth, balance, subscription, rate-limiting) lives in Zustand stores with `localStorage` persistence via `persist` middleware
- Static model catalogue (`src/data/`) drives all UI; no server-side data fetching exists yet
- Supabase clients are wired but unused in production flows — all auth and data is currently local-only

## Layers

**Routing / Pages:**
- Purpose: URL-addressable entry points; contain zero business logic
- Location: `src/app/(main)/`, `src/app/(auth)/`
- Contains: Single-component re-exports (`export default function XPage() { return <XFeature /> }`)
- Depends on: Feature components
- Used by: Next.js router

**Layout:**
- Purpose: Persistent shell rendered around all `(main)` pages
- Location: `src/app/(main)/layout.tsx`
- Contains: `<Sidebar>`, `<Header>`, `<MobileNav>` composition
- Depends on: `src/components/layout/`
- Used by: All `(main)` routes

**Layout Components:**
- Purpose: Navigation chrome — sidebar (desktop), header (top bar), bottom-nav (mobile)
- Location: `src/components/layout/`
- Key files: `src/components/layout/sidebar.tsx`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav.tsx`
- Depends on: Zustand stores (`useAuthStore`, `useBalanceStore`), `src/lib/constants.ts`
- Used by: `src/app/(main)/layout.tsx`

**Feature Components:**
- Purpose: Full page-level UI and interaction logic for each product area
- Location: `src/components/features/{area}/`
- Contains: Stateful orchestrator (`chat-container.tsx`, `arena-battle.tsx`) + focused sub-components
- Depends on: Zustand stores, `src/data/`, `src/types/`, shadcn/ui primitives
- Used by: Page files

**Shared Components:**
- Purpose: Cross-feature UI utilities — gates, overlays, loaders, media display
- Location: `src/components/shared/`
- Key files: `subscription-gate.tsx`, `payment-overlay.tsx`, `error-screen.tsx`, `skeleton-loader.tsx`, `media-viewer.tsx`, `model-icon.tsx`, `command-palette.tsx`, `connection-toast.tsx`
- Depends on: `src/types/`, `next/navigation`
- Used by: Feature components and pages

**UI Primitives:**
- Purpose: Radix UI-based unstyled-then-styled components from shadcn/ui
- Location: `src/components/ui/`
- Contains: Button, Card, Dialog, Sheet, Tabs, Select, Slider, etc.
- Depends on: Radix UI packages, `src/lib/utils.ts` (`cn()`)
- Used by: All component layers

**Zustand Stores:**
- Purpose: Client-side global state with `localStorage` persistence
- Location: `src/stores/`
- Key files: `auth.ts`, `balance.ts`, `subscription.ts`, `request-limiter.ts`
- Depends on: `src/types/`
- Used by: Feature and layout components

**Data Layer:**
- Purpose: Static typed catalogues — AI model definitions, arena models, leaderboard, trending
- Location: `src/data/`
- Key files: `ai-models.ts`, `arena-models.ts`, `leaderboard.ts`, `trending.ts`
- Depends on: `src/lib/assets.ts`, `src/types/`
- Used by: Feature components and stores

**Library / Utilities:**
- Purpose: Shared helpers, Supabase clients, asset paths, app constants
- Location: `src/lib/`
- Key files: `utils.ts` (`cn`, `formatNumber`, `formatDate`, `copyToClipboard`), `assets.ts` (`MODEL_ASSETS`, `APP_ASSETS`), `constants.ts` (`NAV_ITEMS`, daily request limits), `supabase/client.ts`, `supabase/server.ts`
- Depends on: Nothing internal
- Used by: Everything

**Types:**
- Purpose: Shared TypeScript interfaces and union types
- Location: `src/types/`
- Key files: `models.ts` (`AIModel`, `ModelVersion`, `ModelCategory`), `chat.ts` (`Message`, `ChatSession`), `subscription.ts` (`SubscriptionTier`, `SubscriptionData`, `OperationItem`), `index.ts` (re-exports all)
- Depends on: Nothing
- Used by: All layers

## Data Flow

**Chat Request Flow:**

1. User navigates to `/chat/[modelId]` — `ChatPage` renders `<ChatContainer>`
2. `ChatContainer` reads `modelId` from `useParams`, resolves model from `aiModels` data array
3. User types prompt; `handleSend` validates: auth check → model lock check → rate-limit check → balance check
4. On success: `useRequestLimiterStore.consumeRequest()` decrements daily quota; `useBalanceStore.deductBalance()` deducts icoin cost
5. Mock response generated via `setTimeout` (2–3 s); real API integration via `src/app/api/` is not yet wired
6. Generation history appended to `useBalanceStore.addGenHistoryItem()`

**Home → Chat Navigation Flow:**

1. `HomePage` calls `isModelLocked(modelId)` from `useSubscriptionStore`
2. Locked model → shows `<SubscriptionGateModal>`; unlocked model → `router.push('/chat/{modelId}')`

**Subscription Gate Flow:**

1. Any component calls `useSubscriptionStore.isModelLocked(id)` or `isVersionLocked(id)`
2. `LOCKED_MODEL_IDS` / `LOCKED_VERSION_IDS` sets in `src/stores/subscription.ts` control what is gated
3. Gate triggers `<SubscriptionGateModal>` → user redirected to `/subscription`

**State Management:**

- All global state is Zustand with `persist` middleware writing to `localStorage`
- Stores are imported directly in components via hooks (`useAuthStore`, `useBalanceStore`, etc.)
- No Context API, no server state library (React Query / SWR) — all data is static or local

## Key Abstractions

**AIModel:**
- Purpose: Represents a single AI product with all its selectable versions and UI metadata
- Examples: `src/data/ai-models.ts`
- Pattern: Typed array exported as `aiModels: AIModel[]`; consumed read-only by all features

**SubscriptionStore:**
- Purpose: Single source of truth for tier-based feature gating
- Examples: `src/stores/subscription.ts`
- Pattern: `isModelLocked(id)` and `isVersionLocked(id)` methods used at render time to gate UI

**MODEL_ASSETS / APP_ASSETS:**
- Purpose: Centralized image path registry — replaces Figma-generated `figma:asset/` imports
- Examples: `src/lib/assets.ts`
- Pattern: `MODEL_ASSETS[modelId].logo` or `MODEL_ASSETS[modelId].maskImage`

**Feature Orchestrator Pattern:**
- Purpose: One stateful container component owns all local state for a feature; sub-components receive props
- Examples: `src/components/features/chat/chat-container.tsx` (14+ useState, all chat logic), `src/components/features/arena/arena-battle.tsx`
- Pattern: Container renders sub-components via explicit prop drilling; no Context within a feature

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Font variables (Manrope, Maven Pro), ThemeProvider (dark-only), Toaster (sonner)

**Main App Layout:**
- Location: `src/app/(main)/layout.tsx`
- Triggers: All `(main)` route renders
- Responsibilities: Sidebar + Header + MobileNav shell composition

**Home Page:**
- Location: `src/app/(main)/page.tsx`
- Triggers: `/` route
- Responsibilities: Model library display, filter/search, subscription gate trigger

**Chat Page:**
- Location: `src/app/(main)/chat/[modelId]/page.tsx`
- Triggers: `/chat/{modelId}` route
- Responsibilities: Delegates entirely to `<ChatContainer>`

**Auth Page:**
- Location: `src/app/(auth)/auth/page.tsx`
- Triggers: `/auth` route
- Responsibilities: Login/register form; on submit calls `useAuthStore.login()` directly (no real backend call)

## Error Handling

**Strategy:** Next.js error boundary + shared component

**Patterns:**
- `src/app/(main)/error.tsx` is the Next.js error boundary for the main group; renders `<ErrorScreen type="generic">`
- `src/components/shared/error-screen.tsx` accepts `type`, `title`, `message`, `onRetry`, `onGoHome` props
- Balance errors, rate-limit errors, and auth gate errors are handled inline inside `ChatContainer` via modal state flags (`showLowBalance`, `showLimitReached`, `showAuthGate`)

## Cross-Cutting Concerns

**Logging:** None — no logger, no `console.log` in production paths
**Validation:** Inline in component handlers (auth check, balance check, rate check before send)
**Authentication:** Client-side only via `useAuthStore`; Supabase clients exist (`src/lib/supabase/`) but are not integrated into auth flows
**Routing:** `next/navigation` (`useRouter`, `usePathname`, `useParams`, `useSearchParams`); `next/link` for `<Link>`
**Asset paths:** All model logos/masks resolved via `MODEL_ASSETS` in `src/lib/assets.ts`

---

*Architecture analysis: 2026-03-20*

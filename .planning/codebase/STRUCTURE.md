# Codebase Structure

**Analysis Date:** 2026-03-20

## Directory Layout

```
blackmount-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── auth/
│   │   │       └── page.tsx          # /auth — login/register
│   │   ├── (main)/
│   │   │   ├── layout.tsx            # Shell: Sidebar + Header + MobileNav
│   │   │   ├── page.tsx              # / — home / model library
│   │   │   ├── error.tsx             # Next.js error boundary for (main)
│   │   │   ├── loading.tsx           # Next.js loading skeleton for (main)
│   │   │   ├── arena/page.tsx        # /arena
│   │   │   ├── chat/[modelId]/page.tsx  # /chat/:modelId
│   │   │   ├── history/page.tsx      # /history
│   │   │   ├── knowledge/page.tsx    # /knowledge
│   │   │   ├── profile/page.tsx      # /profile
│   │   │   ├── prompts/page.tsx      # /prompts
│   │   │   ├── rating/page.tsx       # /rating
│   │   │   └── subscription/page.tsx # /subscription
│   │   ├── layout.tsx                # Root layout: fonts, ThemeProvider, Toaster
│   │   └── globals.css               # Global styles, Tailwind base
│   ├── components/
│   │   ├── features/
│   │   │   ├── arena/                # Arena battle UI
│   │   │   ├── chat/                 # Chat UI (orchestrator + sub-components)
│   │   │   ├── home/                 # Home page sections
│   │   │   ├── models/               # Shared model card
│   │   │   ├── profile/              # Profile page sections
│   │   │   ├── rating/               # Leaderboard and filters
│   │   │   └── subscription/         # Plan cards and comparison
│   │   ├── layout/
│   │   │   ├── sidebar.tsx           # Desktop sidebar (collapsible)
│   │   │   ├── header.tsx            # Top bar with balance display
│   │   │   └── mobile-nav.tsx        # Bottom nav (mobile only)
│   │   ├── shared/
│   │   │   ├── command-palette.tsx   # Global command palette
│   │   │   ├── connection-toast.tsx  # Network status notification
│   │   │   ├── error-screen.tsx      # Reusable error UI
│   │   │   ├── media-viewer.tsx      # Full-screen image/video viewer
│   │   │   ├── model-icon.tsx        # Model logo resolver
│   │   │   ├── payment-overlay.tsx   # Icoin top-up overlay
│   │   │   ├── skeleton-loader.tsx   # Loading skeleton variants
│   │   │   └── subscription-gate.tsx # Paywall modal
│   │   └── ui/                       # shadcn/ui primitives (Radix-based)
│   ├── data/
│   │   ├── ai-models.ts              # 8 AI models with versions and pricing
│   │   ├── arena-models.ts           # Models available in arena mode
│   │   ├── leaderboard.ts            # Static leaderboard data
│   │   └── trending.ts               # Trending models data
│   ├── lib/
│   │   ├── assets.ts                 # MODEL_ASSETS and APP_ASSETS image paths
│   │   ├── constants.ts              # NAV_ITEMS, PLACEHOLDER_TEXTS, daily limits
│   │   ├── utils.ts                  # cn(), formatNumber(), formatDate(), copyToClipboard()
│   │   └── supabase/
│   │       ├── client.ts             # Browser Supabase client (createBrowserClient)
│   │       └── server.ts             # Server Supabase client (createServerClient + cookies)
│   ├── stores/
│   │   ├── auth.ts                   # isLoggedIn, user — persisted
│   │   ├── balance.ts                # balance, operations, genHistory — persisted
│   │   ├── request-limiter.ts        # daily request count — persisted
│   │   └── subscription.ts           # tier, lock checks — persisted
│   └── types/
│       ├── index.ts                  # Re-exports all types
│       ├── chat.ts                   # Message, ChatSession
│       ├── models.ts                 # AIModel, ModelVersion, ModelCategory
│       └── subscription.ts           # SubscriptionTier, SubscriptionData, OperationItem
├── public/
│   └── assets/
│       └── models/                   # PNG assets — model logos, masks, app icons
├── docs/
│   ├── PROJECT_IDEA.md               # Business context, competitors, monetization
│   └── SPECIFICATION.md              # DB tables, API endpoints, UI components
├── .claude/
│   ├── agents/                       # Sub-agent definitions (database, backend, frontend, qa)
│   └── rules/                        # Context-specific rules
├── .planning/
│   └── codebase/                     # GSD codebase analysis documents
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── pnpm-workspace.yaml
└── CLAUDE.md                         # Project instructions for Claude
```

## Directory Purposes

**`src/app/(main)/`:**
- Purpose: All authenticated/main-app routes with sidebar layout
- Contains: Thin page files, error boundary, loading state
- Key files: `layout.tsx` (shell), `page.tsx` (home), `chat/[modelId]/page.tsx` (dynamic chat)

**`src/app/(auth)/`:**
- Purpose: Auth routes without sidebar layout
- Contains: Login/register page only
- Key files: `auth/page.tsx`

**`src/components/features/`:**
- Purpose: Product-area feature components; each subfolder maps to one route
- Contains: One orchestrator + N sub-components per feature
- Key files: `chat/chat-container.tsx`, `arena/arena-battle.tsx`, `home/model-grid.tsx`

**`src/components/layout/`:**
- Purpose: App chrome rendered by `(main)/layout.tsx`
- Contains: Sidebar, Header, MobileNav
- Key files: `sidebar.tsx` (reads `useAuthStore`, `useBalanceStore`, `NAV_ITEMS`)

**`src/components/shared/`:**
- Purpose: UI utilities reusable across multiple features
- Contains: Gates, overlays, error states, media display, model icon
- Key files: `subscription-gate.tsx` (paywall modal), `error-screen.tsx` (error UI), `payment-overlay.tsx`

**`src/components/ui/`:**
- Purpose: shadcn/ui component library — unstyled Radix primitives + Tailwind variants
- Contains: All base components (Button, Dialog, Sheet, Tabs, etc.)
- Generated: Yes (via shadcn CLI), but customized

**`src/data/`:**
- Purpose: Static application data — model catalogues, leaderboard, trending
- Contains: TypeScript arrays/objects, no async fetching
- Key files: `ai-models.ts` (single source of truth for all 8 models with versions and pricing)

**`src/lib/`:**
- Purpose: Pure utilities and configuration
- Contains: `cn()` helper, asset path maps, app constants, Supabase factory functions
- Key files: `assets.ts` (must reference for any model logo), `constants.ts` (NAV_ITEMS drives sidebar)

**`src/stores/`:**
- Purpose: Zustand global state with localStorage persistence
- Contains: One store file per domain (auth, balance, subscription, rate-limiting)
- All stores use `persist` middleware with named keys

**`src/types/`:**
- Purpose: TypeScript type definitions shared across the codebase
- Contains: Interfaces for models, chat messages, subscription tiers
- Import from `@/types` (re-exported via `index.ts`)

**`public/assets/models/`:**
- Purpose: Binary assets — model logos and app icons with hash-based filenames
- Generated: Yes (from Figma Make export)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML shell with fonts and providers
- `src/app/(main)/layout.tsx`: Main app shell (Sidebar + Header + MobileNav)
- `src/app/(main)/page.tsx`: Home page (model library)

**Configuration:**
- `src/lib/constants.ts`: `NAV_ITEMS`, `MOBILE_NAV_ITEMS`, daily request limit constants
- `src/lib/assets.ts`: `MODEL_ASSETS` (model logos by id), `APP_ASSETS` (coin, logo, settings)
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript config with `@/` path alias pointing to `src/`

**Core Logic:**
- `src/components/features/chat/chat-container.tsx`: Full chat orchestration, cost computation, mock generation
- `src/stores/subscription.ts`: `LOCKED_MODEL_IDS`, `LOCKED_VERSION_IDS`, gating methods
- `src/stores/balance.ts`: Icoin balance, operation history, generation history
- `src/data/ai-models.ts`: All 8 models with `id`, `name`, `category`, `versions[]`, `gradient`, `glowColors`

**Supabase Clients:**
- `src/lib/supabase/client.ts`: Use in Client Components (`'use client'`)
- `src/lib/supabase/server.ts`: Use in Server Components / Route Handlers

## Naming Conventions

**Files:**
- kebab-case for all files: `chat-container.tsx`, `model-card.tsx`, `arena-battle.tsx`
- Feature sub-components named by `{feature}-{role}.tsx`: `chat-input.tsx`, `chat-messages.tsx`
- Shared components named by function: `subscription-gate.tsx`, `error-screen.tsx`

**Directories:**
- kebab-case for feature directories: `arena/`, `chat/`, `home/`, `models/`
- Route group directories wrap in parentheses: `(main)/`, `(auth)/`

**Components:**
- PascalCase named exports: `export function ChatContainer()`, `export function ModelCard()`
- No default exports in components (except Next.js page/layout files which require it)

**Stores:**
- Hook named `use{Domain}Store`: `useAuthStore`, `useBalanceStore`, `useSubscriptionStore`, `useRequestLimiterStore`
- Interface named `{Domain}State`: `AuthState`, `BalanceState`, `SubscriptionState`

**Types:**
- Interfaces: PascalCase — `AIModel`, `ModelVersion`, `Message`, `ChatSession`
- Union types: PascalCase — `ModelCategory`, `SubscriptionTier`

## Where to Add New Code

**New Page (with sidebar):**
- Create: `src/app/(main)/{route}/page.tsx`
- Feature components: `src/components/features/{route}/`
- Add route to: `src/lib/constants.ts` `NAV_ITEMS`

**New Feature Component:**
- Orchestrator: `src/components/features/{area}/{area}-{role}.tsx`
- Sub-components: Same directory, named `{area}-{part}.tsx`
- Keep each file under 150 lines; split into sub-components if larger

**New AI Model:**
- Add entry to: `src/data/ai-models.ts`
- Add asset paths to: `src/lib/assets.ts` under `MODEL_ASSETS`
- Place PNG files in: `public/assets/models/`
- If model should be locked: add id to `LOCKED_MODEL_IDS` in `src/stores/subscription.ts`

**New Locked Version:**
- Add version id to `LOCKED_VERSION_IDS` set in `src/stores/subscription.ts`

**New Global State:**
- Create: `src/stores/{domain}.ts` using `create<{Domain}State>()(persist(...))`
- Add types to: `src/types/{domain}.ts` and re-export from `src/types/index.ts`

**New Shared UI Component:**
- Place in: `src/components/shared/{component-name}.tsx`
- Use named export, no `'use client'` unless state/effects required

**New shadcn/ui Primitive:**
- Place in: `src/components/ui/{component}.tsx`
- Install via shadcn CLI to maintain consistency

**Utilities:**
- Pure functions: `src/lib/utils.ts`
- Constants: `src/lib/constants.ts`
- Asset paths: `src/lib/assets.ts`

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and dev cache
- Generated: Yes
- Committed: No

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents consumed by planning/execution agents
- Generated: Yes (by map-codebase agent)
- Committed: Yes

**`.claude/agents/`:**
- Purpose: Sub-agent definitions for domain-specific tasks
- Committed: Yes

**`public/assets/models/`:**
- Purpose: All PNG assets with content-hash filenames (from Figma Make)
- Generated: Partially (original export from Figma)
- Committed: Yes

---

*Structure analysis: 2026-03-20*

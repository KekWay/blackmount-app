# Technology Stack

**Analysis Date:** 2026-03-20

## Languages

**Primary:**
- TypeScript 5.x (strict) - all source files under `src/`

**Secondary:**
- JavaScript (ESM) - config files only (`eslint.config.mjs`, `postcss.config.mjs`)

## Runtime

**Environment:**
- Node.js (types pinned to `@types/node: ^20`, targeting Node 20.x)

**Package Manager:**
- pnpm (workspace file at `pnpm-workspace.yaml`)
- Lockfile: `pnpm-lock.yaml` (present and committed)

## Frameworks

**Core:**
- Next.js 16.2.0 - App Router, SSR/RSC, file-system routing. Entry at `src/app/layout.tsx`
- React 19.2.4 - UI rendering
- React DOM 19.2.4 - DOM bindings

**UI Component Library:**
- shadcn/ui pattern - Radix UI primitives + CVA wrappers in `src/components/ui/`
- Radix UI primitives: accordion, avatar, collapsible, dialog, dropdown-menu, popover, progress, scroll-area, select, separator, slot, switch, tabs, toggle, toggle-group, tooltip (runtime); alert-dialog, label, slider (devDependencies)
- `class-variance-authority` 0.7.1 - variant-based class composition for ui components
- `cmdk` 1.1.1 - command palette (devDependency)

**State Management:**
- Zustand 5.0.12 with `persist` middleware (localStorage)
  - `src/stores/auth.ts` - login/logout state, persisted key `auth`
  - `src/stores/balance.ts` - aikoins balance, transaction history, generation history, persisted key `balance`
  - `src/stores/subscription.ts` - tier + expiry + locked model/version sets, persisted key `subscription`
  - `src/stores/request-limiter.ts` - daily request counter with date-based reset, persisted key `request-limiter`

**Animation:**
- motion 12.38.0 (Motion for React, successor to Framer Motion) - used in feature components

**Theming:**
- next-themes 0.4.6 - dark/light toggle; default `dark`, system theme disabled; configured in `src/app/layout.tsx` via `ThemeProvider`

**Notifications:**
- sonner 2.0.7 - toast library; dark theme, top-right position; mounted in `src/app/layout.tsx`

**Icons:**
- lucide-react 0.577.0 - icon set used throughout; replaces Figma mask-image icons per migration rules

**Build/Dev:**
- Tailwind CSS 4 via `@tailwindcss/postcss` PostCSS plugin
- ESLint 9 with `eslint-config-next` 16.2.0 (core-web-vitals + typescript rules); config at `eslint.config.mjs`
- Prettier 3.8.1 + `prettier-plugin-tailwindcss` 0.7.2 for class sorting

## Key Dependencies

**Critical:**
- `@supabase/ssr` 0.9.0 - SSR-safe Supabase client; `createBrowserClient` at `src/lib/supabase/client.ts`, `createServerClient` at `src/lib/supabase/server.ts`
- `@supabase/supabase-js` 2.99.2 - Supabase JS SDK
- `next` 16.2.0 - primary application framework

**UI Utilities:**
- `clsx` 2.1.1 - conditional class merging
- `tailwind-merge` 3.5.0 - Tailwind class deduplication; used in `src/lib/utils.ts`

**Fonts (loaded via `next/font/google` in `src/app/layout.tsx`):**
- Manrope - body font (latin + cyrillic, weights 200–800), CSS var `--font-manrope`
- Maven Pro - heading font (latin, weights 400–900), CSS var `--font-maven`
- Bakbak One - accent font (referenced in design tokens, not yet in layout)

## Configuration

**TypeScript (`tsconfig.json`):**
- `strict: true`, target ES2017, `moduleResolution: bundler`
- Path alias: `@/*` → `./src/*`
- JSX: `react-jsx`

**Environment:**
- `.env.local` file present (do not read contents)
- Required public env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Planned secret vars (per SPECIFICATION.md): `OPENROUTER_API_KEY`, payment provider keys

**Build:**
- `next.config.ts` - minimal config, no custom settings currently
- `postcss.config.mjs` - only `@tailwindcss/postcss` plugin

## Platform Requirements

**Development:**
- Node.js 20.x
- pnpm package manager

**Production:**
- Railway deployment target (per CLAUDE.md)
- `pnpm build` → `pnpm start` (standard Next.js SSR)
- Env vars configured in Railway dashboard

## Build & Run Commands

```bash
pnpm dev              # Development server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Production server
eslint                # Run linter
```

---

*Stack analysis: 2026-03-20*

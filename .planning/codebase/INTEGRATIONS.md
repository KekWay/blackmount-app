# External Integrations

**Analysis Date:** 2026-03-20

## APIs & External Services

**AI Model Aggregation:**
- OpenRouter - unified proxy to all AI model providers
  - SDK/Client: Server-side fetch to OpenRouter API (planned; no `/api/` route files yet exist)
  - Auth: `OPENROUTER_API_KEY` environment variable (planned)
  - Model mapping defined in `docs/SPECIFICATION.md` (e.g., `chatgpt-5.2` → `openai/gpt-5.2`)
  - 7 нейросетей, 30 версий: ChatGPT, Claude, Gemini (text); NanoBanana, Flux (image); Kling, Veo 3.1 (video)
  - All model metadata in `src/data/ai-models.ts`

**Google Fonts:**
- Loaded at build time via `next/font/google` in `src/app/layout.tsx`
- Fonts: Manrope (body), Maven Pro (headings)
- No API key required

**Unsplash (demo/placeholder only):**
- Hardcoded Unsplash image URLs used in `src/components/features/chat/chat-container.tsx` as test image/video placeholders
- Not a real integration — will be replaced by actual AI-generated media

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`
  - Client: `@supabase/ssr` — browser client at `src/lib/supabase/client.ts`, server client at `src/lib/supabase/server.ts`
  - Auth key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - RLS: enforced at database level (per SPECIFICATION.md schema)
  - Planned tables: `profiles`, `balances`, `operations`, `chat_sessions`, `messages`, `arena_battles`, `subscriptions`
  - Current state: Supabase clients wired but actual DB queries not yet present in source (stores use localStorage mocks)

**File Storage:**
- Local filesystem only (`public/assets/models/` for AI model logos)
- No cloud object storage (S3, GCS, Supabase Storage) currently integrated

**Caching:**
- Browser localStorage via Zustand `persist` middleware:
  - `auth` - user session state
  - `balance` - aikoins + operation history + generation history
  - `subscription` - tier and expiry
  - `request-limiter` - daily request count + date
- No server-side cache (Redis, Memcached) present

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Browser client: `src/lib/supabase/client.ts` using `createBrowserClient()`
  - Server client: `src/lib/supabase/server.ts` using `createServerClient()` with `next/headers` cookie store
  - Session storage: HTTP cookies managed by `@supabase/ssr`
  - Current UI: `src/app/(auth)/auth/page.tsx` — custom email/password form + placeholder Telegram/VK buttons
  - Note: Auth page currently calls `useAuthStore.login()` directly without actual Supabase call — Supabase auth not yet wired to UI

**Planned Social Auth (UI placeholder only):**
- Telegram OAuth - button present in `src/app/(auth)/auth/page.tsx`, not implemented
- VKontakte OAuth - button present in `src/app/(auth)/auth/page.tsx`, not implemented
- Google OAuth - mentioned in SPECIFICATION.md, not yet in UI

## Monitoring & Observability

**Error Tracking:**
- Not detected - no Sentry, Datadog, or equivalent

**Logs:**
- Client errors surface via sonner toasts (configured in `src/app/layout.tsx`)
- No structured server-side logging service

**Analytics:**
- Not detected - no Plausible, Mixpanel, Google Analytics, etc.

## CI/CD & Deployment

**Hosting:**
- Railway (per CLAUDE.md)
  - Build: `pnpm build` → Next.js standalone
  - Serve: `pnpm start`
  - Env vars configured in Railway project dashboard

**CI Pipeline:**
- Not detected - no GitHub Actions, GitLab CI or other CI config files present

## Environment Configuration

**Required env vars (public — embedded in client bundle):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project REST/auth endpoint
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (safe to expose; RLS enforces access)

**Required env vars (secret — server-side only, planned):**
- `OPENROUTER_API_KEY` - AI model routing proxy
- Payment provider key (Stripe or YooKassa — not yet chosen)

**Secrets location:**
- Development: `.env.local` (git-ignored)
- Production: Railway environment variables panel

## Webhooks & Callbacks

**Incoming:**
- None currently implemented
- Planned (per SPECIFICATION.md): `/api/webhooks/payment` for subscription payment confirmation

**Outgoing:**
- None currently implemented

## API Endpoint Status

**Planned but not yet created** (per SPECIFICATION.md and CLAUDE.md):
- `POST /api/chat` - stream response from OpenRouter
- `POST /api/chat/stop` - abort active generation
- `GET /api/chat/history` - fetch session list
- `GET /api/balance` - fetch coins + operations
- `POST /api/balance/deduct` - deduct coins atomically
- `POST /api/balance/topup` - initiate payment
- `POST /api/arena` - arena battle submission
- `POST /api/webhooks/payment` - payment provider callback

**Current state:** No `src/app/api/` directory exists. All AI interactions are simulated with hardcoded mock responses and `setTimeout` delays in `src/components/features/chat/chat-container.tsx`.

## Third-Party Service Status Summary

| Service | Status | Purpose |
|---------|--------|---------|
| Supabase Auth | Wired (client setup done), not fully connected to UI | Authentication |
| Supabase DB | Wired (client setup done), no queries yet | Data persistence |
| OpenRouter | Not integrated | AI model proxy |
| Google Fonts | Active | Typography |
| Railway | Deployment target | Hosting |
| Payment processor | Not chosen/integrated | Subscriptions + top-ups |
| Error tracking | Not integrated | Monitoring |
| Analytics | Not integrated | Usage tracking |

---

*Integration audit: 2026-03-20*

# Codebase Concerns

**Analysis Date:** 2026-03-20

---

## Tech Debt

**All chat and arena responses are hardcoded mock data — no real API routes exist:**
- Issue: No `src/app/api/` directory exists. All "generation" is `setTimeout` with static strings and Unsplash test image URLs hardcoded directly in the component.
- Files: `src/components/features/chat/chat-container.tsx` (lines 48–55, 234–268), `src/components/features/arena/arena-battle.tsx` (lines 24–29, 51–66)
- Impact: The entire core product value is non-functional. Cannot be shipped as-is.
- Fix approach: Create `src/app/api/chat/route.ts` (OpenRouter streaming proxy) and `src/app/api/arena/route.ts`. Replace the `generationTimerRef` setTimeout blocks with streaming `fetch` calls to these routes.

**Balance, subscription, and request-limit enforcement is entirely client-side:**
- Issue: All monetization gates are Zustand stores persisted to `localStorage`. Any user can open DevTools, edit `localStorage.balance` or `localStorage.subscription`, and bypass all cost checks.
- Files: `src/stores/balance.ts`, `src/stores/subscription.ts`, `src/stores/request-limiter.ts`
- Impact: All monetization is bypassable. No server-side enforcement exists.
- Fix approach: Perform balance deduction and limit checks inside the chat API route (server-side) before forwarding to OpenRouter. Store balances and request counts in Supabase with RLS.

**Auth store is a stub — no real Supabase authentication:**
- Issue: `src/stores/auth.ts` has only `{ isLoggedIn, login, logout }`. The auth page accepts any email/password and calls `login()` unconditionally with no network request.
- Files: `src/stores/auth.ts`, `src/app/(auth)/auth/page.tsx`
- Impact: No real authentication. Social login buttons (Telegram, VKontakte) are non-functional UI stubs.
- Fix approach: Replace the stub store with Supabase Auth session management using `createClient()` from `src/lib/supabase/client.ts` (already scaffolded). Remove the stub store entirely.

**PaymentOverlay collects card data but processes nothing:**
- Issue: `src/components/shared/payment-overlay.tsx` accepts card number, expiry, and CVC as plain-text inputs, then simulates success via `setTimeout`. No payment processor (Stripe, YooKassa) is integrated.
- Files: `src/components/shared/payment-overlay.tsx`
- Impact: Critical — the UI implies a real transaction. Users may enter actual card data that is never processed and never leaves the browser.
- Fix approach: Remove card input fields until a real processor is wired. Replace with a redirect to a hosted payment page (YooKassa or Stripe Checkout).

**Balance top-up has no payment gate:**
- Issue: `src/components/features/profile/balance-section.tsx` calls `addBalance(amount)` directly on button click. No payment flow is triggered.
- Files: `src/components/features/profile/balance-section.tsx`
- Impact: Any user can increment their own in-memory balance arbitrarily.
- Fix approach: Wire top-up buttons to the PaymentOverlay (once a real processor is integrated) before calling `addBalance`.

**`FREE_SUB_VERSIONS` is duplicated and out of sync with `LOCKED_VERSION_IDS`:**
- Issue: `src/components/features/chat/chat-container.tsx` line 57 defines its own `FREE_SUB_VERSIONS = ['chatgpt-5-mini', 'gemini-3-flash', 'gemini-2.5-flash']`. This must stay in sync with `LOCKED_VERSION_IDS` in `src/stores/subscription.ts` but has no shared source of truth.
- Files: `src/components/features/chat/chat-container.tsx`, `src/stores/subscription.ts`
- Impact: Changing locked versions in one place silently breaks cost computation in the other.
- Fix approach: Export a single `FREE_VERSION_IDS` constant from `src/stores/subscription.ts` and import it in `chat-container.tsx`.

**`addedAt` dates make `isModelNew()` permanently return false:**
- Issue: Both models with `addedAt` set use `'2023-10-01T00:00:00Z'` — over 2 years in the past. `isModelNew()` checks within 14 days, so the "New" badge never displays.
- Files: `src/data/ai-models.ts` (lines 16, 98, 102–106)
- Impact: "New" badge feature is dead code.
- Fix approach: Update `addedAt` for genuinely new models to current dates, or remove `addedAt` from stale entries.

**Request limiter constants mismatch the CLAUDE.md specification:**
- Issue: `src/stores/request-limiter.ts` sets `FREE_LIMIT = 2` and `SUB_LIMIT = 50`. The specification defines Free = 50, Basic = 100, Pro = 150, Max = 200. The limiter also makes no distinction between Basic/Pro/Max tiers.
- Files: `src/stores/request-limiter.ts`
- Impact: Wrong limits enforced; subscription tiers not differentiated.
- Fix approach: Add a per-tier limit map `{ free: 50, basic: 100, pro: 150, max: 200 }` and read the active tier from `useSubscriptionStore`.

**Subscription `expiresAt` is never checked — subscriptions never expire client-side:**
- Issue: `hasActiveSubscription()` only checks `tier !== 'free'` and never reads `expiresAt`.
- Files: `src/stores/subscription.ts` (lines 37–39)
- Impact: A lapsed subscription continues to grant access until the user explicitly clears localStorage.
- Fix approach: Add `&& (!expiresAt || new Date(expiresAt) > new Date())` to `hasActiveSubscription()`.

**`videoPricingMap` uses Cyrillic character "с" (seconds) as object keys:**
- Issue: `src/components/features/chat/chat-container.tsx` (lines 59–67) uses keys like `'10с'` and `'5с'` (Cyrillic `с`). The `videoDuration` state is set with the same strings. A Latin `c` accidentally introduced anywhere causes silent `undefined` lookups.
- Files: `src/components/features/chat/chat-container.tsx`
- Impact: Silent pricing failure — `priceMap[videoDuration]` returns `undefined`, falling back to `basePrice` with no warning.
- Fix approach: Replace all Cyrillic duration keys with ASCII strings (`'10s'`, `'5s'`) or use numeric values throughout.

---

## Known Bugs

**`recordTimerRef` is never cleared on component unmount:**
- Symptoms: If a user starts voice recording and immediately navigates away, the 10-second auto-stop timer fires against an unmounted component, causing a React state update warning.
- Files: `src/components/features/chat/chat-container.tsx` (lines 96, 305–313)
- Trigger: Start recording (`toggleRecording`), then navigate to a different route before 10 seconds elapse.
- Workaround: None.
- Fix: Add a cleanup `useEffect` that calls `clearTimeout(recordTimerRef.current)` on unmount.

**`typingIdx` state variable is suppressed but never used:**
- Symptoms: Line 322 reads `void typingIdx` explicitly to suppress an "unused variable" warning. The variable is set by `setTypingIdx` callbacks but never read in the render path.
- Files: `src/components/features/chat/chat-container.tsx` (line 322)
- Impact: Dead state that adds cognitive overhead and may indicate incomplete typewriter-stop logic.
- Fix: Either remove `typingIdx` entirely or implement the intended stop-at-index typewriter behavior.

**Arena "Continue in chat" passes modelId but not which chat model:**
- Symptoms: `sessionStorage.getItem('arena_continue')` is parsed in `ChatContainer` but the arena response is attributed to whatever model is currently open in the chat route, not the model that won the arena comparison.
- Files: `src/components/features/chat/chat-container.tsx` (lines 145–159)
- Trigger: Use "Continue in chat" from arena, open a different model's chat page.
- Workaround: None.

---

## Security Considerations

**No Next.js middleware — all pages accessible without authentication:**
- Risk: All `(main)` pages load fully without any session check. Auth gates are only UI-level modals.
- Files: `src/app/(main)/layout.tsx` — no `middleware.ts` exists at project root.
- Current mitigation: `handleSend()` in chat checks `isLoggedIn` before sending, but the page content is already loaded.
- Recommendations: Create `middleware.ts` at project root using `@supabase/ssr` to redirect unauthenticated users to `/auth` before any page renders.

**`window.location.href` used for navigation bypasses Next.js router:**
- Risk: Hard page navigation breaks React state, invalidates the SPA session, and bypasses client-side auth guards.
- Files: `src/components/features/chat/input-model-dropdown.tsx` (line 98), `src/components/features/chat/version-dropdown.tsx` (line 82)
- Current mitigation: None.
- Recommendations: Replace with `useRouter().push('...')`.

**Supabase env vars use non-null assertion — no runtime validation:**
- Risk: `process.env.NEXT_PUBLIC_SUPABASE_URL!` and `NEXT_PUBLIC_SUPABASE_ANON_KEY!` will throw a cryptic runtime crash at the first Supabase call if env vars are absent in deployment.
- Files: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Current mitigation: None.
- Recommendations: Add a startup check that throws a descriptive `Error` if either variable is missing.

---

## Performance Bottlenecks

**`chat-container.tsx` is 537 lines — 3.5× over the 150-line limit:**
- Problem: Manages 20+ state variables, 4 `useEffect` hooks, 6 handler functions, and full render in one component.
- Files: `src/components/features/chat/chat-container.tsx`
- Cause: No custom hooks extracted; all state co-located.
- Improvement path: Extract `useChatSettings` (tone, aspect ratio, quality, duration, audio), `usePinnedChats`, and `useGenerationTimer` as custom hooks. Required by CLAUDE.md 150-line rule.

**Five additional components exceed the 150-line limit:**
- Files and sizes:
  - `src/components/features/chat/chat-input.tsx` — 251 lines
  - `src/components/features/chat/chat-settings-panel.tsx` — 224 lines
  - `src/components/features/chat/chat-media-lightbox.tsx` — 214 lines
  - `src/components/layout/sidebar.tsx` — 208 lines
  - `src/components/features/chat/chat-messages.tsx` — 192 lines
- Improvement path: Extract sub-components per concern (e.g., `AttachMenu`, `RecordButton`, `ImageSettings`, `VideoSettings`, `SidebarUserFooter`).

**TypewriterText fires ~55 state updates per second:**
- Problem: `setInterval` at 18ms intervals causes a React re-render per character. Long responses produce hundreds of re-renders.
- Files: `src/components/features/chat/typewriter-text.tsx`
- Improvement path: Batch character updates using `requestAnimationFrame`, or drop the typewriter entirely in favor of SSE streaming when the real API is connected.

---

## Fragile Areas

**`hexToRgba` helper is duplicated in two files:**
- Files: `src/components/features/chat/chat-container.tsx` (line 28), `src/components/features/chat/chat-messages.tsx` (line 15)
- Why fragile: Two independent copies. A bug fix in one will not apply to the other.
- Safe modification: Move to `src/lib/utils.ts` and import in both.

**`ShareIcon` mask-image component is duplicated in two files:**
- Files: `src/components/features/chat/chat-container.tsx` (line 24), `src/components/features/chat/chat-messages.tsx` (line 11)
- Why fragile: Asset path `/assets/models/4cac838c8c63be713d50762821baa4f75f7efe4e.png` is referenced in both. Renaming the asset requires changing two locations.
- Safe modification: Create `src/components/shared/share-icon.tsx` and import it.

**`key={i}` used for message list rendering:**
- Files: `src/components/features/chat/chat-messages.tsx` (line 43)
- Why fragile: Array index as React key causes incorrect DOM reconciliation when messages are inserted, removed, or replaced at non-tail positions (stop generation, regenerate).
- Safe modification: Add a stable `id: string` field to the `Message` type in `src/types/chat.ts` and use it as the key.

**Pinned chats use `window.dispatchEvent` for cross-component communication:**
- Files: `src/components/features/chat/chat-container.tsx` (line 200), `src/components/layout/sidebar.tsx`
- Why fragile: `window.dispatchEvent(new Event('pinnedChatsChanged'))` bypasses React's state system. Will silently fail during SSR, or if the sidebar unmounts before the event fires.
- Safe modification: Move pinned chats to a Zustand store so the sidebar reactively reads from shared state.

**Inline `<style>` blocks inject CSS keyframes on every render cycle:**
- Files: `src/components/features/chat/chat-container.tsx` (lines 436, 525–533), `src/components/features/chat/share-modal.tsx` (line 74)
- Why fragile: With high-frequency re-renders (typewriter effect), duplicate `<style>` tags accumulate in the `<head>`.
- Safe modification: Move all `@keyframes` declarations to `src/app/globals.css`.

**`MicIcon` and `ShareIcon` use CSS mask-image with `/assets/` paths:**
- Files: `src/components/features/chat/chat-input.tsx` (line 12–15), `src/components/features/chat/chat-container.tsx` (line 21–26)
- Why fragile: `mask-image` icons depend on specific asset file hashes. If `public/assets/` is cleaned or the file is renamed, icons silently disappear with no error.
- Safe modification: Replace with Lucide icons (`Share2`, `Mic`) per CLAUDE.md conventions.

---

## Missing Critical Features

**No real AI model integration:**
- Problem: `src/app/api/` does not exist. No OpenRouter, image, or video generation API calls are made anywhere. All features use mock data.
- Blocks: Product launch entirely blocked until at least one text model is wired through a real API route.

**No test suite:**
- Problem: Zero test files in the project. No `jest.config.*`, `vitest.config.*`, or `*.test.*`/`*.spec.*` files found anywhere.
- Blocks: Any refactor of business logic (balance deduction, rate limiting, cost computation) is unverifiable. All monetization logic is untested.
- Priority: High — add unit tests for `src/stores/` before any backend integration.

**No Next.js image remote domain configuration:**
- Problem: `next.config.ts` is empty (no `images.remotePatterns`). Seven files use raw `<img>` tags instead of `next/image` specifically to avoid the missing domain error, bypassing all Next.js image optimization.
- Files: `next.config.ts`, `src/components/features/home/prompts-preview.tsx`, `src/components/shared/model-icon.tsx`, `src/components/features/chat/chat-media-lightbox.tsx`, `src/components/features/home/news-carousel.tsx`, `src/components/features/home/home-footer.tsx`, `src/components/features/models/model-card.tsx`
- Fix: Add `images.remotePatterns` for `images.unsplash.com` and all model CDN domains, then replace `<img>` with `<Image>` per CLAUDE.md rules.

**Referral system is specified but completely absent:**
- Problem: CLAUDE.md defines referral bonuses (15%–30% by tier) but no referral code generation, tracking, or reward logic exists anywhere.
- Blocks: A defined monetization feature with zero implementation.

---

## Test Coverage Gaps

**Zero test coverage across the entire codebase:**
- What's not tested: Balance deduction, request rate limiting, cost computation (`computeCost`), subscription lock/unlock logic, `isModelNew` date comparison, version selection fallback logic.
- Files at highest risk: `src/stores/balance.ts`, `src/stores/request-limiter.ts`, `src/stores/subscription.ts`, `src/components/features/chat/chat-container.tsx` (lines 122–135), `src/data/ai-models.ts`
- Risk: Any change to pricing, daily limits, or access control has zero regression coverage. Monetization correctness is unverifiable.
- Priority: High

---

*Concerns audit: 2026-03-20*

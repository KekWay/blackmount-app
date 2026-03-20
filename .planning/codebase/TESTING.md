# Testing Patterns

**Analysis Date:** 2026-03-20

## Test Framework

**Runner:**
- None installed. No `jest`, `vitest`, `mocha`, or any test runner is present in `package.json` dependencies or devDependencies.

**Assertion Library:**
- None

**Run Commands:**
```bash
# No test commands defined in package.json scripts
# Current scripts:
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
```

## Test File Organization

**No test files exist in the codebase.** A search across all `.ts` and `.tsx` files finds zero files matching `*.test.*` or `*.spec.*` patterns.

## Current Quality Assurance Approach

Since automated tests are absent, quality is enforced through:

1. **TypeScript strict mode** (`"strict": true` in `tsconfig.json`) — catches type mismatches at compile time
2. **ESLint** with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` — catches common React and TS anti-patterns
3. **Prettier** with `prettier-plugin-tailwindcss` — enforces consistent formatting
4. **Next.js build** (`npm run build`) — acts as an integration check; TypeScript errors and missing exports fail the build

## What Would Need Testing (If Tests Were Added)

**Store logic in `src/stores/` — highest value targets:**
- `src/stores/balance.ts`: `deductBalance`, `addBalance`, `addOperation`, balance floor at 0
- `src/stores/request-limiter.ts`: `canMakeRequest`, `consumeRequest`, daily reset logic, subscription tier limit changes
- `src/stores/subscription.ts`: `isModelLocked`, `isVersionLocked`, `hasActiveSubscription`, `getFirstFreeVersion`
- `src/stores/auth.ts`: `login`, `logout`, persist state shape

**Utility functions in `src/lib/utils.ts`:**
- `formatNumber`: boundary at 1000, 1000000
- `formatDate`: locale output for `ru-RU`
- `copyToClipboard`: async success/failure paths

**Data integrity in `src/data/ai-models.ts`:**
- All 8 models have required fields (`id`, `name`, `category`, `gradient`, `versions`, `glowColors`)
- Each model has at least one `free`-tier version

## Recommended Setup (When Tests Are Added)

**Recommended framework:** Vitest (compatible with the Vite/Next.js ecosystem, no separate babel config needed)

**Recommended config location:** `vitest.config.ts` at project root

**Example setup:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',  // jsdom for component tests
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

**Recommended test file placement:**
- Co-located with source: `src/stores/balance.test.ts` alongside `src/stores/balance.ts`
- Or in a `__tests__/` directory mirroring `src/` structure

**Recommended store test pattern:**
```typescript
// src/stores/balance.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useBalanceStore } from './balance'

describe('useBalanceStore', () => {
  beforeEach(() => {
    useBalanceStore.setState({ balance: 100, operations: [], genHistory: [] })
  })

  it('deductBalance returns false when insufficient funds', () => {
    expect(useBalanceStore.getState().deductBalance(200)).toBe(false)
  })

  it('deductBalance floors balance at 0', () => {
    useBalanceStore.getState().deductBalance(100)
    expect(useBalanceStore.getState().balance).toBe(0)
  })
})
```

**Recommended utility test pattern:**
```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatNumber } from './utils'

describe('formatNumber', () => {
  it('formats thousands with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.5K')
  })
  it('returns raw number below 1000', () => {
    expect(formatNumber(999)).toBe('999')
  })
})
```

## Coverage

**Current:** No coverage enforced — no test runner configured.

**Recommended targets when tests are added:**
- Stores: 90%+ branch coverage (business logic lives here)
- Utils: 100% line coverage (pure functions, easy to test)
- Components: skip for now, add E2E instead

---

*Testing analysis: 2026-03-20*

# Агент: Testing (Тестирование)

> Правила написания тестов. Claude Code читает этот файл при создании тестов через Superpowers или вручную.

---

## Инструменты
- **Unit / Integration:** Vitest (быстрый, совместим с Jest API)
- **E2E:** Playwright (установится позже)
- **Компоненты:** React Testing Library

## Ключевые документы
- docs/models/MODEL_REGISTRY.md — данные для моков (цены, версии, тиры)
- docs/MIGRATION_PLAN.md — SQL таблиц для тестовой БД

## Структура тестов
```
src/
├── __tests__/              — unit тесты для utils и stores
│   ├── stores/
│   │   ├── balance.test.ts
│   │   ├── auth.test.ts
│   │   └── generation.test.ts
│   └── lib/
│       ├── validators.test.ts
│       └── utils.test.ts
├── app/api/
│   └── __tests__/          — integration тесты API routes
│       ├── chat.test.ts
│       ├── balance.test.ts
│       └── webhooks.test.ts
└── e2e/                    — E2E тесты (Playwright)
    ├── auth.spec.ts
    ├── chat.spec.ts
    └── payment.spec.ts
```

## Что тестировать ОБЯЗАТЕЛЬНО 🔴
```
1. Авторизация:
   - Регистрация (email + реферальный код)
   - Логин (email + пароль)
   - OAuth callback
   - Блокировка аккаунта
   - Удаление аккаунта

2. Баланс и платежи:
   - Списание айкоинов (достаточно / недостаточно)
   - Атомарность (списание + генерация)
   - Вебхук ЮKassa (валидная / невалидная подпись)
   - Идемпотентность (повторный вебхук)
   - Пакеты пополнения

3. Лимиты:
   - Rate limiting (50/100/150/200 запросов)
   - Гейтинг моделей (заблокированные версии)
   - Подписка (доступ к premium моделям)

4. API routes:
   - Без авторизации → 401
   - Невалидные данные → 400
   - Недостаточно средств → 402
   - Лимит исчерпан → 429
```

## Что НЕ тестировать ⚪
```
- Визуальные стили (Tailwind классы)
- Моковые данные (demo-контент)
- Сторонние библиотеки (shadcn/ui, lucide)
- Next.js внутренние механизмы
```

## Паттерн теста
```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('deductCoins', () => {
  beforeEach(() => {
    // Сбросить состояние
  })

  it('списывает айкоины при достаточном балансе', () => {
    // Arrange
    const balance = 100
    const cost = 5

    // Act
    const result = deductCoins(balance, cost)

    // Assert
    expect(result.newBalance).toBe(95)
    expect(result.success).toBe(true)
  })

  it('отклоняет при недостаточном балансе', () => {
    const balance = 3
    const cost = 5

    const result = deductCoins(balance, cost)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Insufficient balance')
  })
})
```

## Правила
- Каждый тест — один сценарий (не комбинируй)
- Названия на русском: `'списывает айкоины при достаточном балансе'`
- Arrange → Act → Assert
- НЕ тестируй реализацию — тестируй ПОВЕДЕНИЕ
- Моки для внешних API (OpenRouter, fal.ai, kie.ai, ЮKassa)

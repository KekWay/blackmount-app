# Правила чистого кода — Blackmount AI Aggregator

Этот документ обязателен к соблюдению при каждом изменении кода.
Обновлён: 2026-04-08 (по итогам полного аудита кодовой базы).

## TypeScript
- Никогда не использовать `as any`, `as never`, `@ts-ignore`, `@ts-expect-error`
- Всегда указывать явные типы для пропсов компонентов и возвращаемых значений хуков
- Не использовать `undefined as` — задавать дефолтные значения
- После каждого изменения: `npx tsc --noEmit`

## Импорты
- Не оставлять неиспользуемые импорты
- Проверка: `npx tsc --noEmit --noUnusedLocals`

## Дубликаты — не создавать, использовать существующие

### Хуки (lib/hooks.ts)
- `useCopyToClipboard` — для любого копирования в буфер
- `useClickOutside` — для закрытия по клику вне элемента

### Утилиты (lib/utils.ts)
- `formatDateShort` — форматирование даты
- `formatTime` — форматирование времени

### Другие
- `hexToRgba` — из `chat-constants.tsx`, не дублировать
- `planFeatures`, типы `Plan`/`Period`/`PlanFeature` — только из `profile-data.ts`
- Locked/subscription модели — только через `lib/locked-versions.ts`

### Перед созданием новой утилиты
1. Проверь `lib/utils.ts`
2. Проверь `lib/hooks.ts`
3. Проверь `chat-constants.tsx`
4. Если аналог есть — используй его

## Доступность (a11y)
- `<button>` с иконкой без текста → обязательно `aria-label`
- Не использовать `<div onClick>` → заменять на `<button>` или добавлять `role="button" tabIndex={0} onKeyDown`
- Модалки → `role="dialog" aria-modal="true"` на контейнере
- `<img>` → обязательно `alt`

## Иконки
- Кастомные PNG в `public/icons/` и `public/assets/models/`
- Компонент `CustomIcon` из `@/components/shared/custom-icon`
- Цвет в тёмной теме через CSS `filter: invert(1)` или конкретный filter
- Не использовать lucide-react для иконок которые уже заменены на PNG

## Навигация
- Всегда `router.push()` из `next/navigation`
- Никогда `window.location.href`

## Console
- Запрещены `console.log` и `console.warn` в коммитах
- `console.error` — только в catch-блоках

## localStorage / sessionStorage
- Всегда оборачивать в try/catch
- getItem падает → переменная остаётся null
- setItem падает → молча игнорируем
- Zustand persist middleware — не трогать (сам оборачивает)

## Компоненты
- Max 150 строк → разбивай на части
- `'use client'` только при hooks/events
- Именованный экспорт
- Стили — только Tailwind, никогда `style={{}}`
- Дорогие вычисления → `useMemo` с явными зависимостями

## Git
- После каждого промпта: `git add -A && git commit -m "..." && git push origin main`

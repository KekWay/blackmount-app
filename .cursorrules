# Правила чистого кода — Blackmount AI Aggregator

Этот документ обязателен к соблюдению при каждом изменении кода.
Обновлён: 2026-04-08 (по итогам полного аудита кодовой базы).

---

## 1. TypeScript
- Никогда не использовать `as any`, `as never`, `@ts-ignore`, `@ts-expect-error`
- Всегда указывать явные типы для пропсов компонентов и возвращаемых значений хуков
- Не использовать `undefined as` — задавать дефолтные значения
- Интерфейсы для пропсов: `interface ComponentNameProps { ... }`
- Union типы вместо enum: `type Status = 'idle' | 'loading' | 'error'`
- После каждого изменения: `npx tsc --noEmit`

## 2. Импорты
- Не оставлять неиспользуемые импорты
- Порядок импортов: react → next → библиотеки → @/lib → @/stores → @/components → @/types → @/data → относительные
- Проверка: `npx tsc --noEmit --noUnusedLocals`

## 3. Дубликаты — не создавать, использовать существующие

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

## 4. React и хуки
- Хуки только на верхнем уровне компонента — не внутри условий, циклов, колбэков
- `useEffect` — всегда указывать ВСЕ зависимости, не подавлять eslint
- `useEffect` с cleanup — всегда возвращать функцию очистки для подписок, таймеров, listeners
- Дорогие вычисления → `useMemo` с явными зависимостями
- Колбэки передаваемые в дочерние компоненты → `useCallback`
- Не использовать `useEffect` для того что можно вычислить при рендере

## 5. Zustand stores
- В JSX/рендере — только хук `useStore(selector)`: `const user = useAuthStore(s => s.user)`
- НИКОГДА `getState()` в рендере — только в обработчиках событий и async-функциях
- Селекторы: выбирать конкретные поля, не весь store: `useStore(s => s.field)`, не `useStore()`
- Новые stores — по одному на домен (auth, balance, subscription, chat)

## 6. Компоненты
- Max 150 строк → разбивай на части
- `'use client'` только при hooks/events/browser API
- Именованный экспорт: `export function Component()`, не `export default`
- Один компонент = один файл
- Пропсы > 3 штук → выносить в интерфейс
- Условный рендеринг: `{condition && <Component />}`, не тернарники с большими блоками
- Не передавать больше 5 пропсов → подумай о композиции или контексте

## 7. Доступность (a11y)
- `<button>` с иконкой без текста → обязательно `aria-label`
- Не использовать `<div onClick>` → заменять на `<button>` или добавлять `role="button" tabIndex={0} onKeyDown`
- Модалки → `role="dialog" aria-modal="true"` на контейнере
- `<img>` → обязательно `alt`
- Интерактивные элементы должны быть доступны с клавиатуры (Enter/Space)

## 8. Иконки
- Кастомные PNG в `public/icons/` и `public/assets/models/`
- Компонент `CustomIcon` из `@/components/shared/custom-icon`
- Цвет в тёмной теме через CSS `filter: invert(1)` или конкретный filter
- Не использовать lucide-react для иконок которые уже заменены на PNG

## 9. Стили
- Только Tailwind CSS, никогда `style={{}}`
- Не хардкодить цвета — использовать дизайн-токены из tailwind.config
- `cn()` из `@/lib/utils` для условных классов
- Не дублировать длинные className — выносить в переменную

## 10. Навигация
- Всегда `router.push()` из `next/navigation`
- Никогда `window.location.href`
- Ссылки — `next/link`, не `<a href>`

## 11. Обработка ошибок
- API вызовы — всегда в try/catch
- localStorage/sessionStorage — всегда в try/catch (getItem → null при ошибке, setItem → игнорируем)
- Zustand persist middleware — не трогать (сам оборачивает)
- Показывать пользователю понятные сообщения, не технические ошибки
- Не глотать ошибки молча — как минимум `console.error` в catch

## 12. Именование
- Компоненты: PascalCase (`ChatContainer`, `ModelSelector`)
- Хуки: camelCase с префиксом use (`useCopyToClipboard`)
- Утилиты: camelCase (`formatDateShort`)
- Константы: UPPER_SNAKE_CASE (`DAILY_LIMITS`, `TIER_ORDER`)
- Файлы компонентов: kebab-case (`chat-container.tsx`)
- GPT всегда пишется ChatGPT (ChatGPT 5.4, не GPT-5.4)
- Описания моделей — 2-3 слова по смыслу

## 13. Console
- Запрещены `console.log` и `console.warn` в коммитах
- `console.error` — только в catch-блоках

## 14. Безопасность
- Не хранить секреты в клиентском коде
- API ключи — только через `NEXT_PUBLIC_` для клиента или серверные env
- Пользовательский ввод — всегда санитизировать перед рендером
- URL параметры — валидировать перед использованием

## 15. Производительность
- Изображения — `next/image` с width/height
- Тяжёлые компоненты — `dynamic(() => import(...))` с `ssr: false` где нужно
- Списки > 20 элементов — подумать о виртуализации
- Не создавать объекты/массивы inline в JSX пропсах: `style={{}}`, `options={[...]}`

## 16. Git
- После каждого промпта: `git add -A && git commit -m "..." && git push origin main`
- Формат коммита: `type: описание` (fix, feat, refactor, docs, a11y, cleanup, vault)

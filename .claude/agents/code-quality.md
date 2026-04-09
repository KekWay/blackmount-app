# Агент: Code Quality (Качество кода)

> Claude Code ОБЯЗАН следовать этим правилам при написании ЛЮБОГО кода в проекте Blackmount.

---

## Структура файла

Каждый файл должен следовать порядку:
```typescript
// 1. 'use client' (если нужен)
'use client'

// 2. Внешние импорты (библиотеки)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 3. Внутренние импорты (проект)
import { cn } from '@/lib/utils'
import { useBalanceStore } from '@/stores/balance'

// 4. Типы и интерфейсы
interface ChatInputProps {
  modelId: string
  onSend: (message: string) => void
  disabled?: boolean
}

// 5. Константы (если специфичны для файла)
const MAX_MESSAGE_LENGTH = 50000

// 6. Компонент / Функция
export function ChatInput({ modelId, onSend, disabled = false }: ChatInputProps) {
  // ...
}

// 7. Вспомогательные функции (если нужны)
function formatTimestamp(ts: number): string {
  // ...
}
```

---

## Именование

### Файлы и папки
```
Компоненты:    kebab-case.tsx     → chat-input.tsx, model-card.tsx
Страницы:      page.tsx           → src/app/(main)/chat/page.tsx
Stores:        camelCase.ts       → balanceStore.ts, chatSessions.ts
Утилиты:       camelCase.ts       → formatDate.ts, validators.ts
Типы:          camelCase.ts       → models.ts, subscription.ts
Константы:     camelCase.ts       → constants.ts
```

### Переменные и функции
```typescript
// Компоненты — PascalCase
export function ModelCard() {}
export function ChatContainer() {}

// Функции — camelCase, глагол + существительное
function handleSendMessage() {}
function calculateCost() {}
function formatDate() {}
function validateInput() {}

// Булевы — is/has/can/should
const isLoading = true
const hasSubscription = false
const canAccessModel = true

// Константы — UPPER_SNAKE_CASE
const MAX_REQUESTS_PER_DAY = 50
const API_TIMEOUT_MS = 30000

// Обработчики — handle + Событие
const handleClick = () => {}
const handleSubmit = () => {}
const handleKeyDown = () => {}

// Zustand stores — use + Название + Store
const useBalanceStore = create<BalanceState>()
const useAuthStore = create<AuthState>()
```

### НЕ ДОПУСКАЕТСЯ:
```typescript
// ❌ Однобуквенные переменные (кроме i, j в циклах)
const d = new Date()        // ❌
const date = new Date()     // ✅

// ❌ Сокращения
const btn = document.querySelector()  // ❌
const button = document.querySelector() // ✅

// ❌ Отрицания в именах
const isNotValid = false    // ❌
const isValid = true        // ✅

// ❌ Числа в именах
const data2 = {}            // ❌
const updatedData = {}      // ✅
```

---

## DRY (Не дублируй)

### Правило: если код повторяется 2+ раз → вынеси в функцию/компонент

```typescript
// ❌ Дублирование:
function PageA() {
  const formatDate = (d: Date) => d.toLocaleDateString('ru-RU')
  return <p>{formatDate(createdAt)}</p>
}
function PageB() {
  const formatDate = (d: Date) => d.toLocaleDateString('ru-RU')
  return <p>{formatDate(updatedAt)}</p>
}

// ✅ Вынести в утилиту:
// src/lib/utils.ts
export function formatDate(d: Date): string {
  return d.toLocaleDateString('ru-RU')
}
```

### Проверяй перед созданием:
```
Перед созданием нового компонента/функции — проверь:
1. Есть ли похожий компонент в src/components/?
2. Есть ли похожая функция в src/lib/?
3. Можно ли расширить существующий вместо создания нового?
```

---

## Единые источники данных

```
При работе с моделями, ценами, версиями:
  Источник правды: docs/models/MODEL_REGISTRY.md
  Код: src/data/ai-models.ts
  Гейтинг: src/lib/locked-versions.ts
  НЕ хардкодь цены/версии в компонентах — импортируй из data/

При работе с Supabase:
  Источник правды: docs/MIGRATION_PLAN.md (SQL, порядок миграций)

При работе с env:
  Источник правды: docs/ENV_TEMPLATE.md
```

---

## Размер и сложность

### Максимумы
```
Файл компонента:    ≤ 150 строк → разбей на подкомпоненты
Функция:            ≤ 30 строк  → разбей на вспомогательные
Вложенность:        ≤ 3 уровня  → используй early return
Параметры функции:  ≤ 4         → используй объект
```

### Early return (ранний выход)
```typescript
// ❌ Глубокая вложенность:
function processPayment(user, amount) {
  if (user) {
    if (user.isActive) {
      if (amount > 0) {
        if (user.balance >= amount) {
          // ... бизнес-логика
        }
      }
    }
  }
}

// ✅ Early return:
function processPayment(user, amount) {
  if (!user) return { error: 'User not found' }
  if (!user.isActive) return { error: 'Account blocked' }
  if (amount <= 0) return { error: 'Invalid amount' }
  if (user.balance < amount) return { error: 'Insufficient balance' }

  // Бизнес-логика — чистая и понятная
}
```

---

## TypeScript строгость

### ОБЯЗАТЕЛЬНО:
```typescript
// ✅ Типы для всех пропсов
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}

// ✅ Типы для возвращаемых значений API
interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// ✅ Enum через union types
type ModelCategory = 'text' | 'image' | 'video'
type SubscriptionTier = 'free' | 'basic' | 'pro' | 'max'

// ✅ Дженерики для переиспользуемых функций
function getFromStorage<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallback
}
```

### ЗАПРЕЩЕНО:
```typescript
// ❌ any
const data: any = fetchData()           // НИКОГДА

// ❌ as any
const result = value as any             // НИКОГДА

// ❌ @ts-ignore
// @ts-ignore                           // НИКОГДА
someFunction(wrongType)

// ❌ Неявные any
function process(data) {}              // ❌ нет типа
function process(data: unknown) {}     // ✅ явный unknown

// ❌ Non-null assertion без проверки
const name = user!.name                // ❌ опасно
const name = user?.name ?? 'Unknown'   // ✅ безопасно
```

---

## Обработка ошибок

### API Routes:
```typescript
export async function POST(request: Request) {
  try {
    // Бизнес-логика
    return Response.json({ data: result })
  } catch (error) {
    // ⛔ НЕ раскрывать стек-трейс пользователю
    console.error('Payment error:', error)
    return Response.json(
      { error: 'Что-то пошло не так. Попробуйте позже.' },
      { status: 500 }
    )
  }
}
```

### Клиент:
```typescript
// ✅ Обработка ошибок fetch
async function sendMessage(content: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
    if (!response.ok) {
      const { error } = await response.json()
      toast.error(error || 'Ошибка отправки')
      return
    }
    const data = await response.json()
    return data
  } catch (error) {
    toast.error('Нет соединения с сервером')
  }
}
```

### Error Boundaries:
```typescript
// Каждая страница должна иметь error boundary
// src/app/(main)/chat/error.tsx
'use client'
export default function ChatError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Произошла ошибка</h2>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  )
}
```

---

## React паттерны

### Hooks:
```typescript
// ✅ Правильный useEffect — с cleanup
useEffect(() => {
  const controller = new AbortController()
  fetchData({ signal: controller.signal })
  return () => controller.abort()
}, [dependency])

// ✅ Мемоизация дорогих вычислений
const sortedModels = useMemo(
  () => models.sort((a, b) => b.rating - a.rating),
  [models]
)

// ✅ Стабильные коллбэки
const handleSend = useCallback((msg: string) => {
  sendMessage(modelId, msg)
}, [modelId])
```

### НЕ делай:
```typescript
// ❌ useEffect для того что можно вычислить при рендере
useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])

// ✅ Просто вычисли:
const fullName = firstName + ' ' + lastName

// ❌ Чтение localStorage в useState инициализаторе (hydration mismatch!)
const [theme, setTheme] = useState(localStorage.getItem('theme'))

// ✅ Через useEffect:
const [theme, setTheme] = useState('dark')
useEffect(() => {
  const saved = localStorage.getItem('theme')
  if (saved) setTheme(saved)
}, [])
```

---

## Комментарии

### Когда НУЖНЫ:
```typescript
// Бизнес-логика которая неочевидна
// Бонус 20 айкоинов начисляется ТОЛЬКО если реферальный код валиден
// и пользователь регистрируется впервые (не повторный вход через OAuth)
if (referralCode && isNewUser) {
  addBonus(20)
}

// TODO для будущей работы
// TODO: заменить на Supabase Auth когда подключим
const mockLogin = () => { ... }

// Объяснение нетривиального решения
// Используем Date.now() + random вместо инкремента потому что
// инкремент сбрасывается при перезагрузке → дублирующиеся ключи React
function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
```

### Когда НЕ нужны:
```typescript
// ❌ Очевидные комментарии
const isActive = true // устанавливаем isActive в true
user.name = 'John'    // устанавливаем имя John

// ❌ Закомментированный код — УДАЛЯЙ, не комментируй
// const oldFunction = () => { ... }
```

---

## Чеклист перед каждым изменением

```
[ ] Нет дублирования — проверил существующие компоненты/функции
[ ] Файл ≤ 150 строк
[ ] Функции ≤ 30 строк
[ ] Нет any, as any, @ts-ignore
[ ] Все пропсы типизированы
[ ] Ошибки обработаны (try/catch, toast)
[ ] Нет console.log (убрал после отладки)
[ ] Нет захардкоженных строк (вынесены в константы)
[ ] Именование понятное (функции — глаголы, булевы — is/has/can)
[ ] Early return вместо глубокой вложенности
[ ] localStorage читается в useEffect (не в useState)
[ ] useEffect имеет cleanup
```

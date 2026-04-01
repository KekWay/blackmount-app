# Модуль: Notifications (Уведомления о генерации)

---

## Описание
Когда пользователь запускает генерацию (текст/фото/видео) и уходит из чата, ему приходит toast-уведомление о завершении + красная точка в разделе «История» в sidebar.

**Текущая реализация:** Полностью работает на Zustand + демо-заглушки с увеличенными задержками. Уведомления показываются только если пользователь НЕ в чате где идёт генерация.
**TODO:** Подключение реальных API — уведомления заработают полноценно без изменений логики.

## Статус реализации
- ✅ Toast-уведомление при завершении генерации (вне чата)
- ✅ Красная точка рядом с «История» в sidebar
- ✅ Красная точка в mobile-nav
- ✅ Логика: toast НЕ показывается если пользователь в чате генерации
- ✅ Логика: toast показывается если пользователь в другом чате или на другой странице
- ✅ Кнопка «Посмотреть» в toast → переход в историю
- ✅ Красная точка исчезает при переходе в /history
- ✅ GenerationWatcher компонент в layout.tsx (работает на всех страницах)
- ✅ PendingCard в истории (spinner + «Генерация...»)
- ✅ Увеличенные задержки демо: текст 2-4с, фото 6-10с, видео 12-18с
- ❌ Реальные API (toast будет срабатывать по ответу сервера вместо таймера)

## Сценарии

### Пользователь В ЧАТЕ где идёт генерация
- Результат показывается в чате
- Toast НЕ показывается
- Красная точка НЕ ставится

### Пользователь ВЫШЕЛ из чата / в ДРУГОМ чате / на другой странице
- Toast в правом верхнем углу: «Генерация завершена — [Модель]: результат готов»
- Кнопка «Посмотреть» → `/history?tab=images` (или text/video)
- Красная точка в sidebar и mobile-nav рядом с «История»
- При переходе в историю — красная точка исчезает

## Zustand Store

Файл: `src/stores/generation.ts`

```typescript
interface PendingGeneration {
  id: string
  modelId: string
  type: 'text' | 'image' | 'video'
  status: 'pending' | 'completed'
  prompt?: string
  startedAt: number
}

interface GenerationState {
  pendingGenerations: PendingGeneration[]
  completedButNotNotified: string[]
  hasNewGenerations: boolean           // красная точка
  activeChat: string | null            // текущий открытый чат (modelId)

  addGeneration: (gen) => void
  completeGeneration: (id) => void
  markNotified: (id) => void
  clearNewFlag: () => void
  setActiveChat: (modelId | null) => void
}
```

## GenerationWatcher

Компонент монтируется в `layout.tsx` — работает на всех страницах.

Текущая логика (демо):
- Poll каждые 2-3 секунды
- Если pending генерация старше задержки (текст 2-4с, фото 6-10с, видео 12-18с) → completeGeneration
- Если activeChat !== modelId завершённой генерации → показать toast + markNotified
- Если activeChat === modelId → не показывать (пользователь видит результат в чате)

## Toast

```typescript
toast.success('Генерация завершена', {
  description: `${modelName}: результат готов`,
  action: {
    label: 'Посмотреть',
    onClick: () => router.push('/history?tab=images'),
  },
  duration: 15000,
})
```

## Красная точка
- `sidebar-nav.tsx`: индикатор рядом с «История» если `hasNewGenerations === true`
- `mobile-nav.tsx`: аналогичный индикатор
- При переходе на `/history`: вызов `clearNewFlag()`

## PendingCard в истории
- Если есть pending генерация → spinner + «Генерация...» в списке истории
- При завершении → spinner исчезает, появляется запись результата

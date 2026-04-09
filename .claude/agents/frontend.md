# Агент: Frontend (UI компоненты и дизайн)

> Claude Code ОБЯЗАН читать при создании/изменении любых компонентов, страниц и стилей.

---

## Стек
- Next.js 14 App Router, TypeScript, Tailwind CSS 4, shadcn/ui
- Иконки: Lucide React (основные) + кастомные PNG (sidebar)
- Анимации: Framer Motion
- Уведомления: Sonner (toast)

## Общие правила
- Файл компонента: ≤ 150 строк → разбивай на подкомпоненты
- `'use client'` только при использовании hooks/events
- Именованный экспорт: `export function ModelCard()` (не default)
- TypeScript strict, NO `any`
- Стили: ТОЛЬКО Tailwind классы, НИКОГДА inline styles
- Адаптивность: mobile-first (сначала мобильная версия, потом desktop)
- Визуальный референс: `../blackmount-old/` — при расхождении копировать БУКВАЛЬНО

---

## Цвета

```
Фоны:
  Приложение:       bg-[#121118]
  Sidebar:          bg-[#181724]
  Карточка:         bg-[rgba(255,255,255,0.05)]
  Карточка hover:   bg-[rgba(255,255,255,0.08)]
  Input:            bg-[rgba(255,255,255,0.05)]
  Overlay:          bg-black/50

Бордеры:
  Карточка:         border-[rgba(255,255,255,0.06)]
  Input:            border-[rgba(255,255,255,0.1)]
  Input focus:      border-[#888AE5]
  Разделитель:      border-[rgba(255,255,255,0.06)]

Акценты:
  Фиолетовый:      #888AE5 (активные элементы, ссылки, выделение)
  Бирюзовый CTA:   #65DED8 (кнопки действия: "Попробовать", "Купить")
  Золотой:          #f5a623 (рейтинг #1-3, бонусы)
  Зелёный рост:     #6bc085
  Красный падение:  #e85d5d

Текст:
  Основной:         text-white
  Вторичный:        text-[rgba(255,255,255,0.7)]
  Третичный:        text-[rgba(255,255,255,0.5)]
  Placeholder:      text-[rgba(255,255,255,0.3)]

Nav:
  Hover:            bg-[rgba(136,138,229,0.08)]
  Active:           bg-[#39375b]

Категории (бейджи):
  Текст:            text-[#888AE5] bg-[rgba(136,138,229,0.15)]
  Изображение:      text-[#e88ae5] bg-[rgba(232,138,229,0.15)]
  Видео:            text-[#65DED8] bg-[rgba(101,222,216,0.15)]
```

---

## Шрифты

```
Manrope (body):     font-manrope
  14px weight-400   — основной текст
  13px weight-400   — описания, подписи
  12px weight-400   — мелкий текст (бейджи, даты)

Maven Pro (headings): font-maven
  36px weight-700   — заголовок страницы (desktop)
  24px weight-700   — заголовок страницы (mobile)
  20px weight-600   — заголовок секции
  16px weight-600   — подзаголовок, название карточки

Bakbak One (accent): font-bakbak
  — Логотип "BLACK MOUNT"
  — VS в арене
  — Декоративные элементы
```

---

## Скругления и отступы

```
Скругления:
  Карточка модели:  rounded-[16px]
  Кнопка:           rounded-[12px]
  Input:            rounded-[12px]
  Бейдж:            rounded-[8px]
  Модальное окно:   rounded-[20px]
  Аватар:           rounded-full

Отступы:
  Desktop:  px-[40px] gap-[32px] (секции), gap-[12px] (карточки), p-[16px] (карточка)
  Tablet:   px-[24px] gap-[24px]
  Mobile:   px-[16px] gap-[24px] gap-[10px] (карточки)
```

---

## Breakpoints (адаптивность)

```
Mobile:   < 768px
  - Sidebar скрыт → нижняя навигация (mobile-nav)
  - Sidebar открывается как overlay по кнопке
  - Сетка карточек: 2 колонки
  - Заголовки: 24px
  - Padding: 16px

Tablet:   768px — 1024px
  - Sidebar свёрнут (иконки)
  - Сетка карточек: 3 колонки
  - Padding: 24px

Desktop:  > 1024px
  - Sidebar раскрыт (иконки + текст)
  - Сетка карточек: 4 колонки
  - Padding: 40px
```

---

## Иконки

```
Основной UI:
  Используй КАСТОМНЫЕ PNG из public/icons/:
  Компонент: CustomIcon из @/components/shared/custom-icon
  Стиль: className="brightness-0 invert" (белые на тёмном фоне)
  Цвет в тёмной теме через CSS filter: invert(1) или конкретный filter

Sidebar навигация:
  Кастомные PNG из public/icons/:
    home-icon.png, history-icon.png, prompt-icon.png,
    knowledge-icon.png, rating-icon.png, arena-icon.png

Модели:
  ЦВЕТНЫЕ логотипы из assets.ts: model.colorLogo
  В карточках trending (ТОП-3): size-[64px]
  В остальных местах: size-[24px] или size-[32px]

Lucide React:
  Используется ТОЛЬКО где нет кастомной PNG-замены
  import { Star, Share2, Copy, ChevronRight, X } from 'lucide-react'
  Проверь public/icons/ — если PNG есть, используй CustomIcon

⛔ НЕ добавляй новые lucide-react иконки без проверки public/icons/
⛔ НЕ дублируй — если PNG существует, не используй lucide
```

---

## Анимации (Framer Motion)

### Правила:
```
1. Все анимации ≤ 300ms (быстрые, не отвлекают)
2. Используй spring для интерактивных элементов (hover, клик)
3. Используй ease для появления/исчезновения
4. Всегда добавляй prefers-reduced-motion проверку
5. НЕ анимируй layout-сдвиги (причина layout thrashing)
```

### Стандартные анимации проекта:
```typescript
// Sidebar nav item hover
whileHover={{ scale: 1.15, y: -1 }}
transition={{ type: 'spring', stiffness: 400, damping: 15 }}

// Карточка модели hover
whileHover={{ scale: 1.02 }}
transition={{ duration: 0.2 }}

// Появление элемента (fade in + slide up)
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2 }}

// Список с каскадом (stagger)
// Родитель:
variants={{ show: { transition: { staggerChildren: 0.05 } } }}
// Дочерний:
variants={{ show: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 10 } }}

// Sidebar collapse/expand
transition={{ duration: 0.2, ease: 'easeInOut' }}

// Модальное окно
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
// + AnimatePresence обязательно для exit анимации
```

### ⛔ НЕ используй:
```
- CSS transition для сложных анимаций (только для простых hover цвета)
- setTimeout для анимаций (используй framer-motion)
- transform: translateX() в inline styles (используй Tailwind или motion)
- Анимации дольше 500ms
```

---

## Состояния компонентов

Каждый интерактивный компонент ОБЯЗАН иметь:

```
Кнопка:
  default:   bg-[#65DED8] text-black
  hover:     opacity-90
  active:    scale(0.97)
  disabled:  opacity-50 cursor-not-allowed
  loading:   spinner + текст "Загрузка..."

Input:
  default:   bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]
  focus:     border-[#888AE5] ring-1 ring-[#888AE5]
  error:     border-[#e85d5d] + текст ошибки красным
  disabled:  opacity-50

Карточка:
  default:   bg-[rgba(255,255,255,0.05)]
  hover:     scale(1.02) + bg-[rgba(255,255,255,0.08)]

Ссылка/Tab:
  default:   text-[rgba(255,255,255,0.5)]
  hover:     text-[rgba(255,255,255,0.7)]
  active:    text-white + подчёркивание или bg-[#39375b]
```

---

## Доступность (a11y)

```
- Все кнопки: aria-label если нет текста (иконка-кнопка)
- Все изображения: alt текст
- Все формы: label привязан к input
- Focus visible: outline-none ring-2 ring-[#888AE5] ring-offset-2 ring-offset-[#121118]
- Escape закрывает модалки/overlay
- Tab навигация работает логично
- prefers-reduced-motion: отключай анимации
```

---

## shadcn/ui правила

```
ИСПОЛЬЗУЙ shadcn/ui для:
  - Button, Input, Textarea, Select, Dialog, Sheet, Tabs
  - Toast (через Sonner)
  - Tooltip, Popover, Dropdown

НЕ ИСПОЛЬЗУЙ shadcn/ui для:
  - Карточки моделей (кастомный дизайн с градиентами)
  - Trending карточки (уникальный layout)
  - Sidebar (кастомная навигация)
  - Mobile nav (кастомная нижняя панель)

КАСТОМИЗАЦИЯ shadcn/ui:
  - Переопределяй через className, НЕ через CSS Variables
  - Пример: <Button className="bg-[#65DED8] text-black rounded-[12px]">
```

---

## Модальные окна и Overlay

```
Overlay:
  fixed inset-0 z-50 bg-black/50
  onClick → закрыть (event на overlay, не на контент)

Модалка:
  bg-[#1a1926] rounded-[20px] max-w-[500px] mx-auto p-[24px]
  AnimatePresence + motion.div для enter/exit
  Escape → закрыть

z-index иерархия:
  Sidebar:         z-40
  Mobile overlay:  z-50
  Modal overlay:   z-50
  Modal content:   z-50
  Toast:           z-[100]
  Command palette: z-[60]
```

---

## Чеклист

```
[ ] Mobile-first (сначала мобильная, потом md: lg:)
[ ] Все цвета из палитры выше (не придуманные)
[ ] Шрифт правильный (Manrope body, Maven Pro heading, Bakbak One accent)
[ ] Иконки из правильного источника (PNG sidebar, Lucide UI, colorLogo модели)
[ ] Hover/active/disabled/loading состояния есть
[ ] Анимации через Framer Motion, ≤ 300ms
[ ] aria-label на иконках-кнопках
[ ] Escape закрывает модалки
[ ] Нет inline styles
[ ] Компонент ≤ 150 строк
[ ] Визуально совпадает с ../blackmount-old/ или скриншотом
```

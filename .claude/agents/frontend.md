# Агент: Frontend Developer

## Специализация
UI-компоненты, страницы, стилизация, навигация в Next.js 14 App Router.

## Правила
- Компонент ≤ 150 строк. Больше → разбивай на подкомпоненты
- 'use client' ТОЛЬКО при useState, useEffect, onClick, onChange
- Именованный экспорт: `export function ComponentName()`
- TypeScript strict — никакого `any`, `as any`, `@ts-ignore`
- Стили — ТОЛЬКО Tailwind CSS классы (исключение: dynamic gradient в style)
- Изображения — `<Image>` из next/image с alt
- Ссылки — `<Link>` из next/link с href
- Иконки — Lucide React (strokeWidth={1.5}, size={20})
- Шрифты — font-manrope (body), font-maven (headings), font-bakbak (accent)
- Mobile-first: базовые классы → md: → lg:

## Паттерны
```typescript
// Компонент с пропсами
interface ModelCardProps {
  model: AIModel
  className?: string
}

export function ModelCard({ model, className }: ModelCardProps) {
  return <div className={cn('...', className)}>...</div>
}
```

## Визуальный источник
Для переноса визуала — ВСЕГДА читай оригинал из ../blackmount-old/src/app/components/.
Копируй className БУКВАЛЬНО. Заменяй только figma:asset, react-router, imports/.

## Чеклист перед завершением
- [ ] pnpm tsc --noEmit — 0 ошибок
- [ ] Нет figma:asset, ../../imports/, data-name, console.log, : any
- [ ] Все компоненты ≤ 150 строк
- [ ] Все Image имеют alt, кнопки имеют aria-label

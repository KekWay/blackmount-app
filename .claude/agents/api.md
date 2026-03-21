# Агент: API / Backend

## Специализация
Next.js API Routes, Server Actions, OpenRouter proxy, вебхуки, авторизация запросов.

## Правила
- API Routes в src/app/api/[endpoint]/route.ts
- Каждый route — именованные exports: GET, POST, PUT, DELETE
- Проверка авторизации в КАЖДОМ route через Supabase server client
- Валидация входных данных (Zod или ручная)
- Возврат правильных HTTP кодов (200, 201, 400, 401, 402, 404, 500)
- Streaming через Response с ReadableStream для чата

## Паттерн API Route
```typescript
// src/app/api/chat/route.ts
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  // Валидация body...
  // Бизнес-логика...
  return Response.json({ data })
}
```

## Streaming паттерн (для чата)
```typescript
export async function POST(request: Request) {
  // ...auth + validation...
  const stream = new ReadableStream({
    async start(controller) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENROUTER_KEY}` },
        body: JSON.stringify({ model, messages, stream: true }),
      })
      const reader = response.body!.getReader()
      // pipe chunks to controller
    }
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}
```

## Запрещено
- Секреты на клиенте (OPENROUTER_KEY, YUKASSA_SECRET — только в API routes)
- API routes без проверки auth
- Прямые запросы к OpenRouter с клиента
- console.log в продакшн коде

## Чеклист
- [ ] Авторизация проверена
- [ ] Входные данные валидированы
- [ ] Ошибки обработаны с правильными HTTP кодами
- [ ] Секреты только в .env, не в коде

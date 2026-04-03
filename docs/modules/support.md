# Модуль: Support (Поддержка)

---

## Описание
Гибридная система поддержки: встроенный чат на сайте (основной канал) + Telegram (дополнительный). Telegram может быть заблокирован в РФ, поэтому чат на сайте — приоритет.

**Текущая реализация:** UI на моках (Zustand persist). Автоматический моковый ответ через 2 сек.
**TODO:** Supabase + Telegram webhook + Realtime.

## Статус реализации
- ✅ Страница /support с полноценным чатом
- ✅ Список тикетов + чат внутри каждого
- ✅ Создание нового обращения с категорией
- ✅ Статусы тикетов: open / answered / closed
- ✅ Моковые данные и автоответ
- ✅ Точки входа: меню sidebar + страница профиля
- ✅ Модалка выбора: Telegram / Встроенный чат
- ❌ Supabase таблицы
- ❌ Telegram webhook администратору
- ❌ Supabase Realtime для live-обновлений

## User Stories
- Нажимаю "Поддержка" в меню профиля → выбираю Telegram или Чат
- Создаю обращение с темой и категорией → получаю автоответ
- Вижу историю всех обращений и их статусы
- Вижу статус "На проверке" у заявки на вывод → нажимаю "Написать в поддержку"

## Категории обращений
- Общий вопрос
- Проблема с оплатой
- Вывод средств
- Техническая проблема

## Store
Файл: src/stores/support-store.ts (Zustand persist)

## UI компоненты (src/components/features/support/)
| Файл | Описание |
|------|----------|
| support-choice-modal.tsx | Модалка выбора: Telegram / Встроенный чат |
| support-page.tsx | Основная страница: список тикетов + чат |
| support-ticket-list.tsx | Список тикетов со статусами |
| support-chat.tsx | Чат внутри тикета |
| support-new-ticket.tsx | Форма нового обращения |

## TODO: Таблицы Supabase
```sql
CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  category text NOT NULL CHECK (category IN ('general','payment','withdrawal','technical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','answered','closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user','support')),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own messages" ON support_messages FOR SELECT
  USING (ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid()));
```

## TODO: API
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/support | Список тикетов пользователя |
| POST | /api/support | Создать тикет |
| POST | /api/support/[id]/message | Отправить сообщение |
| PATCH | /api/support/[id] | Закрыть тикет |

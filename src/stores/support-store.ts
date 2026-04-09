import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupportMessage, SupportTicket, TicketCategory } from '@/types'

interface SupportState {
  tickets: SupportTicket[]
  createTicket: (subject: string, message: string, category: TicketCategory) => string
  sendMessage: (ticketId: string, text: string) => void
  closeTicket: (ticketId: string) => void
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const MOCK_REPLY = 'Спасибо за обращение! Мы рассмотрим ваш вопрос в ближайшее время.'

/** @mock Заменить на API GET /api/support/tickets */
const defaultTickets: SupportTicket[] = [
  {
    id: 'demo-1',
    subject: 'Не пришли айкоины после оплаты',
    category: 'payment',
    status: 'answered',
    createdAt: '2026-03-28T14:20:00.000Z',
    updatedAt: '2026-03-28T14:22:00.000Z',
    messages: [
      { id: 'dm-1', ticketId: 'demo-1', sender: 'user', text: 'Оплатил пакет 350 айкоинов, деньги списались, но баланс не обновился.', createdAt: '2026-03-28T14:20:00.000Z' },
      { id: 'dm-2', ticketId: 'demo-1', sender: 'support', text: 'Здравствуйте! Мы проверили вашу транзакцию — айкоины начислены. Попробуйте обновить страницу.', createdAt: '2026-03-28T14:22:00.000Z' },
      { id: 'dm-3', ticketId: 'demo-1', sender: 'user', text: 'Обновил, всё появилось. Спасибо!', createdAt: '2026-03-28T14:25:00.000Z' },
    ],
  },
  {
    id: 'demo-2',
    subject: 'Как работает реферальная программа?',
    category: 'general',
    status: 'closed',
    createdAt: '2026-03-25T10:00:00.000Z',
    updatedAt: '2026-03-25T10:05:00.000Z',
    messages: [
      { id: 'dm-4', ticketId: 'demo-2', sender: 'user', text: 'Подскажите, как начисляются бонусы за рефералов?', createdAt: '2026-03-25T10:00:00.000Z' },
      { id: 'dm-5', ticketId: 'demo-2', sender: 'support', text: 'Вы получаете 15-30% от трат приглашённых пользователей в зависимости от вашего уровня. Подробности на странице реферальной программы в профиле.', createdAt: '2026-03-25T10:05:00.000Z' },
    ],
  },
]

export const useSupportStore = create<SupportState>()(
  persist(
    (set, get) => ({
      tickets: defaultTickets,

      createTicket: (subject, message, category) => {
        const id = genId()
        const now = new Date().toISOString()
        const msg: SupportMessage = { id: genId(), ticketId: id, sender: 'user', text: message, createdAt: now }
        const ticket: SupportTicket = { id, subject, category, status: 'open', messages: [msg], createdAt: now, updatedAt: now }
        set((s) => ({ tickets: [ticket, ...s.tickets] }))

        setTimeout(() => {
          const state = get()
          const t = state.tickets.find((tk) => tk.id === id)
          if (t && t.status === 'open') {
            const replyMsg: SupportMessage = { id: genId(), ticketId: id, sender: 'support', text: MOCK_REPLY, createdAt: new Date().toISOString() }
            set((s) => ({
              tickets: s.tickets.map((tk) =>
                tk.id === id ? { ...tk, status: 'answered' as const, messages: [...tk.messages, replyMsg], updatedAt: new Date().toISOString() } : tk
              ),
            }))
          }
        }, 2000)

        return id
      },

      sendMessage: (ticketId, text) => {
        const msg: SupportMessage = { id: genId(), ticketId, sender: 'user', text, createdAt: new Date().toISOString() }
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'open' as const, messages: [...t.messages, msg], updatedAt: new Date().toISOString() } : t
          ),
        }))

        setTimeout(() => {
          set((s) => ({
            tickets: s.tickets.map((t) => {
              if (t.id !== ticketId || t.status !== 'open') return t
              const reply: SupportMessage = { id: genId(), ticketId, sender: 'support', text: MOCK_REPLY, createdAt: new Date().toISOString() }
              return { ...t, status: 'answered' as const, messages: [...t.messages, reply], updatedAt: new Date().toISOString() }
            }),
          }))
        }, 2000)
      },

      closeTicket: (ticketId) => {
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'closed' as const, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },
    }),
    { name: 'support' },
  ),
)

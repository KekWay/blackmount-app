import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OperationItem, ModelCategory } from '@/types'

interface GenHistoryItem {
  id: string
  modelId: string
  title: string
  preview: string
  time: string
  dateStr: string
  type: ModelCategory
}

interface BalanceState {
  balance: number
  operations: OperationItem[]
  genHistory: GenHistoryItem[]

  getBalance: () => number
  deductBalance: (amount: number) => boolean
  addBalance: (amount: number) => void
  addOperation: (type: 'topup' | 'spent', label: string, amount: number) => void

  addGenHistoryItem: (item: Omit<GenHistoryItem, 'id'>) => void
  getGenHistory: () => GenHistoryItem[]
  removeGenHistoryItem: (id: string) => void
}

const DEFAULT_BALANCE = 550

function nowDateStr(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const defaultOperations: OperationItem[] = [
  { id: '1', type: 'spent', label: 'ChatGPT 5.2', amount: -5, date: '23.02.26 18:45:03' },
  { id: '2', type: 'spent', label: 'ChatGPT 5.2', amount: -5, date: '23.02.26 18:42:11' },
  { id: '3', type: 'spent', label: 'ChatGPT 5.2', amount: -5, date: '23.02.26 18:38:47' },
  { id: '4', type: 'spent', label: 'Claude Sonnet 4.5', amount: -5, date: '22.02.26 16:20:33' },
  { id: '5', type: 'spent', label: 'Claude Sonnet 4.5', amount: -5, date: '22.02.26 16:15:12' },
  { id: '6', type: 'topup', label: 'Пополнение счета', amount: 90, date: '22.02.26 14:30:00' },
  { id: '7', type: 'spent', label: 'Flux 1.1 Pro', amount: -10, date: '21.02.26 12:10:45' },
  { id: '8', type: 'spent', label: 'Sora 2.0 HD', amount: -20, date: '21.02.26 11:05:22' },
  { id: '9', type: 'topup', label: 'Пополнение счета', amount: 350, date: '20.02.26 09:00:00' },
]

const defaultGenHistory: GenHistoryItem[] = [
  { id: '1', modelId: 'chatgpt', title: 'Что такое сатурн?', preview: 'Сатурн – это шестая по удаленности от Солнца планета...', time: '16:30', dateStr: '2026-02-23', type: 'text' },
  { id: '2', modelId: 'gemini', title: 'Напиши код на Python', preview: 'Конечно! Вот пример кода для сортировки массива...', time: '15:45', dateStr: '2026-02-23', type: 'text' },
  { id: '3', modelId: 'chatgpt', title: 'Что такое квантовые компьютеры?', preview: 'Квантовые компьютеры используют принципы квантовой механики...', time: '14:20', dateStr: '2026-02-23', type: 'text' },
  { id: '4', modelId: 'claude', title: 'Рецепт борща', preview: 'Для классического борща вам понадобится свекла, капуста...', time: '13:10', dateStr: '2026-02-23', type: 'text' },
  { id: '5', modelId: 'chatgpt', title: 'Что такое нейронные сети?', preview: 'Нейронная сеть — это вычислительная система, которая...', time: '12:05', dateStr: '2026-02-23', type: 'text' },
  { id: '6', modelId: 'gemini', title: 'Переведи текст на английский', preview: 'Here is the translation of the provided text...', time: '11:30', dateStr: '2026-02-23', type: 'text' },
  { id: '7', modelId: 'claude', title: 'Расскажи о космосе', preview: 'Космос — это бескрайнее пространство за пределами...', time: '10:15', dateStr: '2026-02-23', type: 'text' },
  { id: '8', modelId: 'nanobanana', title: 'Закат над горами', preview: '', time: '09:45', dateStr: '2026-02-22', type: 'image' },
  { id: '9', modelId: 'flux', title: 'Киберпанк город', preview: '', time: '09:30', dateStr: '2026-02-22', type: 'image' },
  { id: '10', modelId: 'nanobanana', title: 'Портрет с неоном', preview: '', time: '09:10', dateStr: '2026-02-22', type: 'image' },
  { id: '11', modelId: 'flux', title: 'Фэнтези пейзаж', preview: '', time: '08:55', dateStr: '2026-02-22', type: 'image' },
  { id: '12', modelId: 'nanobanana', title: 'Абстракция', preview: '', time: '08:40', dateStr: '2026-02-22', type: 'image' },
  { id: '13', modelId: 'flux', title: 'Космический корабль', preview: '', time: '08:25', dateStr: '2026-02-22', type: 'image' },
  { id: '14', modelId: 'nanobanana', title: 'Подводный мир', preview: '', time: '08:10', dateStr: '2026-02-22', type: 'image' },
  { id: '15', modelId: 'flux', title: 'Ретро плакат', preview: '', time: '07:55', dateStr: '2026-02-22', type: 'image' },
  { id: '16', modelId: 'sora2', title: 'Полёт дрона над городом', preview: '', time: '16:00', dateStr: '2026-02-21', type: 'video' },
  { id: '17', modelId: 'kling', title: 'Танец робота', preview: '', time: '15:20', dateStr: '2026-02-21', type: 'video' },
  { id: '18', modelId: 'veo31', title: 'Морские волны', preview: '', time: '14:40', dateStr: '2026-02-21', type: 'video' },
  { id: '19', modelId: 'sora2', title: 'Лес из будущего', preview: '', time: '13:00', dateStr: '2026-02-21', type: 'video' },
  { id: '20', modelId: 'kling', title: 'Бегущий огонь', preview: '', time: '12:30', dateStr: '2026-02-21', type: 'video' },
  { id: '21', modelId: 'veo31', title: 'Северное сияние', preview: '', time: '11:50', dateStr: '2026-02-21', type: 'video' },
  { id: '22', modelId: 'sora2', title: 'Закат таймлапс', preview: '', time: '11:10', dateStr: '2026-02-21', type: 'video' },
  { id: '23', modelId: 'kling', title: 'Городская суета', preview: '', time: '10:30', dateStr: '2026-02-21', type: 'video' },
]

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      balance: DEFAULT_BALANCE,
      operations: defaultOperations,
      genHistory: defaultGenHistory,

      getBalance: () => get().balance,

      deductBalance: (amount) => {
        const current = get().balance
        if (current < amount) return false
        set({ balance: Math.max(0, current - amount) })
        return true
      },

      addBalance: (amount) => {
        set((s) => ({ balance: s.balance + amount }))
      },

      addOperation: (type, label, amount) => {
        const id = genId()
        const op: OperationItem = { id, type, label, amount, date: nowDateStr() }
        set((s) => ({ operations: [op, ...s.operations] }))
      },

      addGenHistoryItem: (item) => {
        const id = genId()
        set((s) => ({ genHistory: [{ ...item, id }, ...s.genHistory] }))
      },

      getGenHistory: () => get().genHistory,

      removeGenHistoryItem: (id) => {
        set((s) => ({ genHistory: s.genHistory.filter((i) => i.id !== id) }))
      },
    }),
    { name: 'balance' },
  ),
)

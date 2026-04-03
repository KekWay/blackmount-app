import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected'

export interface WithdrawalRequest {
  id: string
  amount: number
  method: 'card' | 'sbp'
  details: string
  status: WithdrawalStatus
  reason?: string
  createdAt: string
  updatedAt: string
}

interface ReferralState {
  withdrawals: WithdrawalRequest[]
  createWithdrawal: (amount: number, method: 'card' | 'sbp', details: string) => string
  updateWithdrawalStatus: (id: string, status: WithdrawalStatus, reason?: string) => void
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const defaultWithdrawals: WithdrawalRequest[] = [
  {
    id: 'wd-1',
    amount: 500,
    method: 'card',
    details: '2200-****-****-4521',
    status: 'completed',
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-02-16T14:30:00.000Z',
  },
  {
    id: 'wd-2',
    amount: 300,
    method: 'sbp',
    details: '+7 (999) ***-**-12',
    status: 'rejected',
    reason: 'Неверно указан номер телефона. Проверьте данные и отправьте заявку повторно.',
    createdAt: '2026-02-19T12:00:00.000Z',
    updatedAt: '2026-02-19T18:00:00.000Z',
  },
  {
    id: 'wd-3',
    amount: 700,
    method: 'card',
    details: '2200-****-****-8903',
    status: 'processing',
    createdAt: '2026-03-30T09:15:00.000Z',
    updatedAt: '2026-03-31T11:00:00.000Z',
  },
  {
    id: 'wd-4',
    amount: 500,
    method: 'sbp',
    details: '+7 (916) ***-**-45',
    status: 'pending',
    createdAt: '2026-04-02T16:40:00.000Z',
    updatedAt: '2026-04-02T16:40:00.000Z',
  },
]

export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
      withdrawals: defaultWithdrawals,

      createWithdrawal: (amount, method, details) => {
        const id = genId()
        const now = new Date().toISOString()
        const req: WithdrawalRequest = { id, amount, method, details, status: 'pending', createdAt: now, updatedAt: now }
        set((s) => ({ withdrawals: [req, ...s.withdrawals] }))
        return id
      },

      updateWithdrawalStatus: (id, status, reason) => {
        set((s) => ({
          withdrawals: s.withdrawals.map((w) =>
            w.id === id ? { ...w, status, reason, updatedAt: new Date().toISOString() } : w
          ),
        }))
      },
    }),
    { name: 'referral' },
  ),
)

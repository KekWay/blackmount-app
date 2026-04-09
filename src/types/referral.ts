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

export interface ConversionRecord {
  id: string
  amount: number
  coins: number
  createdAt: string
}

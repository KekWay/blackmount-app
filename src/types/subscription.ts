export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'ultra'

export interface SubscriptionData {
  tier: SubscriptionTier
  expiresAt: string | null
}

export interface OperationItem {
  id: string
  type: 'topup' | 'spent'
  label: string
  amount: number
  date: string
}

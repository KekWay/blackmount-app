import React from 'react'

export const REFERRAL_LINK = 'https://blackmount.ai/ref/artur2026'
export const INVITE_CODE = 'ARTUR2026'

export interface TierInfo {
  name: string
  label: string
  rate: string
  color: string
  minRefs: number
  icon: React.ReactNode
}

export const dayChart = [
  { label: '00:00', earned: 0 }, { label: '04:00', earned: 20 },
  { label: '08:00', earned: 50 }, { label: '12:00', earned: 120 },
  { label: '16:00', earned: 80 }, { label: '20:00', earned: 150 },
  { label: '23:59', earned: 100 },
]
export const weekChart = [
  { label: 'Пн', earned: 80 }, { label: 'Вт', earned: 150 },
  { label: 'Ср', earned: 200 }, { label: 'Чт', earned: 0 },
  { label: 'Пт', earned: 120 }, { label: 'Сб', earned: 300 },
  { label: 'Вс', earned: 150 },
]
export const monthChart = [
  { label: 'Нед 1', earned: 320 }, { label: 'Нед 2', earned: 580 },
  { label: 'Нед 3', earned: 450 }, { label: 'Нед 4', earned: 700 },
]

export const referrals = [
  { name: 'Мария Степанова', date: '20.02.26', totalEarned: 1240, status: 'active' as const, color: '#ec4899', letter: 'М', lastActive: '5 часов назад' },
  { name: 'Иван Козлов', date: '22.02.26', totalEarned: 890, status: 'active' as const, color: '#6366f1', letter: 'И', lastActive: '2 часа назад' },
  { name: 'Алексей Волков', date: '18.02.26', totalEarned: 370, status: 'active' as const, color: '#10b981', letter: 'А', lastActive: '1 день назад' },
  { name: 'Дмитрий Новиков', date: '15.02.26', totalEarned: 80, status: 'new' as const, color: '#f59e0b', letter: 'Д', lastActive: '3 дня назад' },
  { name: 'Елена Смирнова', date: '10.02.26', totalEarned: 0, status: 'inactive' as const, color: '#64748b', letter: 'Е', lastActive: '2 недели назад' },
]

export interface ReferralTransaction {
  label: string
  date: string
  amount: string
  icon: string
  withdrawalId?: string
}

export const transactions: ReferralTransaction[] = [
  { label: 'Вывод средств', date: '02.04.26', amount: '-500₽', icon: 'withdraw', withdrawalId: 'wd-4' },
  { label: 'Вывод средств', date: '30.03.26', amount: '-700₽', icon: 'withdraw', withdrawalId: 'wd-3' },
  { label: 'Реферальный бонус от Иван К.', date: '22.02.26', amount: '+150₽', icon: 'bonus' },
  { label: 'Реферальный бонус от Мария С.', date: '20.02.26', amount: '+200₽', icon: 'bonus' },
  { label: 'Вывод средств', date: '19.02.26', amount: '-300₽', icon: 'withdraw', withdrawalId: 'wd-2' },
  { label: 'Конвертация в айкоины', date: '18.02.26', amount: '-200₽', icon: 'convert' },
  { label: 'Реферальный бонус от Алексей В.', date: '18.02.26', amount: '+100₽', icon: 'bonus' },
  { label: 'Вывод средств', date: '15.02.26', amount: '-500₽', icon: 'withdraw', withdrawalId: 'wd-1' },
  { label: 'Реферальный бонус от Дмитрий Н.', date: '15.02.26', amount: '+80₽', icon: 'bonus' },
]

export const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Активен', color: '#6bc085', bg: 'rgba(107,192,133,0.12)' },
  new: { label: 'Новый', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  inactive: { label: 'Неактивен', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

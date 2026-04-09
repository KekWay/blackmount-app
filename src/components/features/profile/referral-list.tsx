'use client'

import { useState } from 'react'
import Link from 'next/link'
import { APP_ASSETS } from '@/lib/assets'
import { formatDateShort } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { useReferralStore } from '@/stores/referral-store'
import type { WithdrawalStatus } from '@/types'
import { referrals, transactions, type ReferralTransaction } from './referral-data'

type ReferralView = 'list' | 'transactions'

const wdStatusLabels: Record<WithdrawalStatus, string> = {
  pending: 'На проверке',
  processing: 'Обрабатывается',
  completed: 'Выполнено',
  rejected: 'Отклонено',
}

const wdStatusColors: Record<WithdrawalStatus, { color: string; bg: string }> = {
  pending: { color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  processing: { color: '#888ae5', bg: 'rgba(136,138,229,0.12)' },
  completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  rejected: { color: '#e85d5d', bg: 'rgba(232,93,93,0.12)' },
}

export function ReferralList() {
  const [referralView, setReferralView] = useState<ReferralView>('list')

  return (
    <div className="rounded-[20px] bg-[#181722]/50 overflow-hidden shadow-sm">
      <div className="px-[16px] md:px-[24px] pt-[20px] pb-[16px] flex flex-col sm:flex-row items-start sm:items-center gap-[12px] sm:gap-0 justify-between border-b border-[#888ae5]/10">
        <p className="font-manrope font-bold text-[16px] text-white">Ваши рефералы</p>
        <div className="w-full sm:w-[220px]">
          <AnimatedToggle<ReferralView>
            options={[
              { key: 'list', label: 'Список' },
              { key: 'transactions', label: 'Транзакции' },
            ]}
            value={referralView}
            onChange={setReferralView}
            size="sm"
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        {referralView === 'list' ? (
          <ReferralListView key="list" />
        ) : (
          <ReferralTransactionsView key="transactions" />
        )}
      </AnimatePresence>
    </div>
  )
}

function ReferralListView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      {referrals.map((ref, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="px-[24px] py-[16px] flex items-center gap-[14px] hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 cursor-pointer group"
        >
          <div className="rounded-full size-[42px] flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${ref.color}20` }}>
            <span className="font-manrope font-bold text-[16px]" style={{ color: ref.color }}>{ref.letter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[8px]">
              <p className="font-manrope font-bold text-[14px] text-white leading-[18px] truncate">{ref.name}</p>
            </div>
            <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.4)] mt-[4px]">Подключён {ref.date}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-manrope font-black text-[14px] text-[#6bc085] leading-[18px]">{ref.totalEarned > 0 ? `+${ref.totalEarned.toLocaleString('ru-RU')}\u20BD` : '0\u20BD'}</p>
            <p className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.04em] mt-[2px]">заработано</p>
          </div>
        </motion.div>
      ))}
      <div className="px-[24px] py-[14px] flex items-center justify-between border-t border-white/5 bg-[#121118]/30">
        <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)]">Всего {referrals.length} рефералов</p>
        <p className="font-manrope font-bold text-[12px] text-[#6bc085]">Общий доход: 2 580{'\u20BD'}</p>
      </div>
    </motion.div>
  )
}


function useMergedTransactions(): ReferralTransaction[] {
  const withdrawals = useReferralStore((s) => s.withdrawals)
  const conversions = useReferralStore((s) => s.conversions)

  const staticWdIds = new Set(transactions.filter((t) => t.withdrawalId).map((t) => t.withdrawalId))
  const dynamicWd: ReferralTransaction[] = withdrawals
    .filter((w) => !staticWdIds.has(w.id))
    .map((w) => ({ label: 'Вывод средств', date: formatDateShort(w.createdAt), amount: `-${w.amount}\u20BD`, icon: 'withdraw', withdrawalId: w.id }))

  const dynamicConv: ReferralTransaction[] = conversions
    .map((c) => ({ label: `Конвертация в ${c.coins} айкоинов`, date: formatDateShort(c.createdAt), amount: `-${c.amount}\u20BD`, icon: 'convert' }))

  return [...dynamicWd, ...dynamicConv, ...transactions]
}

function ReferralTransactionsView() {
  const withdrawals = useReferralStore((s) => s.withdrawals)
  const allTx = useMergedTransactions()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      {allTx.map((tx, i) => {
        const wd = tx.withdrawalId ? withdrawals.find((w) => w.id === tx.withdrawalId) : null
        const isWaiting = wd && (wd.status === 'pending' || wd.status === 'processing')

        return (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className={`px-[24px] py-[14px] hover:bg-white/5 transition-colors ${i < allTx.length - 1 ? 'border-b border-white/5' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[14px]">
                <TxIcon icon={tx.icon} />
                <div>
                  <div className="flex items-center gap-[8px]">
                    <p className="font-manrope font-bold text-[13px] text-white leading-[18px]">{tx.label}</p>
                    {wd && <WithdrawalBadge status={wd.status} />}
                  </div>
                  <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.4)] mt-[2px]">{tx.date}</p>
                </div>
              </div>
              <span className={`font-manrope font-black text-[14px] shrink-0 ${tx.amount.startsWith('+') ? 'text-[#6bc085]' : 'text-white'}`}>{tx.amount}</span>
            </div>
            {wd?.status === 'rejected' && wd.reason && (
              <p className="font-manrope text-[12px] text-[rgba(255,255,255,0.5)] mt-[6px] ml-[50px] leading-[17px]">
                Причина: {wd.reason}
              </p>
            )}
            {isWaiting && (
              <p className="font-manrope text-[12px] text-[rgba(255,255,255,0.35)] mt-[6px] ml-[50px]">
                Вопросы?{' '}
                <Link href="/support" className="text-[#888ae5] hover:underline">Написать в поддержку</Link>
              </p>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

function WithdrawalBadge({ status }: { status: WithdrawalStatus }) {
  const s = wdStatusColors[status]
  return (
    <span
      className="text-[10px] font-semibold px-[6px] py-[2px] rounded-[8px] shrink-0"
      style={{ color: s.color, background: s.bg }}
    >
      {wdStatusLabels[status]}
    </span>
  )
}

function TxIcon({ icon }: { icon: string }) {
  const bg = icon === 'bonus' ? 'bg-[#6bc085]/10' : icon === 'withdraw' ? 'bg-[#f87171]/10' : 'bg-[#888ae5]/10'
  return (
    <div className={`rounded-[12px] size-[36px] flex items-center justify-center shrink-0 shadow-sm ${bg}`}>
      {icon === 'bonus' && <img src={APP_ASSETS.wallet3} alt="" className="size-[18px] object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(67%) sepia(20%) saturate(700%) hue-rotate(100deg) brightness(92%) contrast(87%)' }} />}
      {icon === 'withdraw' && <div style={{ width: 16, height: 16, backgroundColor: '#f87171', maskImage: "url('/icons/ruble_icon.png')", WebkitMaskImage: "url('/icons/ruble_icon.png')", maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />}
      {icon === 'convert' && <div className="relative size-[18px]"><img src={APP_ASSETS.coinLarge} alt="" className="size-full object-contain brightness-[0.8] sepia hue-rotate-[210deg] saturate-[3]" /></div>}
    </div>
  )
}

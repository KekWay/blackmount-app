'use client'

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useBalanceStore } from '@/stores/balance'

export function OperationHistory() {
  const operations = useBalanceStore((s) => s.operations)

  if (operations.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-white/40">
        История операций пуста
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {operations.map((op) => {
        const isTopup = op.type === 'topup'

        return (
          <div
            key={op.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isTopup ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {isTopup ? (
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-red-400" />
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-white">{op.label}</span>
              <span className="text-xs text-white/40">{op.date}</span>
            </div>

            <span
              className={`text-sm font-semibold ${
                isTopup ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isTopup ? '+' : ''}{op.amount}
            </span>
          </div>
        )
      })}
    </div>
  )
}

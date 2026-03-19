'use client'

import Image from 'next/image'
import { useBalanceStore } from '@/stores/balance'
import { APP_ASSETS } from '@/lib/assets'

const TOP_UP_OPTIONS = [100, 300, 550, 1000] as const

export function BalanceSection() {
  const balance = useBalanceStore((s) => s.balance)
  const addBalance = useBalanceStore((s) => s.addBalance)
  const addOperation = useBalanceStore((s) => s.addOperation)

  const handleTopUp = (amount: number) => {
    addBalance(amount)
    addOperation('topup', 'Пополнение счета', amount)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5">
        <Image
          src={APP_ASSETS.coin}
          alt="Монеты"
          width={40}
          height={40}
          className="shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-sm text-white/50">Текущий баланс</span>
          <span className="text-2xl font-bold text-white">{balance} монет</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-white/70">Пополнить баланс</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOP_UP_OPTIONS.map((amount) => (
            <button
              key={amount}
              onClick={() => handleTopUp(amount)}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <Image
                src={APP_ASSETS.coin}
                alt=""
                width={18}
                height={18}
              />
              {amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import { IMG_COIN } from './profile-data'

export function HistoryTabSummary({ totalSpent, totalTopup, opsCount }: { totalSpent: number; totalTopup: number; opsCount: number }) {
  return (
    <div className="grid grid-cols-3 gap-[12px]">
      {[
        { label: 'Потрачено', value: totalSpent, icon: <ArrowUpRight size={15} className="text-[#f87171]" />, iconBg: 'rgba(248,113,113,0.1)', noCoins: false },
        { label: 'Пополнено', value: totalTopup, icon: <ArrowDownLeft size={15} className="text-[#6bc085]" />, iconBg: 'rgba(107,192,133,0.1)', noCoins: false },
        { label: 'Операций', value: opsCount, icon: <Clock size={15} className="text-[#888ae5]" />, iconBg: 'rgba(136,138,229,0.1)', noCoins: true },
      ].map((card) => (
        <div
          key={card.label}
          className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px]"
        >
          <div className="shrink-0 size-[36px] rounded-[12px] flex items-center justify-center" style={{ background: card.iconBg }}>
            {card.icon}
          </div>
          <div className="flex flex-col">
            <p className="font-manrope font-normal text-[11px] text-[#9a9a9a] leading-[16px]">{card.label}</p>
            <div className="flex items-center gap-[5px]">
              <p className="font-bakbak leading-[26px] text-[20px] text-white">{card.value.toLocaleString()}</p>
              {!card.noCoins && (
                <div className="relative shrink-0 size-[15px]">
                  <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

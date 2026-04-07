'use client'

import Image from 'next/image'
import { useBalanceStore } from '@/stores/balance'
import { IMG_COIN } from './profile-data'

export function AccountTabBalance({ onNavigateTopup }: { onNavigateTopup: () => void }) {
  const balance = useBalanceStore((s) => s.balance)

  return (
    <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[28px] py-[18px] flex items-center justify-between">
      <div className="flex gap-[14px] items-center">
        <div className="relative shrink-0 size-[36px]">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
        </div>
        <div className="flex flex-col">
          <p className="font-bakbak leading-[16px] text-[11px] text-[#9a9a9a]">Баланс</p>
          <p className="font-bakbak leading-[30px] text-[22px] text-white">{balance}</p>
        </div>
      </div>
      <button
        onClick={onNavigateTopup}
        className="h-[38px] rounded-[20px] px-[18px] flex items-center gap-[7px] cursor-pointer hover:brightness-110 transition-all"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(187, 170, 76, 0.4) 0%, rgba(187, 170, 76, 0.4) 100%), linear-gradient(35.5611deg, rgba(199, 168, 45, 0.99) 24.316%, rgba(154, 147, 121, 0.99) 91.425%)',
        }}
      >
        <Image src="/icons/plus_icon.png" alt="" width={14} height={14} className="brightness-0 invert" />
        <p className="font-manrope font-black leading-[22.5px] text-[13px] text-white">Пополнить</p>
      </button>
    </div>
  )
}

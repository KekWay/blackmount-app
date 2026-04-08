'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { CustomIcon } from '@/components/shared/custom-icon'
import { useBalanceStore } from '@/stores/balance'
import { PaymentOverlay } from '@/components/shared/payment-overlay'
import { packages, IMG_COIN } from './profile-data'
import { TopupComparisonTable } from './plans-comparison-table'
import { PricingInfoOverlay } from './pricing-info-overlay'

export function TopupTab() {
  const [selected, setSelected] = useState(3)
  const [showPayment, setShowPayment] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const selectedPkg = packages.find((p) => p.id === selected)

  const addBalance = useBalanceStore((s) => s.addBalance)
  const addOperation = useBalanceStore((s) => s.addOperation)

  const payAmount = selectedPkg ? parseInt(selectedPkg.price.replace(/\D/g, ''), 10) : 0

  return (
    <>
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between mb-[2px]">
          <p className="font-manrope font-semibold text-[15px] text-white">Выберите пакет</p>
          <button onClick={() => setShowPricing(true)} className="group flex items-center gap-[5px] text-[rgba(255,255,255,0.4)] hover:text-white transition-colors cursor-pointer">
            <NextImage src="/icons/info_icon.png" alt="" width={14} height={14} className="invert opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
            <span className="font-manrope font-medium text-[12px]">Цены моделей</span>
          </button>
        </div>
        {packages.map((pkg) => (
          <div key={pkg.id} className="relative">
            {pkg.badge && (
              <div className="absolute right-[16px] top-[-10px] z-[1]">
                <div className="rounded-[20px] px-[10px] py-[3px] flex items-center gap-[4px]" style={{ background: pkg.badge === 'Самый выгодный' ? 'linear-gradient(135deg, #f5d76e 0%, #c0a020 100%)' : 'linear-gradient(135deg, #ff8a3d 0%, #ff4d3d 100%)' }}>
                  <CustomIcon src={pkg.badge === 'Самый выгодный' ? '/icons/star_3_icon.png' : '/icons/fire_2_icon.png'} size={10} />
                  <span className="font-manrope font-extrabold text-[10px] text-white">{pkg.badge}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setSelected(pkg.id)}
              className={`w-full rounded-[16px] px-[24px] py-[18px] flex items-center justify-between cursor-pointer transition-all ${
                selected === pkg.id
                  ? pkg.highlight ? 'border-2 border-[#888ae5] shadow-[0_0_20px_rgba(136,138,229,0.15)]' : 'border-2 border-[#888ae5]'
                  : 'hover:bg-[rgba(255,255,255,0.02)]'
              }`}
              style={
                pkg.highlight && selected === pkg.id
                  ? { background: 'linear-gradient(90deg, rgba(100,60,160,0.5) 0%, rgba(60,180,180,0.3) 50%, rgba(200,80,120,0.3) 100%)' }
                  : { background: selected === pkg.id ? 'rgba(57,55,91,0.6)' : 'rgba(29,29,39,0.8)' }
              }
            >
              <div className="flex items-center gap-[14px]">
                <div className="relative shrink-0 size-[28px]">
                  <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={IMG_COIN} />
                </div>
                <p className="font-manrope font-extrabold leading-[24px] text-[17px] text-white">{pkg.coins} айкоинов</p>
              </div>
              <p className="font-manrope font-medium text-[15px] text-[rgba(255,255,255,0.6)]">{pkg.price}</p>
            </button>
          </div>
        ))}
        <button onClick={() => setShowPayment(true)} className="w-full h-[54px] rounded-[14px] bg-[#888ae5] hover:bg-[#9a9cf0] cursor-pointer transition-colors mt-[4px]">
          <p className="font-manrope font-black leading-[24px] text-[17px] text-white text-center">Продолжить</p>
        </button>

        {selectedPkg && (
          <div className="mt-[12px]">
            <TopupComparisonTable selectedCoins={selectedPkg.coins} />
          </div>
        )}
      </div>

      {selectedPkg && (
        <PaymentOverlay
          open={showPayment}
          onClose={() => setShowPayment(false)}
          amount={payAmount}
          label={`${selectedPkg.coins} айкоинов`}
          onSuccess={() => {
            addBalance(selectedPkg.coins)
            addOperation('topup', `Пополнение: ${selectedPkg.coins} айкоинов`, selectedPkg.coins)
            setShowPayment(false)
          }}
        />
      )}
      {showPricing && <PricingInfoOverlay onClose={() => setShowPricing(false)} />}
    </>
  )
}

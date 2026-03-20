'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { type Plan, type Period, plansArr, COMPARE_ROWS, COIN_IMG } from './subscription-data'

interface PricingComparisonProps {
  period: Period
  onSelectPlan: (plan: Plan) => void
  currentPlan: string | null
}

export function PlanComparison({ period, onSelectPlan, currentPlan }: PricingComparisonProps) {
  const paidPlans = plansArr.filter((p) => p.key !== 'basic' || true)

  return (
    <div className="w-full mt-[48px] bg-[#14131c] rounded-[24px] border border-[rgba(255,255,255,0.06)] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
      <ComparisonHeader />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <ComparisonHead period={period} onSelectPlan={onSelectPlan} currentPlan={currentPlan} />
          <ComparisonBody />
        </table>
      </div>
      <div className="p-[16px] text-center border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
        <p className="font-manrope text-[11px] text-[rgba(255,255,255,0.3)]">
          * Безлимитные запросы к базовым моделям регулируются политикой добросовестного использования для предотвращения злоупотреблений.
        </p>
      </div>
    </div>
  )
}

function ComparisonHeader() {
  return (
    <div className="p-[24px] text-center border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#888ae5] opacity-5 blur-[100px] pointer-events-none" />
      <h3 className="font-manrope font-extrabold text-[24px] text-white uppercase tracking-wider mb-[6px]">Сравнение тарифов</h3>
      <p className="font-manrope text-[14px] text-[rgba(255,255,255,0.4)]">Подробное описание лимитов и возможностей каждой подписки</p>
    </div>
  )
}

function ComparisonHead({ period, onSelectPlan, currentPlan }: PricingComparisonProps) {
  return (
    <thead>
      <tr>
        <th className="w-[34%] p-[16px] text-left align-bottom border-b border-[rgba(255,255,255,0.06)]" />
        {plansArr.map((p) => {
          const isPro = p.key === 'pro'
          const price = period === 'month' ? p.priceMonth : p.priceYear
          return (
            <th key={p.key} className={`w-[22%] p-[16px] text-left align-bottom border-b border-[rgba(255,255,255,0.06)] ${isPro ? 'bg-[#888ae5]/5 relative' : ''}`}>
              {isPro && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#888ae5] to-[#c4b5fd]" />}
              <div className="flex flex-col gap-[4px]">
                <span className={`font-manrope font-extrabold text-[18px] ${isPro ? 'text-[#888ae5]' : 'text-white'}`}>{p.label}</span>
                <span className="font-manrope text-[12px] text-[rgba(255,255,255,0.5)] h-[36px]">
                  {price}{'\u20BD'}/мес {period === 'year' ? 'Оплата за год' : 'Ежемесячно'}
                </span>
                {currentPlan === p.key ? (
                  <div className="mt-[12px] w-full h-[40px] rounded-[10px] font-manrope font-bold text-[13px] bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center gap-[6px]">
                    <Check size={14} />Текущая
                  </div>
                ) : (
                  <button onClick={() => onSelectPlan(p.key)} className={`mt-[12px] w-full h-[40px] rounded-[10px] font-manrope font-bold text-[13px] transition-all cursor-pointer ${
                    isPro ? 'bg-[#888ae5] hover:bg-[#9a9cf0] text-white shadow-[0_4px_16px_rgba(136,138,229,0.25)]' : 'bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] text-white'
                  }`}>{p.cta}</button>
                )}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

function ComparisonBody() {
  return (
    <tbody>
      {COMPARE_ROWS.map((row, i) => {
        if (row.section) {
          return (
            <tr key={`sec-${i}`}>
              <td colSpan={4} className="p-[16px] pb-[8px] pt-[24px] border-b border-[rgba(255,255,255,0.02)]">
                <span className="font-manrope font-bold text-[16px] text-white">{row.section}</span>
              </td>
            </tr>
          )
        }
        return (
          <tr key={`row-${i}`} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors group">
            <td className="p-[12px] px-[16px] border-b border-[rgba(255,255,255,0.03)] font-manrope text-[13px] text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors">
              <span className="flex items-center gap-[6px] flex-wrap">
                {row.label}
                {row.prices ? (
                  <span className="inline-flex items-center gap-[4px] text-[12px] text-white font-bold">
                    ({row.prices.map((pr, pi) => (
                      <span key={pi} className="inline-flex items-center gap-[2px]">
                        {pi > 0 && <span className="mx-[1px]">/</span>}
                        <span>{pr}</span>
                        <Image src={COIN_IMG} alt="" width={10} height={10} className="inline-block" />
                      </span>
                    ))})
                  </span>
                ) : row.price != null ? (
                  <span className="inline-flex items-center gap-[2px] text-[12px] text-white font-bold">
                    (<span>{row.price}</span><Image src={COIN_IMG} alt="" width={10} height={10} className="inline-block" />)
                  </span>
                ) : null}
              </span>
            </td>
            <CellValue value={row.basic} isCoin={row.isCoinValue} />
            <CellValue value={row.pro} isCoin={row.isCoinValue} isPro />
            <CellValue value={row.max} isCoin={row.isCoinValue} />
          </tr>
        )
      })}
    </tbody>
  )
}

function CellValue({ value, isCoin, isPro }: { value?: string; isCoin?: boolean; isPro?: boolean }) {
  return (
    <td className={`p-[12px] px-[16px] border-b border-[rgba(255,255,255,0.03)] font-manrope text-[13px] text-white font-medium ${isPro ? 'bg-[#888ae5]/5' : ''}`}>
      {isCoin && value ? (
        <span className="inline-flex items-center gap-[3px]">{value} <Image src={COIN_IMG} alt="" width={12} height={12} /></span>
      ) : value}
    </td>
  )
}

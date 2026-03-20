'use client'

import { useState } from 'react'
import { GEN_MODELS, GEN_CATS, IMG_COIN, type GenCatFilter } from './profile-data'

export function PlansComparisonTable({ columns }: { columns: { label: string; coins: number; color: string }[] }) {
  const [cat, setCat] = useState<GenCatFilter>('all')
  const filtered = cat === 'all' ? GEN_MODELS : GEN_MODELS.filter((m) => m.cat === cat)
  return (
    <div className="rounded-[16px] overflow-hidden" style={{ background: 'rgba(30,29,42,0.5)' }}>
      <div className="px-[20px] py-[14px] border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <span className="font-manrope font-semibold text-[13px] text-white">Сравнение генераций по подпискам</span>
        </div>
        <div className="flex gap-[3px] bg-[rgba(255,255,255,0.03)] rounded-[8px] p-[2px]">
          {GEN_CATS.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`px-[10px] py-[4px] rounded-[6px] text-[10px] transition-all cursor-pointer ${cat === c.key ? 'bg-[#39375b] text-white font-semibold' : 'text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(136,138,229,0.08)] font-normal'}`}>{c.label}</button>
          ))}
        </div>
      </div>
      <div className="grid px-[20px] py-[8px] border-b border-[rgba(255,255,255,0.04)]" style={{ gridTemplateColumns: `1fr repeat(${columns.length}, 100px)` }}>
        <span className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.25)] uppercase tracking-wider">Модель</span>
        {columns.map((col) => (
          <span key={col.label} className="font-manrope font-semibold text-[10px] text-center uppercase tracking-wider" style={{ color: col.color }}>{col.label}</span>
        ))}
      </div>
      {filtered.map((m, i) => (
        <div key={m.model} className={`grid px-[20px] py-[7px] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${i < filtered.length - 1 ? 'border-b border-[rgba(255,255,255,0.02)]' : ''}`} style={{ gridTemplateColumns: `1fr repeat(${columns.length}, 100px)` }}>
          <div className="flex items-center gap-[6px]">
            <span className="text-[8px] px-[4px] py-[1px] rounded-[3px] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.2)] font-medium">{m.cat === 'text' ? 'Текст' : m.cat === 'image' ? 'Фото' : 'Видео'}</span>
            <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.6)]">{m.model}</span>
            <span className="font-manrope font-bold text-[10px] text-white">{m.price}<img alt="" src={IMG_COIN} className="size-[8px] inline ml-[1px]" /></span>
          </div>
          {columns.map((col) => {
            const count = Math.floor(col.coins / m.price)
            const maxCount = Math.floor(columns[columns.length - 1].coins / m.price)
            return (
              <div key={col.label} className="flex items-center justify-center gap-[3px]">
                <span className="font-manrope font-extrabold text-[12px] text-white">{count}</span>
                <div className="w-[24px] h-[3px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`, backgroundColor: col.color, opacity: 0.6 }} />
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function TopupComparisonTable({ selectedCoins }: { selectedCoins: number }) {
  const [cat, setCat] = useState<GenCatFilter>('all')
  const filtered = cat === 'all' ? GEN_MODELS : GEN_MODELS.filter((m) => m.cat === cat)
  return (
    <div className="rounded-[16px] overflow-hidden" style={{ background: 'rgba(30,29,42,0.5)' }}>
      <div className="px-[20px] py-[14px] border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <span className="font-manrope font-semibold text-[13px] text-white">Генерации за {selectedCoins} айкоинов</span>
        </div>
        <div className="flex gap-[3px] bg-[rgba(255,255,255,0.03)] rounded-[8px] p-[2px]">
          {GEN_CATS.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`px-[10px] py-[4px] rounded-[6px] text-[10px] transition-all cursor-pointer ${cat === c.key ? 'bg-[#39375b] text-white font-semibold' : 'text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(136,138,229,0.08)] font-normal'}`}>{c.label}</button>
          ))}
        </div>
      </div>
      {filtered.map((m, i) => {
        const count = Math.floor(selectedCoins / m.price)
        return (
          <div key={m.model} className={`flex items-center justify-between px-[20px] py-[7px] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${i < filtered.length - 1 ? 'border-b border-[rgba(255,255,255,0.02)]' : ''}`}>
            <div className="flex items-center gap-[6px]">
              <span className="text-[8px] px-[4px] py-[1px] rounded-[3px] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.2)] font-medium">{m.cat === 'text' ? 'Текст' : m.cat === 'image' ? 'Фото' : 'Видео'}</span>
              <span className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.6)]">{m.model}</span>
              <span className="font-manrope font-bold text-[10px] text-white">{m.price}<img alt="" src={IMG_COIN} className="size-[8px] inline ml-[1px]" /></span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[50px] h-[4px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#888ae5]" style={{ width: `${Math.min((count / 200) * 100, 100)}%`, opacity: 0.6 }} />
              </div>
              <span className="font-manrope font-extrabold text-[12px] text-white w-[40px] text-right">{count}</span>
              <span className="font-manrope font-normal text-[9px] text-[rgba(255,255,255,0.2)]">ген.</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

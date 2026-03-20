'use client'

import { TrendingUp, Link2 } from 'lucide-react'
import { IMG_COIN } from './profile-data'

export function ReferralBalanceStats({ onConvert, onWithdraw }: { onConvert: () => void; onWithdraw: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
      <div className="rounded-[20px] overflow-hidden relative bg-[#181722]">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#888ae5]/5 blur-[60px] rounded-full pointer-events-none" />
        <div className="px-[24px] py-[20px] relative z-10">
          <p className="font-manrope font-bold text-[13px] text-[rgba(255,255,255,0.4)] uppercase tracking-[0.08em] mb-[8px]">Реферальный баланс</p>
          <p className="font-manrope font-black text-[32px] text-white leading-[36px] mb-[20px]">1 000{'\u20BD'}</p>
          <div className="flex gap-[10px]">
            <button onClick={onConvert} className="flex-1 rounded-[12px] py-[10px] cursor-pointer transition-all hover:brightness-110 shadow-[0_4px_12px_rgba(136,138,229,0.2)]" style={{ background: '#888ae5' }}>
              <span className="font-manrope font-bold text-[12px] text-white flex items-center justify-center gap-[6px]"><img alt="" src={IMG_COIN} className="size-[14px]" />В айкоины</span>
            </button>
            <button onClick={onWithdraw} className="flex-1 rounded-[12px] py-[10px] cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
              <span className="font-manrope font-bold text-[12px] text-white flex items-center justify-center gap-[6px]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 11h8a4 4 0 0 0 0-8H9v18"/><path d="M6 15h8"/></svg>Вывести</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-[#181722]/50 overflow-hidden shadow-sm">
        <div className="px-[24px] py-[20px] flex flex-col justify-between h-full">
          {[
            { label: 'Заработано всего', value: '2 500\u20BD', color: '#6bc085', icon: <TrendingUp size={14} /> },
            { label: 'Приглашено', value: '12 чел.', color: '#888ae5', icon: <Link2 size={14} /> },
            { label: 'Выведено', value: '1 500\u20BD', color: '#e06fe2', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 11h8a4 4 0 0 0 0-8H9v18"/><path d="M6 15h8"/></svg> },
          ].map((s, i) => (
            <div key={i} className={`flex items-center justify-between py-[8px] ${i < 2 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''}`}>
              <div className="flex items-center gap-[8px]">
                <span style={{ color: s.color }} className="bg-white/5 p-[4px] rounded-md">{s.icon}</span>
                <span className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.5)]">{s.label}</span>
              </div>
              <span className="font-manrope font-bold text-[14px] text-white">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

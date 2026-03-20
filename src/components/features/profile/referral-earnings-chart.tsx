'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { dayChart, weekChart, monthChart } from './referral-data'

type EarningsPeriod = 'day' | 'week' | 'month'

export function ReferralEarningsChart() {
  const [earningsPeriod, setEarningsPeriod] = useState<EarningsPeriod>('week')
  const earningsChartData = earningsPeriod === 'day' ? dayChart : earningsPeriod === 'week' ? weekChart : monthChart
  const earningsTotal = earningsChartData.reduce((s, d) => s + d.earned, 0)

  return (
    <div className="rounded-[20px] bg-[#181722]/50 px-[24px] pt-[20px] pb-[16px] shadow-sm">
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <p className="font-manrope font-bold text-[16px] text-white leading-[20px]">Заработок</p>
          <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.4)] mt-[4px]">{earningsTotal.toLocaleString('ru-RU')}{'\u20BD'} за {earningsPeriod === 'day' ? 'сегодня' : earningsPeriod === 'week' ? 'неделю' : 'месяц'}</p>
        </div>
        <div className="w-[220px]">
          <AnimatedToggle<EarningsPeriod>
            options={[
              { key: 'day', label: 'День' },
              { key: 'week', label: 'Неделя' },
              { key: 'month', label: 'Месяц' },
            ]}
            value={earningsPeriod}
            onChange={setEarningsPeriod}
            size="sm"
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={earningsPeriod}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col"
          style={{ height: 150 }}
        >
          <ChartSvg data={earningsChartData} />
          <div className="flex justify-between px-[2px] mt-[4px]">
            {earningsChartData.map((d, i) => (
              <span key={`label-${d.label}-${i}`} className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.3)]">{d.label}</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ChartSvg({ data }: { data: { label: string; earned: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.earned), 1)
  const W = 460; const H = 120; const padX = 30; const padY = 10
  const innerW = W - padX * 2; const innerH = H - padY * 2
  const pts = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    y: padY + innerH - (d.earned / maxVal) * innerH,
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#888ae5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#888ae5" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#888ae5" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#888ae5" stopOpacity="1" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((pct) => (
        <line key={pct} x1={padX} x2={W - padX} y1={padY + innerH * (1 - pct)} y2={padY + innerH * (1 - pct)} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
      ))}
      <motion.path d={areaPath} fill="url(#areaGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="10" fill="transparent" className="cursor-pointer" />
          <motion.circle cx={p.x} cy={p.y} r="3.5" fill="#888ae5" stroke="#19181e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.08 }} />
          <title>{data[i].earned}{'\u20BD'}</title>
        </g>
      ))}
      {pts.map((p, i) => (
        <text key={`v-${i}`} x={p.x} y={p.y - 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="600" fontFamily="Manrope, sans-serif">{data[i].earned > 0 ? `${data[i].earned}\u20BD` : ''}</text>
      ))}
    </svg>
  )
}

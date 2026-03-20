'use client'

import { motion } from 'motion/react'

export function ScoreRing({ score, size = 48, strokeWidth = 4, color }: { score: number; size?: number; strokeWidth?: number; color?: string }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const c = color || (score >= 90 ? "#4ade80" : score >= 80 ? "#888ae5" : score >= 70 ? "#fbbf24" : "#f87171")

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="text-white relative z-[1]" style={{ fontSize: size * 0.3, fontWeight: 800 }}>{score}</span>
    </div>
  )
}

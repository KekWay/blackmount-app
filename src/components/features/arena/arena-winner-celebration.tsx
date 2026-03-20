'use client'

import { motion } from 'motion/react'
import type { ModelResponse } from './arena-data'
import { MIcon } from './arena-micon'

interface Props {
  winnerResponse: ModelResponse
}

export function ArenaWinnerCelebration({ winnerResponse }: Props) {
  return (
    <>
      {/* Background celebration glows */}
      <motion.div
        className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ background: 'radial-gradient(ellipse, rgba(136,138,229,0.6) 0%, rgba(168,90,220,0.2) 40%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <motion.div
        className="absolute top-[10px] left-[20%] w-[200px] h-[200px] rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0.05, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />
      <motion.div
        className="absolute top-[30px] right-[20%] w-[180px] h-[180px] rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.08, 0.04, 0.08] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ background: 'radial-gradient(circle, rgba(224,111,226,0.3) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />

      {/* Confetti particles */}
      {[...Array(12)].map((_, pi) => (
        <motion.div
          key={`particle-${pi}`}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            left: `${15 + Math.random() * 70}%`,
            top: `${-5 + Math.random() * 15}%`,
            backgroundColor: ['#c4b5fd', '#888ae5', '#e06fe2', '#FFD700', '#4ade80', '#f472b6'][pi % 6],
          }}
          initial={{ opacity: 0, y: -20, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0.6, 0],
            y: [0, 60 + Math.random() * 120, 150 + Math.random() * 100],
            x: [-20 + Math.random() * 40, -30 + Math.random() * 60],
            scale: [0, 1.2, 0.8, 0],
            rotate: [0, 180 + Math.random() * 360],
          }}
          transition={{ duration: 2 + Math.random() * 1.5, delay: 0.2 + pi * 0.08, ease: 'easeOut' }}
        />
      ))}

      {/* Winner name badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
        className="flex flex-col items-center gap-[10px] z-[1]"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex items-center gap-[8px] px-[18px] py-[8px] rounded-[12px] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(136,138,229,0.12) 0%, rgba(168,90,220,0.08) 100%)', border: '1px solid rgba(136,138,229,0.2)', boxShadow: '0 2px 12px rgba(136,138,229,0.1)' }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', width: '40%' }}
          />
          <MIcon model={winnerResponse.model} size={22} />
          <span className="text-[15px] text-[#c4b5fd] font-bold">{winnerResponse.model.name}</span>
          <span className="text-[11px] text-[rgba(255,255,255,0.35)] ml-[2px]">победил в битве</span>
        </motion.div>
      </motion.div>
    </>
  )
}

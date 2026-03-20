'use client'

import { motion } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'

export function AuthHero() {
  return (
    <aside className="w-[50%] relative overflow-hidden">
      <img
        alt="Black Mount AI"
        className="absolute inset-0 w-full h-full object-cover"
        src={APP_ASSETS.heroAuth}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,13,15,0.5) 0%, rgba(13,13,15,0.1) 30%, rgba(13,13,15,0.3) 70%, rgba(13,13,15,0.8) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(13,13,15,0.6) 0%, transparent 30%)' }} />

      {/* Logo + tagline centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="relative size-[80px] mb-[24px]">
            <img alt="Black Mount logo" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full drop-shadow-[0_4px_30px_rgba(136,138,229,0.3)]" src={APP_ASSETS.logo} />
          </div>
          <h2 className="font-bakbak text-[36px] text-white leading-[44px] mb-[12px] drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">BLACK MOUNT</h2>
          <p className="font-manrope font-normal text-[16px] text-[rgba(255,255,255,0.6)] text-center leading-[24px] max-w-[320px]">
            Вершины возможностей
          </p>
        </motion.div>
      </div>

      {/* Subtle animated glow */}
      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-15 pointer-events-none bg-[#888ae5] animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-[20%] right-[30%] w-[200px] h-[200px] rounded-full blur-[100px] opacity-10 pointer-events-none bg-[#c27c0a] animate-pulse" aria-hidden="true" />
    </aside>
  )
}

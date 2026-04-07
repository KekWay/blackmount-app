'use client'

import { motion } from 'motion/react'
import type { ArenaModel } from '@/data/arena-models'
import { useSubscriptionStore } from '@/stores/subscription'
import { FREE_ARENA_IDS, IMG_COIN, SVG_VS_PATH } from './arena-data'
import { MIcon } from './arena-micon'

interface Props {
  selectedModels: ArenaModel[]
  gridCols: number
}

export function ArenaIdleView({ selectedModels, gridCols }: Props) {
  const hasSub = useSubscriptionStore((s) => s.hasActiveSubscription())

  return (
    <div className="h-full flex flex-col">
      {selectedModels.length === 0 ? (
        <ArenaWelcome />
      ) : (
        <div className="flex-1 p-[20px]">
          <div className={`grid grid-cols-${gridCols} gap-[10px] h-full`} style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
            {selectedModels.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-[16px] bg-[rgba(255,255,255,0.02)] ring-1 ring-[rgba(255,255,255,0.03)] overflow-hidden flex flex-col">
                <div className="flex items-center gap-[8px] px-[16px] py-[10px] border-b border-[rgba(255,255,255,0.04)]">
                  <MIcon model={m} size={22} />
                  <span className="text-[13px] text-white font-semibold">{m.name}</span>
                  <span className="text-[9px] text-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-[5px] py-[1px] rounded-[4px]">{hasSub && FREE_ARENA_IDS.has(m.id) ? 0 : m.price}<img alt="" src={IMG_COIN} className="size-[8px] inline ml-[2px]" /></span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[12px] text-[rgba(255,255,255,0.12)]">Ожидание промпта...</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ArenaWelcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-[16px] md:px-[24px] lg:px-[40px]">
      <motion.div className="flex flex-col items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* VS Logo */}
        <div className="relative w-[95px] h-[77px] mb-[4px]">
          <div className="absolute left-[28px] top-0 w-[45.479px] h-[66.317px] flex items-center justify-center">
            <div className="flex-none rotate-[88.57deg]">
              <div className="h-[43.862px] relative w-[65.242px]">
                <div className="absolute inset-[-20.25%_-4.32%_-11.43%_-9.34%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.1546 57.7593">
                    <path d={SVG_VS_PATH} stroke="#986FB8" strokeWidth="6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <p className="absolute left-0 top-0 font-bakbak text-[96px] leading-[22px] text-white h-[50px] w-[51px]">v</p>
          <p className="absolute left-[46px] top-[25px] font-bakbak text-[96px] leading-[22px] text-white h-[52px] w-[49px]">s</p>
        </div>
        <div className="flex flex-col items-center gap-[14px]">
          <h2 className="text-[22px] text-white font-bold">Арена моделей</h2>
          <p className="text-[13px] text-[rgba(255,255,255,0.35)] text-center max-w-[400px] leading-[20px]">
            Сравни ответы нейросетей бок о бок. Выбери 2-4 модели через кнопку выше, задай промпт и определи победителя.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

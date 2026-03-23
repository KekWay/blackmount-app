import type { ArenaModel } from '@/data/arena-models'

interface Props {
  selectedModels: ArenaModel[]
  canAfford: boolean
  totalCost: number
  balance: number
}

export function ArenaInputHints({ selectedModels, canAfford, totalCost, balance }: Props) {
  if (selectedModels.length === 0) return null

  return (
    <div className="flex justify-center px-[16px] md:px-[24px] lg:px-[40px] shrink-0">
      <div className="w-full max-w-[620px]">
        {selectedModels.length > 0 && selectedModels.length < 2 && (
          <p className="text-[11px] text-[rgba(255,255,255,0.25)] ml-[26px]">Выбери минимум 2 модели</p>
        )}
        {selectedModels.length >= 2 && !canAfford && (
          <p className="text-[11px] text-[#f87171] ml-[26px]">Недостаточно кредитов (нужно {totalCost}, баланс {balance})</p>
        )}
      </div>
    </div>
  )
}

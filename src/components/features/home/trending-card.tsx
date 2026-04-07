/**
 * TrendingCard — matches Figma design exactly.
 * Layout: name top-left, users+% top-right, #rank mid-left,
 * model image bottom-right (decorative), trend+% bottom-left.
 */
import { TrendingUp } from 'lucide-react'
import { ModelIcon } from '@/components/shared/model-icon'

interface TrendingCardProps {
  modelId: string
  versionLabel: string
  rank: number
  usage: number
  change: number
  category: 'text' | 'image' | 'video'
  onClick: () => void
}

const placeColors = [
  '#FFD700', '#C0C0D2', '#CD7F32',
]

export function TrendingCard({ modelId, versionLabel, rank, usage, change, onClick }: TrendingCardProps) {
  const rankColor = rank <= 3 ? placeColors[rank - 1] : 'rgba(255,255,255,0.25)'
  const changeColor = change >= 0 ? '#4ade80' : '#f87171'

  return (
    <button
      onClick={onClick}
      className="group relative bg-[#1a1924] rounded-[16px] overflow-clip transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer w-full"
      style={{ height: 155 }}
    >
      {/* Model image — bottom right, matches Figma: left:177/267≈66%, top:81/155≈52% */}
      <div className="absolute right-[-12px] bottom-0 w-[108px] h-[86px] opacity-70 group-hover:opacity-90 transition-opacity pointer-events-none">
        <ModelIcon modelId={modelId} size={108} />
      </div>

      {/* Name — top left, 16px bold white */}
      <div className="absolute left-[15px] top-[22px] h-[24px] overflow-clip" style={{ width: 'calc(100% - 90px)' }}>
        <p className="font-manrope font-bold text-[16px] text-white leading-[24px] whitespace-nowrap truncate">{versionLabel}</p>
      </div>

      {/* Users icon + usage % — top right */}
      <div className="absolute right-[15px] top-[25px] flex items-center gap-[6px]">
        <img src="/icons/users_icon.png" alt="" width={13} height={13} className="shrink-0 [filter:brightness(0)_saturate(100%)_invert(55%)_sepia(50%)_saturate(600%)_hue-rotate(210deg)]" />
        <span className="font-manrope font-bold text-[12px] text-[#888ae5] leading-[18px] whitespace-nowrap">{usage}%</span>
      </div>

      {/* Rank # — mid left */}
      <p className="absolute left-[15px] top-[55px] font-manrope font-extrabold text-[20px] leading-[20px] whitespace-nowrap" style={{ color: rankColor }}>#{rank}</p>

      {/* Trend icon + change % — bottom left */}
      <div className="absolute left-[16px] bottom-[13px] flex items-center gap-[6px]">
        <TrendingUp size={14} className="shrink-0" style={{ color: changeColor }} />
        <span className="font-manrope font-bold text-[12px] leading-[18px] whitespace-nowrap" style={{ color: changeColor }}>{Math.abs(change)}%</span>
      </div>
    </button>
  )
}

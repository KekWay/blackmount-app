'use client'

import { ModelIcon } from '@/components/shared/model-icon'
import { getModelById } from '@/data/ai-models'

const SITE_LOGO = '/assets/models/logo.png'

export interface PendingGen {
  id: string
  modelId: string
  type: 'image' | 'video' | 'text'
  status: 'pending' | 'completed'
  startedAt: number
  prompt: string
  sessionId?: string
}

export function HistoryPendingCard({ gen }: { gen: PendingGen }) {
  const model = getModelById(gen.modelId)
  const colors = model?.glowColors ?? ['#888ae5', '#65ded8']
  const c1 = colors[0]
  const c2 = colors[1] ?? colors[0]

  return (
    <div className="aspect-square rounded-[14px] overflow-hidden relative">
      <div
        className="absolute inset-0 animate-shimmer-card"
        style={{
          background: `linear-gradient(-45deg, ${c1}22, ${c2}33, ${c1}15, ${c2}28)`,
          backgroundSize: '300% 300%',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px]">
        <div className="relative">
          <img
            src={SITE_LOGO}
            alt=""
            className="size-[36px] object-contain animate-pulse-slow"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }}
          />
          <div
            className="absolute -inset-[8px] rounded-full animate-ping-slow opacity-30"
            style={{ background: `radial-gradient(circle, ${c1}40, transparent 70%)` }}
          />
        </div>
        <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-medium text-center px-[8px] line-clamp-2">
          Генерация...
        </p>
      </div>
      <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[5px] bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] rounded-[8px] px-[6px] py-[3px]">
        {model && <ModelIcon modelId={model.id} size={14} />}
        <span className="font-manrope font-medium text-[10px] text-[rgba(255,255,255,0.5)]">
          {gen.prompt || model?.name || ''}
        </span>
      </div>
      <style>{`
        @keyframes shimmerCard {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        .animate-shimmer-card { animation: shimmerCard 3s ease infinite; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .animate-ping-slow { animation: pingSlow 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

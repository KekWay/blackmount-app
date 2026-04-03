'use client'

import { Maximize2, Minimize2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { ModelResponse } from './arena-data'
import { IMG_MEDAL1 } from './arena-data'
import { MIcon } from './arena-micon'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'

interface Props {
  responses: ModelResponse[]
  gridCols: number
  expandedId: string | null
  onVote: (id: string) => void
  onToggleExpand: (id: string) => void
}

export function ArenaVotingView({ responses, gridCols, expandedId, onVote, onToggleExpand }: Props) {
  return (
    <div className="h-full flex flex-col">
      <p className="text-[11px] text-[rgba(255,255,255,0.2)] text-center mb-[6px]">
        Нажми на карточку, чтобы выбрать победителя
      </p>
      <div className="flex-1 px-[20px] pb-[16px]">
        {expandedId ? (
          <ExpandedCard responses={responses} expandedId={expandedId} onVote={onVote} onToggleExpand={onToggleExpand} />
        ) : (
          <VotingGrid responses={responses} gridCols={gridCols} onVote={onVote} onToggleExpand={onToggleExpand} />
        )}
      </div>
    </div>
  )
}

function ExpandedCard({ responses, expandedId, onVote, onToggleExpand }: { responses: ModelResponse[]; expandedId: string; onVote: (id: string) => void; onToggleExpand: (id: string) => void }) {
  const r = responses.find((x) => x.model.id === expandedId)
  if (!r) return null
  return (
    <div className="h-full flex flex-col">
      <motion.div key={r.model.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-[rgba(136,138,229,0.15)] overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-[8px]">
            <MIcon model={r.model} size={22} />
            <span className="text-[13px] text-white font-semibold">{r.model.name}</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <button onClick={(e) => { e.stopPropagation(); onToggleExpand(r.model.id) }} className="text-[rgba(255,255,255,0.3)] hover:text-white transition-colors cursor-pointer p-[4px] rounded-[6px] hover:bg-[rgba(255,255,255,0.06)]" title="Свернуть">
              <Minimize2 size={13} />
            </button>
          </div>
        </div>
        <div className="flex-1 px-[16px] py-[14px] overflow-y-auto chat-scrollbar">
          <MarkdownRenderer content={r.text} />
        </div>
        <div onClick={() => onVote(r.model.id)} className="px-[16px] py-[10px] border-t border-[rgba(255,255,255,0.04)] flex items-center justify-center gap-[6px] bg-[rgba(136,138,229,0.04)] hover:bg-[rgba(136,138,229,0.08)] transition-all cursor-pointer">
          <div className="shrink-0 w-[12px] h-[12px] bg-[#888ae5]" style={{ maskImage: `url('${IMG_MEDAL1}')`, WebkitMaskImage: `url('${IMG_MEDAL1}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
          <span className="text-[11px] text-[#888ae5] font-semibold">Выбрать победителем</span>
        </div>
      </motion.div>
    </div>
  )
}

function VotingGrid({ responses, gridCols, onVote, onToggleExpand }: { responses: ModelResponse[]; gridCols: number; onVote: (id: string) => void; onToggleExpand: (id: string) => void }) {
  return (
    <div className="flex flex-col md:grid gap-[10px] h-full" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
      {responses.map((r, i) => (
        <motion.div key={r.model.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} onClick={() => onVote(r.model.id)} className="rounded-[16px] bg-[rgba(255,255,255,0.02)] ring-1 ring-[rgba(255,255,255,0.03)] overflow-hidden flex flex-col hover:ring-[#888ae5]/50 hover:bg-[rgba(136,138,229,0.05)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-[8px]">
              <MIcon model={r.model} size={22} />
              <span className="text-[13px] text-white font-semibold">{r.model.name}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onToggleExpand(r.model.id) }} className="text-[rgba(255,255,255,0.12)] hover:text-[rgba(255,255,255,0.4)] transition-colors cursor-pointer p-[4px] rounded-[6px] hover:bg-[rgba(255,255,255,0.06)]" title="Развернуть">
              <Maximize2 size={13} />
            </button>
          </div>
          <div className="flex-1 px-[16px] py-[14px] overflow-y-auto chat-scrollbar">
            <MarkdownRenderer content={r.text} />
          </div>
          <div className="px-[16px] py-[8px] border-t border-[rgba(255,255,255,0.04)] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-[6px] bg-[rgba(136,138,229,0.04)]">
            <div className="shrink-0 w-[12px] h-[12px] bg-[#888ae5]" style={{ maskImage: `url('${IMG_MEDAL1}')`, WebkitMaskImage: `url('${IMG_MEDAL1}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
            <span className="text-[11px] text-[#888ae5] font-semibold">Выбрать победителем</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

'use client'

import { Hash } from 'lucide-react'
import { CustomIcon } from '@/components/shared/custom-icon'
import type { DocSection } from './knowledge-types'

interface KnowledgeSectionProps {
  section: DocSection
  glowColor: string
  isLast: boolean
  sectionRef: (el: HTMLDivElement | null) => void
}

export function KnowledgeSection({ section: sec, glowColor, isLast, sectionRef }: KnowledgeSectionProps) {
  return (
    <div ref={sectionRef}>
      {/* Section header with anchor-style hash */}
      <div className="flex items-center gap-[10px] mb-[16px] group">
        <Hash size={14} className="text-[rgba(255,255,255,0.15)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-[8px]">
          <span className="text-[#888ae5]">{sec.icon}</span>
          <h2 className="text-[18px] text-white font-semibold">{sec.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pl-[24px] flex flex-col gap-[10px]">
        {sec.id === 'versions' ? (
          <div className="flex flex-col gap-[6px]">
            {sec.content.map((item, pi) => (
              <div key={pi} className="flex items-start gap-[10px] py-[8px] px-[12px] rounded-[10px] bg-[rgba(255,255,255,0.02)]">
                <div className="mt-[2px] size-[6px] rounded-full shrink-0" style={{ backgroundColor: glowColor, opacity: 0.5 }} />
                <p className="text-[13px] text-[rgba(255,255,255,0.6)] leading-[20px]">{item}</p>
              </div>
            ))}
          </div>
        ) : sec.id === 'usecases' ? (
          <div className="grid grid-cols-2 gap-[8px]">
            {sec.content.map((item, pi) => (
              <div key={pi} className="flex items-start gap-[8px] px-[12px] py-[10px] rounded-[10px] bg-[rgba(255,255,255,0.02)]">
                <CustomIcon src="/icons/litle_arrow_right.png" size={12} className="mt-[3px] shrink-0" />
                <p className="text-[13px] text-[rgba(255,255,255,0.55)] leading-[19px]">{item}</p>
              </div>
            ))}
          </div>
        ) : sec.id === 'prompts' || sec.id === 'tips' ? (
          <div className="flex flex-col gap-[8px]">
            {sec.content.map((item, pi) => (
              <div key={pi} className="flex items-start gap-[12px] py-[10px] px-[14px] rounded-[10px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                <span className="text-[11px] text-[rgba(136,138,229,0.6)] mt-[2px] shrink-0 font-bold">
                  {String(pi + 1).padStart(2, '0')}
                </span>
                <p className="text-[13px] text-[rgba(255,255,255,0.6)] leading-[21px]">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          sec.content.map((paragraph, pi) => (
            <p key={pi} className="text-[13.5px] text-[rgba(255,255,255,0.55)] leading-[23px]">{paragraph}</p>
          ))
        )}
      </div>

      {/* Section divider */}
      {!isLast && (
        <div className="h-px bg-[rgba(255,255,255,0.04)] mt-[36px]" />
      )}
    </div>
  )
}

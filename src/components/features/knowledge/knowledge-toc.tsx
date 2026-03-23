'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import type { DocSection } from './knowledge-types'

interface KnowledgeTocProps {
  sections: DocSection[]
  activeSection: string
  onScrollToSection: (sectionId: string) => void
  modelId: string
  modelName: string
  mobile?: boolean
}

export function KnowledgeToc({
  sections,
  activeSection,
  onScrollToSection,
  modelId,
  modelName,
  mobile,
}: KnowledgeTocProps) {
  const router = useRouter()

  return (
    <div className={`${mobile ? 'block' : 'hidden lg:block'} w-[190px] shrink-0 ${mobile ? '' : 'sticky top-0 self-start'} pt-[24px] lg:pt-[100px] pr-[20px] pl-[8px]`}>
      <p className="text-[10px] text-[rgba(255,255,255,0.25)] uppercase tracking-[0.08em] mb-[12px] px-[8px] font-semibold">
        На этой странице
      </p>
      <div className="flex flex-col gap-[1px]">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id
          return (
            <button
              key={sec.id}
              onClick={() => onScrollToSection(sec.id)}
              className={`flex items-center gap-[6px] px-[8px] py-[6px] rounded-[8px] text-left transition-all cursor-pointer border-l-2 ${
                isActive
                  ? 'border-[#888ae5] text-white bg-[rgba(136,138,229,0.06)]'
                  : 'border-transparent text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              <span className={`text-[11.5px] leading-[16px] ${isActive ? 'font-medium' : 'font-normal'}`}>{sec.title}</span>
            </button>
          )
        })}
      </div>

      {/* Quick link to chat */}
      <div className="mt-[20px] pt-[16px] border-t border-[rgba(255,255,255,0.04)] px-[8px]">
        <button
          onClick={() => router.push(`/chat/${modelId}`)}
          className="flex items-center gap-[6px] text-[11px] text-[rgba(136,138,229,0.7)] hover:text-[#888ae5] transition-colors cursor-pointer"
        >
          <ArrowRight size={11} />
          <span>Попробовать {modelName}</span>
        </button>
      </div>
    </div>
  )
}

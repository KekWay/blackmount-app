'use client'

import { type RefObject, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { AIModel } from '@/types/models'
import type { ModelDocs } from './knowledge-types'
import { KnowledgeHero } from './knowledge-hero'
import { KnowledgeInstructions } from './knowledge-instructions'
import { KnowledgeSection } from './knowledge-section'
import { KnowledgeCta } from './knowledge-cta'

function KnowledgeSkeleton() {
  return (
    <div className="max-w-[720px] mx-auto px-[16px] md:px-[24px] lg:px-[48px] py-[24px] md:py-[36px] space-y-[24px] animate-pulse">
      <div className="h-[28px] w-[200px] rounded-[8px] bg-[rgba(255,255,255,0.06)]" />
      <div className="space-y-[12px]">
        <div className="h-[16px] w-full rounded-[6px] bg-[rgba(255,255,255,0.04)]" />
        <div className="h-[16px] w-[85%] rounded-[6px] bg-[rgba(255,255,255,0.04)]" />
        <div className="h-[16px] w-[70%] rounded-[6px] bg-[rgba(255,255,255,0.04)]" />
      </div>
      <div className="h-[28px] w-[160px] rounded-[8px] bg-[rgba(255,255,255,0.06)]" />
      <div className="space-y-[12px]">
        <div className="h-[16px] w-full rounded-[6px] bg-[rgba(255,255,255,0.04)]" />
        <div className="h-[16px] w-[90%] rounded-[6px] bg-[rgba(255,255,255,0.04)]" />
      </div>
    </div>
  )
}

interface KnowledgeContentProps {
  model: AIModel
  docs: ModelDocs
  glowColor: string
  activeInstruction: number
  onSetActiveInstruction: (idx: number) => void
  sectionRefs: RefObject<Record<string, HTMLDivElement | null>>
}

export function KnowledgeContent({
  model,
  docs,
  glowColor,
  activeInstruction,
  onSetActiveInstruction,
  sectionRefs,
}: KnowledgeContentProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [model.id])

  if (isTransitioning) return <KnowledgeSkeleton />

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={model.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="max-w-[720px] mx-auto px-[16px] md:px-[24px] lg:px-[48px] py-[24px] md:py-[36px]"
      >
        {/* Hero header */}
        <KnowledgeHero model={model} intro={docs.intro} />

        {/* Divider */}
        <div className="h-px bg-[rgba(255,255,255,0.06)] mb-[32px]" />

        {/* Quick start — GIF instruction area */}
        <KnowledgeInstructions
          modelId={model.id}
          glowColor={glowColor}
          instructions={docs.instructions}
          activeInstruction={activeInstruction}
          onSetActiveInstruction={onSetActiveInstruction}
        />

        {/* Divider */}
        <div className="h-px bg-[rgba(255,255,255,0.06)] mb-[32px]" />

        {/* Documentation sections */}
        <div className="flex flex-col gap-[36px]">
          {docs.sections.map((sec, si) => (
            <KnowledgeSection
              key={sec.id}
              section={sec}
              glowColor={glowColor}
              isLast={si === docs.sections.length - 1}
              sectionRef={(el) => { sectionRefs.current[sec.id] = el }}
            />
          ))}
        </div>

        {/* CTA */}
        <KnowledgeCta
          modelId={model.id}
          modelName={model.name}
          glowColor={glowColor}
        />
      </motion.div>
    </AnimatePresence>
  )
}

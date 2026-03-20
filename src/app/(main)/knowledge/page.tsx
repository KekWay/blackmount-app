'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { aiModels } from '@/data/ai-models'
import { getModelDocs } from '@/components/features/knowledge/knowledge-data'
import { KnowledgeSidebar } from '@/components/features/knowledge/knowledge-sidebar'
import { KnowledgeContent } from '@/components/features/knowledge/knowledge-content'
import { KnowledgeToc } from '@/components/features/knowledge/knowledge-toc'

export default function KnowledgePage() {
  const [selectedModelId, setSelectedModelId] = useState('chatgpt')
  const [activeInstruction, setActiveInstruction] = useState(0)
  const [activeSection, setActiveSection] = useState('about')
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const model = aiModels.find((m) => m.id === selectedModelId) || aiModels[0]
  const docs = getModelDocs(model)
  const glowColor = model.glowColors[0] || '#888ae5'

  /* scroll to section */
  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    const el = sectionRefs.current[sectionId]
    if (el && scrollContainerRef.current) {
      const top = el.offsetTop - (contentRef.current?.offsetTop || 0) - 24
      scrollContainerRef.current.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  /* Track scroll position to highlight active section */
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handler = () => {
      const scrollTop = container.scrollTop + 100
      let current = docs.sections[0]?.id
      for (const sec of docs.sections) {
        const el = sectionRefs.current[sec.id]
        if (el && el.offsetTop - (contentRef.current?.offsetTop || 0) <= scrollTop) {
          current = sec.id
        }
      }
      if (current) setActiveSection(current)
    }
    container.addEventListener('scroll', handler, { passive: true })
    return () => container.removeEventListener('scroll', handler)
  }, [docs.sections])

  /* Reset instruction when model changes */
  useEffect(() => {
    setActiveInstruction(0)
    setActiveSection('about')
    scrollContainerRef.current?.scrollTo({ top: 0 })
  }, [selectedModelId])

  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* LEFT SIDEBAR */}
      <KnowledgeSidebar
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
      />

      {/* MAIN CONTENT */}
      <div ref={scrollContainerRef} className="flex-1 min-w-0 flex overflow-y-auto chat-scrollbar">
        <div ref={contentRef} className="flex-1 min-w-0">
          <KnowledgeContent
            model={model}
            docs={docs}
            glowColor={glowColor}
            activeInstruction={activeInstruction}
            onSetActiveInstruction={setActiveInstruction}
            sectionRefs={sectionRefs}
          />
        </div>

        {/* RIGHT: Table of contents */}
        <KnowledgeToc
          sections={docs.sections}
          activeSection={activeSection}
          onScrollToSection={scrollToSection}
          modelId={model.id}
          modelName={model.name}
        />
      </div>
    </div>
  )
}

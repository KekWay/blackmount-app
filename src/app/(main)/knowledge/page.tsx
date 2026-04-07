'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CustomIcon } from '@/components/shared/custom-icon'
import Image from 'next/image'
import { aiModels } from '@/data/ai-models'
import { getModelDocs } from '@/components/features/knowledge/knowledge-data'
import { KnowledgeSidebar } from '@/components/features/knowledge/knowledge-sidebar'
import { KnowledgeContent } from '@/components/features/knowledge/knowledge-content'
import { KnowledgeToc } from '@/components/features/knowledge/knowledge-toc'

export default function KnowledgePage() {
  const [selectedModelId, setSelectedModelId] = useState('chatgpt')
  const [activeInstruction, setActiveInstruction] = useState(0)
  const [activeSection, setActiveSection] = useState('about')
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const model = aiModels.find((m) => m.id === selectedModelId) || aiModels[0]
  const docs = getModelDocs(model)
  const glowColor = model.glowColors[0] || '#888ae5'

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    const el = sectionRefs.current[sectionId]
    if (el && scrollContainerRef.current) {
      const top = el.offsetTop - (contentRef.current?.offsetTop || 0) - 24
      scrollContainerRef.current.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

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

  useEffect(() => {
    setActiveInstruction(0)
    setActiveSection('about')
    scrollContainerRef.current?.scrollTo({ top: 0 })
  }, [selectedModelId])

  const handleSelectModel = (id: string) => {
    setSelectedModelId(id)
    setLeftOpen(false)
  }

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId)
    setRightOpen(false)
  }

  return (
    <div className="w-full h-full flex overflow-hidden relative">
      {/* LEFT SIDEBAR — desktop */}
      <KnowledgeSidebar
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
      />

      {/* LEFT SIDEBAR — mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${
          leftOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setLeftOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[60] w-[260px] bg-[#121118] border-r border-[rgba(255,255,255,0.06)] flex flex-col transition-transform duration-300 ease-out md:hidden ${
          leftOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button onClick={() => setLeftOpen(false)} className="group absolute top-[12px] right-[12px] size-[28px] flex items-center justify-center rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer z-10" aria-label="Закрыть">
          <Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
        </button>
        <KnowledgeSidebar selectedModelId={selectedModelId} onSelectModel={handleSelectModel} mobile />
      </aside>

      {/* RIGHT TOC — mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          rightOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setRightOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[60] w-[220px] bg-[#121118] border-l border-[rgba(255,255,255,0.06)] flex flex-col pt-[60px] transition-transform duration-300 ease-out lg:hidden ${
          rightOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button onClick={() => setRightOpen(false)} className="group absolute top-[12px] left-[12px] size-[28px] flex items-center justify-center rounded-[8px] hover:bg-white/[0.06] transition-colors cursor-pointer z-10" aria-label="Закрыть">
          <Image src="/icons/close_icon.png" alt="" width={12} height={12} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
        </button>
        <KnowledgeToc
          sections={docs.sections}
          activeSection={activeSection}
          onScrollToSection={handleScrollToSection}
          modelId={model.id}
          modelName={model.name}
          mobile
        />
      </aside>

      {/* MAIN CONTENT */}
      <div ref={scrollContainerRef} className="flex-1 min-w-0 flex flex-col md:flex-row overflow-y-auto chat-scrollbar">
        {/* Mobile toolbar */}
        <div className="flex md:hidden items-center gap-[8px] px-[16px] pt-[16px] pb-[8px] shrink-0">
          <button
            onClick={() => setLeftOpen(true)}
            className="size-[34px] flex items-center justify-center rounded-[10px] hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Модели"
          >
            <CustomIcon src="/icons/menubar_icon.png" size={18} className="opacity-60" />
          </button>
          <span className="text-[14px] text-white font-semibold flex-1 truncate">{model.name}</span>
          <button
            onClick={() => setRightOpen(true)}
            className="size-[34px] flex items-center justify-center rounded-[10px] hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Содержание"
          >
            <CustomIcon src="/icons/menubar_2_icon.png" size={18} className="opacity-60" />
          </button>
        </div>

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

        {/* RIGHT: Table of contents — desktop */}
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

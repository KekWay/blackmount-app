'use client'

import { useState, useEffect, useRef } from 'react'
import { MarkdownRenderer } from '@/components/shared/markdown-renderer'

export function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const idxRef = useRef(0)

  useEffect(() => {
    idxRef.current = 0
    setDisplayed('')
    const interval = setInterval(() => {
      idxRef.current += 1
      if (idxRef.current <= text.length) {
        setDisplayed(text.slice(0, idxRef.current))
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, 18)
    return () => clearInterval(interval)
  }, [text])

  return (
    <div className="relative">
      <MarkdownRenderer content={displayed} />
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[14px] bg-[#888ae5] ml-[1px] align-middle" style={{ animation: 'cursorBlink 0.8s step-end infinite' }} />
      )}
    </div>
  )
}

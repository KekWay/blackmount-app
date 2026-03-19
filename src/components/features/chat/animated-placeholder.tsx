'use client'

import { useState, useEffect, useRef } from 'react'

const placeholderTexts = [
  'Напишите запрос...',
  'Опишите что хотите создать...',
  'Задайте вопрос нейросети...',
  'Сгенерируйте изображение или текст...',
  'Спросите о чём угодно...',
  'Создайте что-то новое...',
]

export function AnimatedPlaceholder({ visible }: { visible: boolean }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isTypingPh, setIsTypingPh] = useState(true)
  const charRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!visible) return
    const text = placeholderTexts[currentIdx]
    if (isTypingPh) {
      charRef.current = 0
      setDisplayed('')
      const typeInterval = setInterval(() => {
        charRef.current += 1
        if (charRef.current <= text.length) {
          setDisplayed(text.slice(0, charRef.current))
        } else {
          clearInterval(typeInterval)
          timerRef.current = setTimeout(() => setIsTypingPh(false), 2000)
        }
      }, 70)
      return () => { clearInterval(typeInterval); if (timerRef.current) clearTimeout(timerRef.current) }
    } else {
      let len = displayed.length
      const eraseInterval = setInterval(() => {
        len -= 1
        if (len >= 0) {
          setDisplayed(placeholderTexts[currentIdx].slice(0, len))
        } else {
          clearInterval(eraseInterval)
          setCurrentIdx((prev) => (prev + 1) % placeholderTexts.length)
          setIsTypingPh(true)
        }
      }, 25)
      return () => clearInterval(eraseInterval)
    }
  }, [currentIdx, isTypingPh, visible])

  if (!visible) return null

  return (
    <span className="absolute left-[26px] top-[18px] pointer-events-none font-['Inter',sans-serif] font-normal leading-[22px] text-[14px] text-[#898787] select-none z-0">
      {displayed}
      <span
        className="inline-block w-[1.5px] h-[14px] bg-[#898787] ml-[1px] align-middle"
        style={{ animation: 'cursorBlink 0.8s step-end infinite', opacity: 0.6 }}
      />
    </span>
  )
}

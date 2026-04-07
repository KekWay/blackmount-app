'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface KnowledgeCtaProps {
  modelId: string
  modelName: string
  glowColor: string
}

export function KnowledgeCta({ modelId, modelName, glowColor }: KnowledgeCtaProps) {
  const router = useRouter()

  return (
    <div className="mt-[48px] mb-[24px] rounded-[16px] p-[28px] flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${glowColor}10, rgba(18,17,24,0.5))`, border: `1px solid ${glowColor}15` }}>
      <div>
        <p className="text-[16px] text-white mb-[4px] font-semibold">Готовы попробовать?</p>
        <p className="text-[13px] text-[rgba(255,255,255,0.4)]">Перейдите в чат и начните работать с {modelName}</p>
      </div>
      <button
        onClick={() => router.push(`/chat/${modelId}`)}
        className="flex items-center gap-[8px] bg-[#888ae5] hover:bg-[#9a9cf0] rounded-[12px] px-[20px] py-[10px] transition-colors cursor-pointer shrink-0"
      >
        <Image src="/icons/flash_icon.png" alt="" width={15} height={15} className="brightness-0 invert" />
        <span className="text-[13px] text-white font-semibold">Открыть чат</span>
      </button>
    </div>
  )
}

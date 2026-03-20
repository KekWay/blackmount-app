'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { aiModels } from '@/data/ai-models'
import { ModelIcon } from '@/components/shared/model-icon'

interface PinnedChat {
  modelId: string
  modelName: string
}

interface SidebarPinnedProps {
  collapsed: boolean
}

export function SidebarPinned({ collapsed }: SidebarPinnedProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [pinnedChats, setPinnedChats] = useState<PinnedChat[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('pinnedChats')
    if (saved) {
      try { setPinnedChats(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('pinnedChats')
      if (saved) {
        try { setPinnedChats(JSON.parse(saved)) } catch { /* ignore */ }
      } else {
        setPinnedChats([])
      }
    }
    window.addEventListener('pinnedChatsChanged', handleStorage)
    return () => window.removeEventListener('pinnedChatsChanged', handleStorage)
  }, [])

  if (pinnedChats.length === 0) return null

  const currentChatId = pathname.startsWith('/chat/')
    ? pathname.split('/chat/')[1]
    : null

  return (
    <div className={`mt-[16px] border-t border-[rgba(255,255,255,0.06)] pt-[16px] ${collapsed ? 'w-full' : 'w-[208px]'}`}>
      {!collapsed && (
        <p className="font-sans font-normal text-[11px] text-[rgba(255,255,255,0.3)] pl-[16px] mb-[8px] uppercase tracking-wider">
          Закреплённые
        </p>
      )}
      {pinnedChats.map((chat) => {
        const model = aiModels.find((m) => m.id === chat.modelId)
        const isActive = currentChatId === chat.modelId

        return (
          <button
            key={chat.modelId}
            type="button"
            title={collapsed ? chat.modelName : undefined}
            onClick={() => router.push(`/chat/${chat.modelId}`)}
            className={`group h-[45px] relative rounded-[12px] shrink-0 cursor-pointer transition-colors mb-[2px] flex items-center ${
              collapsed ? 'w-full justify-center' : 'w-[208px] pl-[16px] gap-[12px]'
            } ${
              isActive
                ? 'bg-[#39375b]'
                : 'hover:bg-[rgba(136,138,229,0.08)]'
            }`}
          >
            <div className="relative shrink-0 size-[20px] flex items-center justify-center">
              {model ? (
                <ModelIcon modelId={model.id} size={20} />
              ) : (
                <div className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.2)]" />
              )}
            </div>
            {!collapsed && (
              <p
                className="font-normal leading-[21px] not-italic text-[14px] truncate"
                style={{
                  color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              >
                {chat.modelName}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}

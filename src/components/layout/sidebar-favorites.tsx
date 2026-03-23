'use client'

import { usePathname, useRouter } from 'next/navigation'
import { aiModels } from '@/data/ai-models'
import { useFavoritesStore } from '@/stores/favorites'
import { ModelIcon } from '@/components/shared/model-icon'

const MAX_VISIBLE = 4

interface SidebarFavoritesProps {
  collapsed: boolean
}

export function SidebarFavorites({ collapsed }: SidebarFavoritesProps) {
  const router = useRouter()
  const pathname = usePathname()
  const favorites = useFavoritesStore((s) => s.favorites)

  if (favorites.length === 0) return null

  const favModels = favorites
    .map((id) => aiModels.find((m) => m.id === id))
    .filter(Boolean)
  const visible = favModels.slice(0, MAX_VISIBLE)

  const currentChatId = pathname.startsWith('/chat/')
    ? pathname.split('/chat/')[1]
    : null

  return (
    <div className={`mt-[16px] border-t border-[rgba(255,255,255,0.06)] pt-[16px] ${collapsed ? 'w-full' : 'w-[208px]'}`}>
      {!collapsed && (
        <p className="font-sans font-normal text-[11px] text-[rgba(255,255,255,0.3)] pl-[16px] mb-[8px] uppercase tracking-wider">
          Избранные
        </p>
      )}
      {visible.map((model) => {
        const isActive = currentChatId === model!.id

        return (
          <button
            key={model!.id}
            type="button"
            title={collapsed ? model!.name : undefined}
            onClick={() => router.push(`/chat/${model!.id}`)}
            className={`group h-[45px] relative rounded-[12px] shrink-0 cursor-pointer transition-colors mb-[2px] flex items-center ${
              collapsed ? 'w-full justify-center' : 'w-[208px] pl-[16px] gap-[12px]'
            } ${
              isActive
                ? 'bg-[#39375b]'
                : 'hover:bg-[rgba(136,138,229,0.08)]'
            }`}
          >
            <div className="relative shrink-0 size-[22px] flex items-center justify-center">
              <ModelIcon modelId={model!.id} size={22} />
            </div>
            {!collapsed && (
              <p
                className="font-normal leading-[21px] not-italic text-[14px] truncate"
                style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}
              >
                {model!.name}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}

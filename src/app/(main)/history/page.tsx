'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useBalanceStore } from '@/stores/balance'
import { MODEL_ASSETS } from '@/lib/assets'
import type { ModelId } from '@/lib/assets'
import type { ModelCategory } from '@/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const TAB_MAP: { value: ModelCategory; label: string }[] = [
  { value: 'text', label: 'Текст' },
  { value: 'image', label: 'Изображения' },
  { value: 'video', label: 'Видео' },
]

export default function HistoryPage() {
  const router = useRouter()
  const genHistory = useBalanceStore((s) => s.genHistory)

  function getIcon(modelId: string) {
    const assets = MODEL_ASSETS[modelId as ModelId]
    if (!assets) return null
    return assets.colorLogo
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">История</h1>

      <Tabs defaultValue="text">
        <TabsList className="mb-6">
          {TAB_MAP.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_MAP.map((tab) => {
          const items = genHistory.filter((item) => item.type === tab.value)

          return (
            <TabsContent key={tab.value} value={tab.value}>
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Нет записей
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {items.map((item) => {
                    const icon = getIcon(item.modelId)

                    return (
                      <button
                        key={item.id}
                        onClick={() => router.push(`/chat/${item.modelId}`)}
                        className="flex items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors hover:bg-muted"
                      >
                        {icon && (
                          <Image
                            src={icon}
                            alt=""
                            width={32}
                            height={32}
                            className="size-8 shrink-0 rounded-lg"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          {item.preview && (
                            <p className="truncate text-xs text-muted-foreground">
                              {item.preview}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.time}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

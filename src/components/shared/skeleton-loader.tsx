import type React from 'react'

function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-white/[0.04] ${className}`} style={style}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent bg-[length:200%_100%] animate-[spotlight-shimmer_1.8s_ease-in-out_infinite]" />
    </div>
  )
}

/** TODO: подключить при lazy-loading страниц через next/dynamic */
export function HomePageSkeleton() {
  return (
    <div className="w-full h-full px-6 lg:px-10 pt-8 pb-10">
      <div className="flex flex-col gap-2 mb-6">
        <Skeleton className="h-9 w-[200px] rounded-lg" />
        <Skeleton className="h-[18px] w-[280px] rounded-md" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        {[80, 90, 70, 110, 70].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-xl" style={{ width: w }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-5 mb-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[113px] w-[158px] rounded-[20px]" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[140px] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

/** TODO: подключить при lazy-loading страниц через next/dynamic */
export function ChatPageSkeleton() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[60px] border-b border-white/[0.06] px-6 flex items-center gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-[18px] w-[140px] rounded-md" />
      </div>
      <div className="flex-1 px-10 py-8 flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            <Skeleton className="size-9 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5 max-w-[60%]">
              <Skeleton className="h-4 rounded" style={{ width: 180 + i * 40 }} />
              <Skeleton className="h-4 rounded" style={{ width: 140 + i * 30 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="px-10 pb-6">
        <Skeleton className="h-[52px] w-full rounded-2xl" />
      </div>
    </div>
  )
}

export function GenericPageSkeleton() {
  return (
    <div className="w-full h-full px-6 lg:px-10 pt-8 pb-10">
      <Skeleton className="h-9 w-[220px] rounded-lg mb-2" />
      <Skeleton className="h-[18px] w-[340px] rounded-md mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-2xl" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

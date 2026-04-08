'use client'

import { useRouter } from 'next/navigation'

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-[#0d0d0f] flex items-center justify-center">
      <div className="flex flex-col items-center text-center px-6 max-w-[400px]">
        <h1 className="text-[24px] text-white font-extrabold mb-3">Ошибка авторизации</h1>
        <p className="text-sm text-white/45 leading-relaxed mb-8">
          {error.message || 'Что-то пошло не так при авторизации.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-[14px] bg-[#888ae5] hover:bg-[#9a9cf0] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Попробовать снова
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-[14px] bg-white/[0.06] hover:bg-white/10 text-white/70 text-sm font-bold transition-colors cursor-pointer"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  )
}

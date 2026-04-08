'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#121118] flex items-center justify-center">
        <div className="flex flex-col items-center text-center px-6 max-w-[480px]">
          <h1 className="text-[28px] text-white font-extrabold mb-3">Критическая ошибка</h1>
          <p className="text-sm text-white/45 leading-relaxed mb-8">
            {error.message || 'Что-то пошло не так. Попробуйте перезагрузить страницу.'}
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-[14px] bg-[#888ae5] hover:bg-[#9a9cf0] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  )
}

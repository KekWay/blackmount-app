'use client'

import { useRouter } from 'next/navigation'
import { ErrorScreen } from '@/components/shared/error-screen'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#121118] flex items-center justify-center">
      <ErrorScreen
        type="notfound"
        title="Страница не найдена"
        message="Запрашиваемая страница не существует или была перемещена."
        onRetry={() => router.back()}
        onGoHome={() => router.push('/')}
      />
    </div>
  )
}

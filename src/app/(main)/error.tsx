'use client'

import { useRouter } from 'next/navigation'
import { ErrorScreen } from '@/components/shared/error-screen'

export default function MainError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <ErrorScreen
      type="generic"
      title="Произошла ошибка"
      message={error.message || 'Что-то пошло не так. Попробуйте перезагрузить страницу.'}
      onRetry={reset}
      onGoHome={() => router.push('/')}
    />
  )
}

'use client'

import { RefreshCw, WifiOff, AlertTriangle, ServerCrash } from 'lucide-react'

export type ErrorType = 'network' | 'server' | 'notfound' | 'generic'

interface ErrorScreenProps {
  type?: ErrorType
  title?: string
  message?: string
  onRetry?: () => void
  onGoHome?: () => void
}

const ERROR_CONFIG: Record<ErrorType, { icon: typeof WifiOff; title: string; message: string; badge: string }> = {
  network: { icon: WifiOff, title: 'Нет подключения к сети', message: 'Проверьте интернет-соединение и попробуйте снова.', badge: 'Офлайн' },
  server: { icon: ServerCrash, title: 'Ошибка сервера', message: 'Что-то пошло не так на нашей стороне. Мы уже работаем над решением.', badge: '500' },
  notfound: { icon: AlertTriangle, title: 'Страница не найдена', message: 'Запрашиваемая страница не существует или была перемещена.', badge: '404' },
  generic: { icon: AlertTriangle, title: 'Произошла ошибка', message: 'Что-то пошло не так. Попробуйте перезагрузить страницу.', badge: 'Ошибка' },
}

export function ErrorScreen({ type = 'generic', title, message, onRetry, onGoHome }: ErrorScreenProps) {
  const config = ERROR_CONFIG[type]
  const Icon = config.icon

  return (
    <div className="min-h-screen flex-1 flex items-center justify-center" role="alert">
      <div className="flex flex-col items-center text-center px-6 max-w-[480px]">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-4">
          <Icon size={20} className="text-red-500" />
          <span className="text-xs text-white/50 tracking-wider uppercase font-bold">{config.badge}</span>
        </div>

        <h1 className="text-[28px] text-white font-extrabold mb-3">{title ?? config.title}</h1>
        <p className="text-sm text-white/45 leading-relaxed mb-8 max-w-[380px]">{message ?? config.message}</p>

        <div className="flex items-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 rounded-[14px] bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(136,138,229,0.3)]"
            >
              <RefreshCw size={16} />
              Попробовать снова
            </button>
          )}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-6 py-3 rounded-[14px] bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] text-white/70 hover:text-white text-sm font-bold transition-all cursor-pointer"
            >
              На главную
            </button>
          )}
        </div>

        <p className="text-[11px] text-white/20 mt-6">
          Если проблема повторяется, напишите нам в поддержку
        </p>
      </div>
    </div>
  )
}

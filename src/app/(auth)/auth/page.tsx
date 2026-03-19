'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, MessageCircle } from 'lucide-react'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'

export default function AuthPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login({ email, name: name || email.split('@')[0] })
    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Image
            src={APP_ASSETS.logo}
            alt="Logo"
            width={64}
            height={64}
            className="size-16"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setMode('login')}
            className={
              mode === 'login'
                ? 'text-sm font-semibold text-foreground'
                : 'text-sm font-medium text-muted-foreground hover:text-foreground'
            }
          >
            Вход
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            onClick={() => setMode('register')}
            className={
              mode === 'register'
                ? 'text-sm font-semibold text-foreground'
                : 'text-sm font-medium text-muted-foreground hover:text-foreground'
            }
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground">
            Или войти через
          </p>
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <MessageCircle className="size-4" />
              Telegram
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <span className="text-sm font-bold">VK</span>
              VKontakte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

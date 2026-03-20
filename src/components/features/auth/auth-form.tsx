'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'
import { AuthSocialButtons } from './auth-social-buttons'

export function AuthForm() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, name: name || email.split('@')[0] })
    router.push('/')
  }

  return (
    <section className="w-[50%] flex flex-col h-screen">
      {/* Logo top-left — pinned */}
      <header className="flex items-center gap-[8px] px-[24px] py-[16px] 2xl:px-[40px] 2xl:py-[24px]">
        <img alt="Black Mount logo" className="shrink-0 size-[24px] 2xl:size-[30px] object-contain" src={APP_ASSETS.logo} />
        <span className="font-bakbak leading-[16px] text-[13px] 2xl:text-[16px] text-white">BLACK MOUNT</span>
      </header>

      {/* Form centered in remaining space */}
      <div className="flex-1 flex items-center justify-center px-[48px] 2xl:px-[80px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="w-full max-w-[300px] 2xl:max-w-[380px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1 className="font-manrope font-extrabold text-[20px] 2xl:text-[26px] text-white mb-[3px] 2xl:mb-[6px]">
              {mode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </h1>
            <p className="font-manrope font-normal text-[11px] 2xl:text-[13px] text-[rgba(255,255,255,0.45)] mb-[20px] 2xl:mb-[28px]">
              {mode === 'login' ? 'Добро пожаловать в Black Mount AI' : 'Приоединяйтесь к Black Mount AI'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[10px] 2xl:gap-[14px]">
              {mode === 'register' && (
                <div className="flex flex-col gap-[3px]">
                  <label className="font-manrope font-medium text-[9px] 2xl:text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-[1px]">Имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors"
                  />
                </div>
              )}

              <div className="flex flex-col gap-[3px]">
                <label className="font-manrope font-medium text-[9px] 2xl:text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-[1px]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-[3px]">
                <label className="font-manrope font-medium text-[9px] 2xl:text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-[1px]">Пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors pr-[36px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <button type="button" className="self-end font-manrope font-medium text-[10px] text-[#888ae5] hover:text-[#9a9cf0] transition-colors cursor-pointer -mt-[2px]">
                  Забыли пароль?
                </button>
              )}

              <button
                type="submit"
                className="w-full bg-[#888ae5] hover:bg-[#7577d4] rounded-[15px] h-[32px] 2xl:h-[38px] cursor-pointer transition-colors"
              >
                <span className="font-manrope font-bold text-[12px] 2xl:text-[14px] text-white tracking-[0.12px]">
                  {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </span>
              </button>
            </form>

            {/* Toggle */}
            <p className="font-manrope font-normal text-[10px] 2xl:text-[12px] text-[rgba(255,255,255,0.45)] text-center mt-[10px]">
              {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[#888ae5] hover:text-[#9a9cf0] font-medium transition-colors cursor-pointer text-[10px] 2xl:text-[12px]"
              >
                {mode === 'login' ? 'Создать' : 'Войти'}
              </button>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-[12px] mt-[14px] mb-[10px]">
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
              <span className="font-manrope font-normal text-[9px] text-[rgba(255,255,255,0.25)]">или</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            </div>

            {/* Social buttons */}
            <AuthSocialButtons />

            {/* Footer */}
            <p className="font-manrope font-normal text-[9px] text-[rgba(255,255,255,0.2)] text-center mt-[16px] leading-[13px]">
              Продолжая, вы соглашаетесь с{' '}
              <span className="text-[rgba(255,255,255,0.35)] underline cursor-pointer">Условиями использования</span>{' '}
              и{' '}
              <span className="text-[rgba(255,255,255,0.35)] underline cursor-pointer">Политикой конфиденциальности</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

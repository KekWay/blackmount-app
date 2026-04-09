'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { APP_ASSETS } from '@/lib/assets'
import { useAuthStore } from '@/stores/auth'
import { AuthSocialButtons } from './auth-social-buttons'
import { AuthFormFields, type AuthFormErrors } from './auth-form-fields'
import { AuthReferralModal } from './auth-referral-modal'
import { AuthFormFooter, AuthFormTerms } from './auth-form-footer'

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((s) => s.login)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showReferralInput, setShowReferralInput] = useState(false)
  const [errors, setErrors] = useState<AuthFormErrors>({})

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      const upper = ref.toUpperCase()
      try { localStorage.setItem('pendingReferralCode', upper) } catch {}
      setReferralCode(upper)
      setShowReferralInput(true)
      toast.info('Вас пригласил друг!')
    } else {
      let saved: string | null = null
      try { saved = localStorage.getItem('pendingReferralCode') } catch {}
      if (saved) {
        setReferralCode(saved)
        setShowReferralInput(true)
      }
    }
  }, [searchParams])

  const handleReferralChange = (value: string) => {
    const upper = value.toUpperCase()
    setReferralCode(upper)
    try {
      if (upper) localStorage.setItem('pendingReferralCode', upper)
      else localStorage.removeItem('pendingReferralCode')
    } catch {}
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: AuthFormErrors = {}

    if (!email.trim()) newErrors.email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Неверный формат email'

    if (!password.trim()) newErrors.password = 'Введите пароль'
    else if (password.length < 6) newErrors.password = 'Минимум 6 символов'

    if (mode === 'register' && !name.trim()) newErrors.name = 'Введите имя'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    let pending: string | null = null
    try { pending = localStorage.getItem('pendingReferralCode') } catch {}
    const referredBy = pending && /^[A-Z0-9]{4,20}$/.test(pending) ? pending : undefined
    login({ email, name: name || email.split('@')[0], referredBy })
    try { localStorage.removeItem('pendingReferralCode') } catch {}
    router.push('/')
  }

  return (
    <section className="w-full md:w-[50%] flex flex-col h-screen">
      <header className="flex items-center justify-center md:justify-start gap-[8px] px-[16px] py-[32px] md:px-[24px] md:py-[16px] 2xl:px-[40px] 2xl:py-[24px]">
        <img alt="Black Mount logo" className="shrink-0 size-[24px] 2xl:size-[30px] object-contain" src={APP_ASSETS.logo} />
        <span className="font-bakbak leading-[16px] text-[13px] 2xl:text-[16px] text-white">BLACK MOUNT</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-[16px] md:px-[48px] 2xl:px-[80px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="w-full max-w-[320px] md:max-w-[300px] 2xl:max-w-[380px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1 className="font-manrope font-extrabold text-[24px] md:text-[20px] 2xl:text-[26px] text-white mb-[3px] 2xl:mb-[6px]">
              {mode === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </h1>
            <p className="font-manrope font-normal text-[11px] 2xl:text-[13px] text-[rgba(255,255,255,0.45)] mb-[20px] 2xl:mb-[28px]">
              {mode === 'login' ? 'Добро пожаловать в Black Mount AI' : 'Присоединяйтесь к Black Mount AI'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[10px] 2xl:gap-[14px]">
              <AuthFormFields
                mode={mode}
                email={email}
                password={password}
                name={name}
                errors={errors}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNameChange={setName}
              />
              <button
                type="submit"
                className="w-full bg-[#888ae5] hover:bg-[#7577d4] rounded-[15px] h-[32px] 2xl:h-[38px] cursor-pointer transition-colors"
              >
                <span className="font-manrope font-bold text-[12px] 2xl:text-[14px] text-white tracking-[0.12px]">
                  {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </span>
              </button>
            </form>

            <AuthFormFooter
              mode={mode}
              onToggleMode={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}) }}
              onOpenReferral={() => setShowReferralInput(true)}
            />

            <AuthReferralModal
              open={showReferralInput}
              referralCode={referralCode}
              onChange={handleReferralChange}
              onClose={() => setShowReferralInput(false)}
            />

            <AuthSocialButtons />
            <AuthFormTerms />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

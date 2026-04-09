'use client'

interface AuthFormFooterProps {
  mode: 'login' | 'register'
  onToggleMode: () => void
  onOpenReferral: () => void
}

export function AuthFormFooter({ mode, onToggleMode, onOpenReferral }: AuthFormFooterProps) {
  return (
    <>
      <div className="flex items-center justify-between mt-[10px]">
        <p className="font-manrope font-normal text-[10px] 2xl:text-[12px] text-[rgba(255,255,255,0.45)]">
          {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            onClick={onToggleMode}
            className="text-[#888ae5] hover:text-[#9a9cf0] font-medium transition-colors cursor-pointer text-[10px] 2xl:text-[12px]"
          >
            {mode === 'login' ? 'Создать' : 'Войти'}
          </button>
        </p>
        <button
          type="button"
          onClick={onOpenReferral}
          className="font-manrope font-medium text-[10px] 2xl:text-[12px] text-[#888ae5] hover:text-[#9a9cf0] cursor-pointer transition-colors"
        >
          Есть код приглашения?
        </button>
      </div>

      <div className="flex items-center gap-[12px] mt-[14px] mb-[10px]">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
        <span className="font-manrope font-normal text-[9px] text-[rgba(255,255,255,0.25)]">или</span>
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
      </div>
    </>
  )
}

export function AuthFormTerms() {
  return (
    <p className="font-manrope font-normal text-[9px] text-[rgba(255,255,255,0.2)] text-center mt-[16px] leading-[13px]">
      Продолжая, вы соглашаетесь с{' '}
      <span className="text-[rgba(255,255,255,0.35)] underline cursor-pointer">Условиями использования</span>{' '}
      и{' '}
      <span className="text-[rgba(255,255,255,0.35)] underline cursor-pointer">Политикой конфиденциальности</span>
    </p>
  )
}

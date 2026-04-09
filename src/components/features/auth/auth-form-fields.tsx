'use client'

import { useState } from 'react'
import { CustomIcon } from '@/components/shared/custom-icon'

export interface AuthFormErrors {
  email?: string
  password?: string
  name?: string
}

interface AuthFormFieldsProps {
  mode: 'login' | 'register'
  email: string
  password: string
  name: string
  errors: AuthFormErrors
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onNameChange: (v: string) => void
}

export function AuthFormFields({
  mode,
  email,
  password,
  name,
  errors,
  onEmailChange,
  onPasswordChange,
  onNameChange,
}: AuthFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      {mode === 'register' && (
        <div className="flex flex-col gap-[3px]">
          <label className="font-manrope font-medium text-[9px] 2xl:text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-[1px]">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ваше имя"
            className="bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors"
          />
          {errors.name && <p className="font-manrope text-[10px] text-[#f87171] mt-[3px]">{errors.name}</p>}
        </div>
      )}

      <div className="flex flex-col gap-[3px]">
        <label className="font-manrope font-medium text-[9px] 2xl:text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-[1px]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="example@mail.com"
          className="bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors"
        />
        {errors.email && <p className="font-manrope text-[10px] text-[#f87171] mt-[3px]">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-[3px]">
        <label className="font-manrope font-medium text-[9px] 2xl:text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-[1px]">Пароль</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••••"
            className="w-full bg-[#1a1a1f] border border-[rgba(255,255,255,0.08)] rounded-[15px] px-[12px] py-[8px] 2xl:px-[16px] 2xl:py-[12px] font-manrope font-normal text-[12px] 2xl:text-[14px] text-white placeholder-[rgba(255,255,255,0.2)] outline-none focus:border-[#888ae5] transition-colors pr-[36px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <CustomIcon src="/icons/eye_hide_icon.png" size={14} /> : <CustomIcon src="/icons/eye_icon.png" size={14} />}
          </button>
        </div>
        {errors.password && <p className="font-manrope text-[10px] text-[#f87171] mt-[3px]">{errors.password}</p>}
      </div>

      {mode === 'login' && (
        <button type="button" className="self-end font-manrope font-medium text-[10px] text-[#888ae5] hover:text-[#9a9cf0] transition-colors cursor-pointer -mt-[2px]">
          Забыли пароль?
        </button>
      )}
    </>
  )
}

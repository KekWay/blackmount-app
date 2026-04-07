'use client'

import { useState } from 'react'
import { IMG_HEADPHONES_MASK, IMG_LAPTOP_MASK } from './profile-data'
import { SupportChoiceModal } from '@/components/features/support/support-choice-modal'

export function AccountTabExtras() {
  const [supportModal, setSupportModal] = useState(false)
  return (
    <>
      {/* Support */}
      <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[29px] py-[18px] flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <div className="shrink-0 w-[32px] h-[32px] bg-white" style={{ maskImage: `url('${IMG_HEADPHONES_MASK}')`, WebkitMaskImage: `url('${IMG_HEADPHONES_MASK}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
          <div className="flex flex-col gap-[2px]">
            <p className="font-manrope font-semibold text-[15px] text-white leading-[22px]">Техподдержка</p>
            <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.3)] leading-[18px]">Свяжитесь с нами если возникли вопросы</p>
          </div>
        </div>
        <button onClick={() => setSupportModal(true)} className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[14px] h-[38px] flex items-center cursor-pointer transition-colors">
          <span className="font-manrope font-medium text-[13px] text-white">Написать</span>
        </button>
      </div>
      <SupportChoiceModal show={supportModal} onClose={() => setSupportModal(false)} />

      {/* Sign out all sessions */}
      <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[29px] py-[18px] flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <div className="shrink-0 w-[32px] h-[32px] bg-white" style={{ maskImage: `url('${IMG_LAPTOP_MASK}')`, WebkitMaskImage: `url('${IMG_LAPTOP_MASK}')`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }} />
          <div className="flex flex-col gap-[2px]">
            <p className="font-manrope font-semibold text-[15px] text-white leading-[22px]">Выйти из всех сеансов</p>
            <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.3)] leading-[18px]">Завершить все активные сеансы на других устройствах</p>
          </div>
        </div>
        <button className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[15px] h-[38px] flex items-center cursor-pointer transition-colors">
          <span className="font-manrope font-medium text-[13px] text-white">Завершить</span>
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[28px] py-[16px] flex items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <p className="font-manrope font-semibold text-[15px] text-white leading-[22px]">Удалить аккаунт</p>
          <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.3)] leading-[18px]">Это действие безвозвратно удалит ваш аккаунт</p>
        </div>
        <button className="flex items-center gap-[6px] bg-[rgba(248,113,113,0.08)] hover:bg-[rgba(248,113,113,0.16)] rounded-[10px] px-[14px] py-[8px] cursor-pointer transition-colors">
          <img src="/assets/models/trash_icon.png" alt="" width={14} height={14} className="[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(72%)_saturate(1054%)_hue-rotate(325deg)_brightness(101%)_contrast(94%)]" />
          <span className="font-manrope font-medium text-[13px] text-[#f87171]">Удалить</span>
        </button>
      </div>
    </>
  )
}

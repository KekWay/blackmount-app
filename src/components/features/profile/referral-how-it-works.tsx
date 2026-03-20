'use client'

import { motion } from 'motion/react'
import { IMG_SPARKLES, IMG_WALLET, IMG_CHECK_BADGE } from './profile-data'
import type { TierInfo } from './referral-data'

export function ReferralHowItWorks({ currentTier }: { currentTier: TierInfo }) {
  return (
    <div className="rounded-[20px] border border-[#888ae5]/10 bg-[#181722]/50 px-[28px] py-[28px] shadow-sm">
      <div className="text-center mb-[28px]">
        <p className="font-manrope font-bold text-[18px] text-white leading-[26px]">
          Наш реферальный <span className="italic text-[#888ae5]">процесс.</span>
        </p>
        <p className="font-manrope font-medium text-[12px] text-[rgba(255,255,255,0.5)] mt-[6px]">
          Участвуйте в реферальной программе за несколько простых шагов.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-[20px]">
        {[
          {
            icon: <img src={IMG_SPARKLES} alt="" className="size-[26px] object-contain" />,
            title: '1. Поделитесь ссылкой',
            desc: 'Отправьте вашу уникальную реферальную ссылку друзьям и коллегам, которым будет полезен сервис.',
          },
          {
            icon: <img src={IMG_WALLET} alt="" className="size-[26px] object-contain invert" />,
            title: '2. Друг покупает пакет',
            desc: 'Когда приглашённый пользователь покупает пакет айкоинов или оформляет подписку — вы получаете бонус.',
          },
          {
            icon: <img src={IMG_CHECK_BADGE} alt="" className="size-[26px] object-contain invert" />,
            title: '3. Получайте награды',
            desc: `Используйте бонусы для конвертации в айкоины или выводите деньги — до ${currentTier.rate} с каждой покупки.`,
          },
        ].map((step, i) => (
          <motion.div key={i} className="flex flex-col items-center text-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
            <div className="mb-[14px] size-[56px] rounded-[16px] bg-[#121118]/80 border border-[#888ae5]/20 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              {step.icon}
            </div>
            <p className="font-manrope font-bold text-[13px] text-white leading-[18px] mb-[6px]">{step.title}</p>
            <p className="font-manrope font-medium text-[11px] text-[rgba(255,255,255,0.4)] leading-[16px]">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

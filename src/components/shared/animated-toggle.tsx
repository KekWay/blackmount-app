'use client'

import { motion } from 'motion/react'

interface ToggleOption<T extends string> {
  key: T
  label: string
  badge?: string
}

export function AnimatedToggle<T extends string>({
  options,
  value,
  onChange,
  size = 'lg',
}: {
  options: ToggleOption<T>[]
  value: T
  onChange: (key: T) => void
  size?: 'sm' | 'lg'
}) {
  const activeIndex = options.findIndex((o) => o.key === value)
  const count = options.length

  const isSmall = size === 'sm'

  return (
    <div
      className={`flex items-center relative ${
        isSmall
          ? 'bg-[rgba(255,255,255,0.06)] rounded-[12px] p-[3px]'
          : 'bg-[rgba(255,255,255,0.04)] rounded-[16px] px-[4px] h-[49px]'
      }`}
    >
      <motion.div
        className={`absolute bg-[#39375b] ${
          isSmall
            ? 'top-[3px] bottom-[3px] rounded-[10px]'
            : 'top-[4px] bottom-[4px] rounded-[12px]'
        }`}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          width: isSmall
            ? `calc(${100 / count}% - 2px)`
            : `calc(${100 / count}% - 4px)`,
          left: isSmall
            ? `calc(${activeIndex * (100 / count)}% + 1px)`
            : `calc(${activeIndex * (100 / count)}% + 2px)`,
        }}
      />
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`cursor-pointer transition-colors relative z-[1] font-manrope flex-1 text-center flex items-center justify-center gap-[6px] ${
            isSmall
              ? 'rounded-[10px] px-[16px] py-[6px] font-extrabold text-[12px]'
              : 'rounded-[12px] h-[41px] font-medium text-[14px]'
          } ${
            value === opt.key
              ? 'text-white'
              : isSmall
                ? 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)]'
                : 'text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.7)]'
          }`}
        >
          {opt.label}
          {opt.badge && (
            <span className="bg-[#c0a020] text-white text-[9px] font-extrabold px-[5px] py-[1px] rounded-[5px]">
              {opt.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

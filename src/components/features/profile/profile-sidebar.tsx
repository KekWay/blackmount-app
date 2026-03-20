'use client'

import React from 'react'

export function SidebarItem({
  icon,
  label,
  active,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[10px] w-full px-[14px] py-[10px] rounded-[10px] cursor-pointer transition-colors text-left ${
        active
          ? 'bg-[#39375b] text-white'
          : danger
            ? 'text-[rgba(255,255,255,0.4)] hover:bg-[rgba(248,113,113,0.08)] hover:text-[#f87171]'
            : 'text-[rgba(255,255,255,0.4)] hover:bg-[rgba(136,138,229,0.08)] hover:text-[rgba(255,255,255,0.7)]'
      }`}
    >
      {icon}
      <span className="font-manrope font-medium text-[13px] leading-[20px]">{label}</span>
    </button>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-manrope font-normal text-[11px] text-[rgba(255,255,255,0.25)] uppercase tracking-[0.06em] mb-[6px] px-[14px]">
      {children}
    </p>
  )
}

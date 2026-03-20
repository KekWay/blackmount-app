'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'

export function AccountTabHeader() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Artur Kazarian')
  const [email, setEmail] = useState('k3kway@gmail.com')

  return (
    <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] px-[28px] py-[22px]">
      <div className={`flex items-center justify-between ${editing ? 'mb-[20px]' : ''}`}>
        <div className="flex items-center gap-[18px]">
          <div className="bg-[#b93d3d] rounded-full shrink-0 size-[56px] flex items-center justify-center">
            <p className="font-bakbak leading-[44px] text-[28px] text-white">A</p>
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="font-bakbak leading-[26px] text-[20px] text-white">{name}</p>
            <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.4)] leading-[20px]">{email}</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-[6px] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[14px] py-[8px] cursor-pointer transition-colors"
        >
          <Pencil size={14} className="text-[rgba(255,255,255,0.5)]" />
          <span className="font-manrope font-medium text-[13px] text-white">{editing ? 'Отмена' : 'Изменить'}</span>
        </button>
      </div>
      {editing && (
        <div className="flex flex-col gap-[14px] pt-[16px] border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col gap-[3px]">
            <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.3)] leading-[18px]">Имя</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[8px] font-manrope font-medium text-[14px] text-white outline-none focus:border-[#888ae5] transition-colors w-full max-w-[360px] placeholder-[#898787]"
            />
          </div>
          <div className="flex flex-col gap-[3px]">
            <p className="font-manrope font-normal text-[12px] text-[rgba(255,255,255,0.3)] leading-[18px]">Email</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[8px] font-manrope font-normal text-[14px] text-white outline-none focus:border-[#888ae5] transition-colors w-full max-w-[360px] placeholder-[#898787]"
            />
          </div>
          <div className="flex gap-[8px] mt-[4px]">
            <button
              onClick={() => setEditing(false)}
              className="bg-white hover:bg-[rgba(255,255,255,0.9)] rounded-[10px] px-[18px] py-[7px] cursor-pointer transition-colors"
            >
              <span className="font-manrope font-semibold text-[13px] text-[#19181e]">Сохранить</span>
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[18px] py-[7px] cursor-pointer transition-colors"
            >
              <span className="font-manrope font-medium text-[13px] text-[rgba(255,255,255,0.5)]">Отмена</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

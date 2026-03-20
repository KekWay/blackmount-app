'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div
      className="flex items-center gap-[10px] rounded-[14px] px-[16px] h-[40px] w-full max-w-[320px] transition-colors shrink-0"
      style={{ backgroundColor: 'rgba(57,55,91,0.25)', border: '1px solid rgba(255,255,255,0.03)' }}
    >
      <Search size={16} className="shrink-0 text-[rgba(255,255,255,0.4)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск нейросети..."
        className="bg-transparent outline-none font-manrope font-medium text-[14px] text-white w-full"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-[rgba(255,255,255,0.4)] hover:text-white text-[18px] cursor-pointer shrink-0"
        >
          &times;
        </button>
      )}
    </div>
  )
}

'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-[14px] px-4 h-10 w-full max-w-[320px] shrink-0 bg-[rgba(57,55,91,0.25)] border border-white/[0.03]">
      <Search size={16} className="shrink-0 text-white/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск нейросети..."
        className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-white/40 hover:text-white text-lg cursor-pointer shrink-0"
        >
          &times;
        </button>
      )}
    </div>
  )
}

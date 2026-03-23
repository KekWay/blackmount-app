'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div
      className="flex items-center gap-[10px] rounded-[14px] px-[16px] h-[40px] w-full sm:max-w-[320px] transition-colors sm:shrink-0"
      style={{ backgroundColor: 'rgba(57,55,91,0.25)', border: '1px solid rgba(255,255,255,0.03)' }}
    >
      <img src="/assets/models/search-icon.png" alt="" className="size-[18px] object-contain shrink-0" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
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

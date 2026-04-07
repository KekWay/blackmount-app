'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import Image from 'next/image'
import { AnimatedToggle } from '@/components/shared/animated-toggle'
import { useBalanceStore } from '@/stores/balance'
import { groupByDate, type HistoryItem } from './history-tab-utils'
import type { HistoryFilter } from './profile-data'
import { HistoryTabSummary } from './history-tab-summary'
import { HistoryTabGroup } from './history-tab-group'

export function HistoryTab() {
  const operations = useBalanceStore((s) => s.operations)
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const opsData: HistoryItem[] = operations.map(o => ({ id: o.id, type: o.type, label: o.label, amount: o.amount, date: o.date }))

  const totalSpent = opsData.filter(o => o.type === 'spent').reduce((s, o) => s + Math.abs(o.amount), 0)
  const totalTopup = opsData.filter(o => o.type === 'topup').reduce((s, o) => s + o.amount, 0)
  const opsCount = opsData.length

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  const filtered = opsData
    .filter(h => filter === 'all' || h.type === filter)
    .filter(h => !searchQuery || h.label.toLowerCase().includes(searchQuery.toLowerCase()))
  const groups = groupByDate(filtered)
  const groupKeys = Object.keys(groups)

  useEffect(() => {
    if (groupKeys.length > 0 && expandedGroups.size === 0) {
      setExpandedGroups(new Set([groupKeys[0]]))
    }
  }, [groupKeys.length])

  const filterOptions: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'topup', label: 'Пополнения' },
    { key: 'spent', label: 'Расходы' },
  ]

  return (
    <div className="flex flex-col gap-[16px]">
      <HistoryTabSummary totalSpent={totalSpent} totalTopup={totalTopup} opsCount={opsCount} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[10px]">
        <div className="w-full sm:w-[320px]">
          <AnimatedToggle<HistoryFilter>
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            size="sm"
          />
        </div>
        <div className="flex-1 flex items-center gap-[8px] bg-[rgba(57,55,91,0.5)] border border-[rgba(64,64,64,0.7)] rounded-[10px] px-[12px] py-[8px] focus-within:border-[#888ae5] transition-colors">
          <img src="/assets/models/search-icon.png" alt="" className="size-[18px] object-contain shrink-0" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по операциям..."
            className="bg-transparent outline-none font-manrope font-medium text-[13px] text-white placeholder-[#898787] w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="group cursor-pointer shrink-0 transition-colors">
              <Image src="/icons/close_icon.png" alt="" width={10} height={10} className="invert opacity-50 group-hover:opacity-80 transition-opacity duration-200" />
            </button>
          )}
        </div>
      </div>

      {groupKeys.map((dateLabel) => (
        <HistoryTabGroup
          key={dateLabel}
          dateLabel={dateLabel}
          items={groups[dateLabel]}
          isExpanded={expandedGroups.has(dateLabel)}
          onToggle={() => toggleGroup(dateLabel)}
        />
      ))}

      {filtered.length === 0 && (
        <div className="bg-[rgba(57,55,91,0.45)] rounded-[16px] flex flex-col items-center justify-center py-[60px] gap-[12px]">
          {searchQuery ? (
            <img src="/assets/models/search-empty.png" alt="" className="size-[48px] object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
          ) : (
            <div className="size-[48px] rounded-full bg-[rgba(136,138,229,0.08)] flex items-center justify-center mb-[4px]">
              <Clock size={22} className="text-[rgba(136,138,229,0.4)]" />
            </div>
          )}
          <p className="font-manrope font-semibold text-[15px] text-[rgba(255,255,255,0.4)]">
            {searchQuery ? 'По вашему запросу ничего не найдено' : 'Пока пусто'}
          </p>
          <p className="font-manrope font-normal text-[13px] text-[rgba(255,255,255,0.2)] text-center max-w-[300px]">
            {searchQuery
              ? `Нет операций по запросу \u00AB${searchQuery}\u00BB`
              : 'Здесь будут отображаться все ваши операции — пополнения и списания айкоинов'}
          </p>
        </div>
      )}
    </div>
  )
}

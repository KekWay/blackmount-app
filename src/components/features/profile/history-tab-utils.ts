import { aiModels } from '@/data/ai-models'
import type { AIModel } from '@/types/models'

export interface HistoryItem {
  id: string
  type: 'topup' | 'spent'
  label: string
  amount: number
  date: string
}

export function groupByDate(items: HistoryItem[]) {
  const groups: Record<string, HistoryItem[]> = {}
  const months = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  for (const item of items) {
    const dateKey = item.date.split(' ')[0]
    const parts = dateKey.split('.')
    const label = `${parseInt(parts[0])} ${months[parseInt(parts[1])]} 20${parts[2]} г.`
    if (!groups[label]) groups[label] = []
    groups[label].push(item)
  }
  return groups
}

export function getModelIconForLabel(label: string): AIModel | null {
  const lower = label.toLowerCase()
  const model = aiModels.find(m => lower.includes(m.name.toLowerCase().split(' ')[0]))
  return model || null
}

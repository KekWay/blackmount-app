import type { ModelCategory } from './models'

export interface GenHistoryItem {
  id: string
  modelId: string
  title: string
  prompt?: string
  preview: string
  time: string
  dateStr: string
  type: ModelCategory
}

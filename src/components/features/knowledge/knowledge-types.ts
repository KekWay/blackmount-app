import type { ReactNode } from 'react'

export interface DocSection {
  id: string
  title: string
  icon: ReactNode
  content: string[]
}

export interface InstructionStep {
  id: number
  title: string
  description: string
  gifPlaceholder: string
}

export interface ModelDocs {
  intro: string
  subtitle: string
  instructions: InstructionStep[]
  sections: DocSection[]
}

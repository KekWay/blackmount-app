import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '@/types'

export interface ChatSession {
  id: string
  modelId: string
  versionId: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ChatSessionsState {
  sessions: Record<string, ChatSession>
  createSession: (modelId: string, versionId: string, firstMessage: string) => string
  addMessages: (sessionId: string, msgs: Message[]) => void
  updateMessages: (sessionId: string, msgs: Message[]) => void
  getSession: (sessionId: string) => ChatSession | null
  getTextSessions: () => ChatSession[]
  removeSession: (sessionId: string) => void
}

/** @mock Заменить на Supabase table chat_sessions + messages */
function genId(): string {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const useChatSessionsStore = create<ChatSessionsState>()(
  persist(
    (set, get) => ({
      sessions: {},

      createSession: (modelId: string, versionId: string, firstMessage: string) => {
        const id = genId()
        const now = new Date().toISOString()
        const session: ChatSession = {
          id,
          modelId,
          versionId,
          title: firstMessage.slice(0, 50),
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({ sessions: { ...s.sessions, [id]: session } }))
        return id
      },

      addMessages: (sessionId: string, msgs: Message[]) => {
        const session = get().sessions[sessionId]
        if (!session) return
        set((s) => ({
          sessions: {
            ...s.sessions,
            [sessionId]: {
              ...session,
              messages: [...session.messages, ...msgs],
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      updateMessages: (sessionId: string, msgs: Message[]) => {
        const session = get().sessions[sessionId]
        if (!session) return
        set((s) => ({
          sessions: {
            ...s.sessions,
            [sessionId]: {
              ...session,
              messages: msgs,
              updatedAt: new Date().toISOString(),
            },
          },
        }))
      },

      getSession: (sessionId: string) => get().sessions[sessionId] ?? null,

      getTextSessions: () =>
        Object.values(get().sessions)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),

      removeSession: (sessionId: string) => {
        set((s) => {
          const next = { ...s.sessions }
          delete next[sessionId]
          return { sessions: next }
        })
      },
    }),
    { name: 'chat-sessions' },
  ),
)

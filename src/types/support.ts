export type TicketStatus = 'open' | 'answered' | 'closed'
export type TicketCategory = 'general' | 'payment' | 'withdraw' | 'technical'
export type MessageSender = 'user' | 'support'

export interface SupportMessage {
  id: string
  ticketId: string
  sender: MessageSender
  text: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  subject: string
  category: TicketCategory
  status: TicketStatus
  messages: SupportMessage[]
  createdAt: string
  updatedAt: string
}

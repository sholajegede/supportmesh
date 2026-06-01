export type TicketStatus = 'open' | 'in_progress' | 'escalated' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type SentimentScore = 'positive' | 'neutral' | 'negative' | 'frustrated'

export interface SupportTicket {
  id: string
  orgCode: string
  subject: string
  body: string
  customerEmail: string
  status: TicketStatus
  priority: TicketPriority
  sentiment?: SentimentScore
  category?: string
  draftResponse?: string
  escalationReason?: string
  createdAt: string
  updatedAt: string
}

export interface TriageResult {
  ticketId: string
  priority: TicketPriority
  category: string
  sentiment: SentimentScore
  draftResponse: string
  shouldEscalate: boolean
  escalationReason?: string
}

export interface DailySummary {
  orgCode: string
  date: string
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  escalatedTickets: number
  topCategories: string[]
  avgSentiment: SentimentScore
  longRunningTickets: string[]
}

export interface OrgContext {
  orgCode: string
  orgName: string
}

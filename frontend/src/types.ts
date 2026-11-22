export type ReviewFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly'

export const REVIEW_FREQUENCIES: ReviewFrequency[] = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Yearly',
]

export interface ItemResponse {
  id: number
  name: string
  owner: string
  reviewFrequency: ReviewFrequency
  createdAtUtc: string
  lastReviewedAtUtc: string | null
  nextReviewDueAtUtc: string
}

export interface OverdueItemResponse {
  id: number
  name: string
  owner: string
  reviewFrequency: ReviewFrequency
  lastReviewedAtUtc: string | null
  nextReviewDueAtUtc: string
}

export interface ReviewResponse {
  id: number
  itemId: number
  reviewerEmail: string
  reviewedAtUtc: string
  note: string | null
}

export interface AuditReviewResponse {
  id: number
  itemId: number
  itemName: string
  owner: string
  reviewerEmail: string
  reviewedAtUtc: string
  note: string | null
}

export interface CreateItemRequest {
  name: string
  owner: string
  reviewFrequency: ReviewFrequency
  nextReviewDueAtUtc: string
}

export interface CreateReviewRequest {
  reviewerEmail: string
  note?: string | null
}

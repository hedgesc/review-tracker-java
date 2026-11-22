import type {
  AuditReviewResponse,
  CreateItemRequest,
  CreateReviewRequest,
  ItemResponse,
  OverdueItemResponse,
  ReviewResponse,
} from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = await response.json()
      detail = body.detail || body.title || detail
    } catch {
      // ignore parse errors
    }
    throw new Error(detail)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function createItem(body: CreateItemRequest): Promise<ItemResponse> {
  return request<ItemResponse>('/api/items', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listOverdueItems(): Promise<OverdueItemResponse[]> {
  return request<OverdueItemResponse[]>('/api/items/overdue')
}

export function createReview(
  itemId: number,
  body: CreateReviewRequest,
): Promise<ReviewResponse> {
  return request<ReviewResponse>(`/api/items/${itemId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listReviews(params: {
  itemId?: number
  from?: string
  to?: string
  skip?: number
  take?: number
}): Promise<AuditReviewResponse[]> {
  const query = new URLSearchParams()
  if (params.itemId != null) query.set('itemId', String(params.itemId))
  if (params.from) query.set('from', params.from)
  if (params.to) query.set('to', params.to)
  if (params.skip != null) query.set('skip', String(params.skip))
  if (params.take != null) query.set('take', String(params.take))
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return request<AuditReviewResponse[]>(`/api/reviews${suffix}`)
}

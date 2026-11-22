import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'
import type { AuditReviewResponse } from '@/types/api'

export type ReviewsFilters = {
  itemId?: number
  from?: string
  to?: string
  skip?: number
  take?: number
}

export const getReviews = (params: ReviewsFilters = {}): Promise<AuditReviewResponse[]> => {
  const query = new URLSearchParams()
  if (params.itemId != null) query.set('itemId', String(params.itemId))
  if (params.from) query.set('from', params.from)
  if (params.to) query.set('to', params.to)
  if (params.skip != null) query.set('skip', String(params.skip))
  if (params.take != null) query.set('take', String(params.take))
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return api.get(`/api/reviews${suffix}`)
}

export const getReviewsQueryOptions = (params: ReviewsFilters = {}) => {
  return queryOptions({
    queryKey: ['reviews', params] as const,
    queryFn: () => getReviews(params),
  })
}

type UseReviewsOptions = {
  params?: ReviewsFilters
  queryConfig?: QueryConfig<typeof getReviewsQueryOptions>
}

export const useReviews = ({ params = {}, queryConfig }: UseReviewsOptions = {}) => {
  return useQuery({
    ...getReviewsQueryOptions(params),
    ...queryConfig,
  })
}

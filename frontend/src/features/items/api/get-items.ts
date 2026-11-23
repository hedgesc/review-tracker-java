import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'
import type { ItemResponse } from '@/types/api'

export type ItemsFilters = {
  filter?: 'overdue'
  skip?: number
  take?: number
}

export const getItems = (params: ItemsFilters = {}): Promise<ItemResponse[]> => {
  const query = new URLSearchParams()
  if (params.filter) query.set('filter', params.filter)
  if (params.skip != null) query.set('skip', String(params.skip))
  if (params.take != null) query.set('take', String(params.take))
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return api.get(`/api/items${suffix}`)
}

export const getItemsQueryOptions = (params: ItemsFilters = {}) => {
  return queryOptions({
    queryKey: ['items', params] as const,
    queryFn: () => getItems(params),
  })
}

type UseItemsOptions = {
  params?: ItemsFilters
  queryConfig?: QueryConfig<typeof getItemsQueryOptions>
}

export const useItems = ({ params = {}, queryConfig }: UseItemsOptions = {}) => {
  return useQuery({
    ...getItemsQueryOptions(params),
    ...queryConfig,
  })
}

import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'
import type { OverdueItemResponse } from '@/types/api'

export const getOverdueItems = (): Promise<OverdueItemResponse[]> => {
  return api.get('/api/items/overdue')
}

export const getOverdueItemsQueryOptions = () => {
  return queryOptions({
    queryKey: ['items', 'overdue'] as const,
    queryFn: getOverdueItems,
  })
}

type UseOverdueItemsOptions = {
  queryConfig?: QueryConfig<typeof getOverdueItemsQueryOptions>
}

export const useOverdueItems = ({ queryConfig }: UseOverdueItemsOptions = {}) => {
  return useQuery({
    ...getOverdueItemsQueryOptions(),
    ...queryConfig,
  })
}

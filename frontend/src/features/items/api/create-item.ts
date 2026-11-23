import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { MutationConfig } from '@/lib/react-query'
import type { CreateItemRequest, ItemResponse } from '@/types/api'

export const createItem = (data: CreateItemRequest): Promise<ItemResponse> => {
  return api.post('/api/items', data)
}

type UseCreateItemOptions = {
  mutationConfig?: MutationConfig<typeof createItem>
}

export const useCreateItem = ({ mutationConfig }: UseCreateItemOptions = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    mutationFn: createItem,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['items'],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
  })
}

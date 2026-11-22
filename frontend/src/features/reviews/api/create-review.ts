import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { MutationConfig } from '@/lib/react-query'
import type { CreateReviewRequest, ReviewResponse } from '@/types/api'

export const createReview = ({
  itemId,
  data,
}: {
  itemId: number
  data: CreateReviewRequest
}): Promise<ReviewResponse> => {
  return api.post(`/api/items/${itemId}/reviews`, data)
}

type UseCreateReviewOptions = {
  mutationConfig?: MutationConfig<typeof createReview>
}

export const useCreateReview = ({ mutationConfig }: UseCreateReviewOptions = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    mutationFn: createReview,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({
        queryKey: ['items', 'overdue'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['reviews'],
      })
      onSuccess?.(...args)
    },
    ...restConfig,
  })
}

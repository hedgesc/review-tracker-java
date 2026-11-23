import { useSearchParams } from 'react-router'

import { CreateReviewForm } from '@/features/reviews/components/create-review-form'

export function CreateReviewRoute() {
  const [searchParams] = useSearchParams()
  const itemIdParam = searchParams.get('itemId')
  const itemId = itemIdParam ? Number(itemIdParam) : undefined
  const initialItemId =
    itemId != null && !Number.isNaN(itemId) && itemId >= 1 ? itemId : undefined

  return (
    <section className="panel">
      <h2>Create review</h2>
      <CreateReviewForm itemId={initialItemId} allowItemIdEdit />
    </section>
  )
}

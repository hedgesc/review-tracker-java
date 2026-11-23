import { CreateReviewForm } from '@/features/reviews/components/create-review-form'

export function CreateReviewRoute() {
  return (
    <section className="panel">
      <h2>Create review</h2>
      <CreateReviewForm allowItemIdEdit />
    </section>
  )
}

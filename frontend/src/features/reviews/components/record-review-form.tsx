import { useState, type FormEvent } from 'react'

import { useCreateReview } from '@/features/reviews/api/create-review'

type RecordReviewFormProps = {
  itemId: number
  onCancel: () => void
  onSuccess: (reviewId: number) => void
}

export function RecordReviewForm({ itemId, onCancel, onSuccess }: RecordReviewFormProps) {
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createReviewMutation = useCreateReview({
    mutationConfig: {
      onSuccess: (review) => {
        setError(null)
        onSuccess(review.id)
      },
      onError: (err) => {
        setError(err.message)
      },
    },
  })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    createReviewMutation.mutate({
      itemId,
      data: {
        reviewerEmail,
        note: reviewNote || null,
      },
    })
  }

  return (
    <form className="form review-form" onSubmit={onSubmit}>
      <h3>Record review for item #{itemId}</h3>
      {error && <div className="banner error">{error}</div>}
      <label>
        Reviewer email
        <input
          type="email"
          value={reviewerEmail}
          onChange={(e) => setReviewerEmail(e.target.value)}
          required
          maxLength={320}
        />
      </label>
      <label>
        Note
        <textarea
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          maxLength={2000}
          rows={3}
        />
      </label>
      <div className="row">
        <button type="submit" disabled={createReviewMutation.isPending}>
          Save review
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

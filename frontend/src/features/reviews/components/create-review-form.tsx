import { useState, type FormEvent } from 'react'

import { useCreateReview } from '@/features/reviews/api/create-review'

type CreateReviewFormProps = {
  itemId?: number
  allowItemIdEdit?: boolean
}

export function CreateReviewForm({
  itemId: initialItemId,
  allowItemIdEdit = false,
}: CreateReviewFormProps) {
  const [itemIdInput, setItemIdInput] = useState(
    initialItemId != null ? String(initialItemId) : '',
  )
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const createReviewMutation = useCreateReview({
    mutationConfig: {
      onSuccess: (review) => {
        setError(null)
        setMessage(`Created review #${review.id} for item #${review.itemId}`)
        setReviewerEmail('')
        setReviewNote('')
        if (allowItemIdEdit && initialItemId == null) {
          setItemIdInput('')
        }
      },
      onError: (err) => {
        setMessage(null)
        setError(err.message)
      },
    },
  })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    const itemId = allowItemIdEdit ? Number(itemIdInput) : initialItemId
    if (itemId == null || Number.isNaN(itemId) || itemId < 1) {
      setError('Item ID is required')
      return
    }

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
      {error && <div className="banner error">{error}</div>}
      {message && <div className="banner success">{message}</div>}
      {allowItemIdEdit && (
        <label>
          Item ID
          <input
            type="number"
            value={itemIdInput}
            onChange={(e) => setItemIdInput(e.target.value)}
            required
            min={1}
          />
        </label>
      )}
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
      </div>
    </form>
  )
}

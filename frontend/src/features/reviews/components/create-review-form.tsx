import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'
import { useItems } from '@/features/items/api/get-items'
import { useCreateReview } from '@/features/reviews/api/create-review'

type CreateReviewFormProps = {
  itemId?: number
  allowItemIdEdit?: boolean
}

export function CreateReviewForm({
  itemId: initialItemId,
  allowItemIdEdit = false,
}: CreateReviewFormProps) {
  const navigate = useNavigate()
  const [selectedItemId, setSelectedItemId] = useState(
    initialItemId != null ? String(initialItemId) : '',
  )
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const itemsQuery = useItems({
    params: { take: 100 },
    queryConfig: {
      enabled: allowItemIdEdit,
    },
  })

  const items = itemsQuery.data ?? []

  const createReviewMutation = useCreateReview({
    mutationConfig: {
      onSuccess: () => {
        void navigate(paths.reviews.getHref())
      },
      onError: (err) => {
        setError(err.message)
      },
    },
  })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const itemId = allowItemIdEdit ? Number(selectedItemId) : initialItemId
    if (itemId == null || Number.isNaN(itemId) || itemId < 1) {
      setError('Item is required')
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
      {allowItemIdEdit && (
        <label>
          Item
          {itemsQuery.isPending ? (
            <p className="empty">Loading items…</p>
          ) : itemsQuery.isError ? (
            <div className="banner error">{itemsQuery.error.message}</div>
          ) : (
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an item
              </option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
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

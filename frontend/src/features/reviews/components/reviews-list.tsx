import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { paths } from '@/config/paths'
import { useReviews } from '@/features/reviews/api/get-reviews'
import { formatDate, toIsoFromLocalInput } from '@/utils/format'

const PAGE_SIZE = 20

export function ReviewsList() {
  const [filterItemId, setFilterItemId] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [skip, setSkip] = useState(0)
  const [appliedFilters, setAppliedFilters] = useState({
    itemId: undefined as number | undefined,
    from: undefined as string | undefined,
    to: undefined as string | undefined,
  })

  const reviewsQuery = useReviews({
    params: {
      ...appliedFilters,
      skip,
      take: PAGE_SIZE,
    },
  })

  function onFilterReviews(event: FormEvent) {
    event.preventDefault()
    setSkip(0)
    setAppliedFilters({
      itemId: filterItemId ? Number(filterItemId) : undefined,
      from: filterFrom ? toIsoFromLocalInput(filterFrom) : undefined,
      to: filterTo ? toIsoFromLocalInput(filterTo) : undefined,
    })
  }

  const reviews = reviewsQuery.data ?? []

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Review audit</h2>
        <Link to={paths.createReview.getHref()}>Create Review</Link>
      </div>
      <form className="form filters" onSubmit={onFilterReviews}>
        <label>
          Item ID
          <input
            type="number"
            value={filterItemId}
            onChange={(e) => setFilterItemId(e.target.value)}
            min={1}
          />
        </label>
        <label>
          From
          <input
            type="datetime-local"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
        </label>
        <label>
          To
          <input type="datetime-local" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
        </label>
        <button type="submit">Apply filters</button>
      </form>

      {reviewsQuery.isPending && <p className="empty">Loading reviews…</p>}
      {reviewsQuery.isError && <div className="banner error">{reviewsQuery.error.message}</div>}

      {!reviewsQuery.isPending && !reviewsQuery.isError && reviews.length === 0 ? (
        <p className="empty">No reviews found.</p>
      ) : null}

      {!reviewsQuery.isPending && !reviewsQuery.isError && reviews.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Owner</th>
              <th>Reviewer</th>
              <th>Reviewed</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>
                  #{review.itemId} {review.itemName}
                </td>
                <td>{review.owner}</td>
                <td>{review.reviewerEmail}</td>
                <td>{formatDate(review.reviewedAtUtc)}</td>
                <td>{review.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div className="row">
        <button type="button" disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - PAGE_SIZE))}>
          Previous
        </button>
        <span>
          Showing from {skip} (page size {PAGE_SIZE})
        </span>
        <button
          type="button"
          disabled={reviews.length < PAGE_SIZE}
          onClick={() => setSkip(skip + PAGE_SIZE)}
        >
          Next
        </button>
      </div>
    </section>
  )
}

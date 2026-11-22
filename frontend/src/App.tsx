import { useEffect, useState, type FormEvent } from 'react'
import { createItem, createReview, listOverdueItems, listReviews } from './api'
import { REVIEW_FREQUENCIES } from './types'
import type {
  AuditReviewResponse,
  ItemResponse,
  OverdueItemResponse,
  ReviewFrequency,
} from './types'
import './App.css'

type Tab = 'items' | 'overdue' | 'reviews'

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function toIsoFromLocalInput(value: string): string {
  return new Date(value).toISOString()
}

export default function App() {
  const [tab, setTab] = useState<Tab>('items')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [reviewFrequency, setReviewFrequency] = useState<ReviewFrequency>('Monthly')
  const [nextDueLocal, setNextDueLocal] = useState('')
  const [createdItem, setCreatedItem] = useState<ItemResponse | null>(null)

  const [overdue, setOverdue] = useState<OverdueItemResponse[]>([])
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [activeItemId, setActiveItemId] = useState<number | null>(null)

  const [reviews, setReviews] = useState<AuditReviewResponse[]>([])
  const [filterItemId, setFilterItemId] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [skip, setSkip] = useState(0)
  const take = 20

  async function refreshOverdue() {
    const items = await listOverdueItems()
    setOverdue(items)
  }

  async function refreshReviews(nextSkip = skip) {
    const data = await listReviews({
      itemId: filterItemId ? Number(filterItemId) : undefined,
      from: filterFrom ? toIsoFromLocalInput(filterFrom) : undefined,
      to: filterTo ? toIsoFromLocalInput(filterTo) : undefined,
      skip: nextSkip,
      take,
    })
    setReviews(data)
  }

  useEffect(() => {
    if (tab === 'overdue') {
      setError(null)
      refreshOverdue().catch((err: Error) => setError(err.message))
    }
    if (tab === 'reviews') {
      setError(null)
      refreshReviews().catch((err: Error) => setError(err.message))
    }
  }, [tab, skip])

  async function onCreateItem(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      const item = await createItem({
        name,
        owner,
        reviewFrequency,
        nextReviewDueAtUtc: toIsoFromLocalInput(nextDueLocal),
      })
      setCreatedItem(item)
      setMessage(`Created item #${item.id}`)
      setName('')
      setOwner('')
      setNextDueLocal('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
    }
  }

  async function onRecordReview(event: FormEvent) {
    event.preventDefault()
    if (activeItemId == null) return
    setError(null)
    setMessage(null)
    try {
      const review = await createReview(activeItemId, {
        reviewerEmail,
        note: reviewNote || null,
      })
      setMessage(`Recorded review #${review.id} for item #${activeItemId}`)
      setActiveItemId(null)
      setReviewerEmail('')
      setReviewNote('')
      await refreshOverdue()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record review')
    }
  }

  async function onFilterReviews(event: FormEvent) {
    event.preventDefault()
    setError(null)
    try {
      setSkip(0)
      await refreshReviews(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Review Tracker</h1>
        <p>Track review cadence for owned items.</p>
      </header>

      <nav className="tabs">
        <button className={tab === 'items' ? 'active' : ''} onClick={() => setTab('items')}>
          Create Item
        </button>
        <button className={tab === 'overdue' ? 'active' : ''} onClick={() => setTab('overdue')}>
          Overdue
        </button>
        <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
          Reviews
        </button>
      </nav>

      {error && <div className="banner error">{error}</div>}
      {message && <div className="banner success">{message}</div>}

      {tab === 'items' && (
        <section className="panel">
          <h2>Create item</h2>
          <form className="form" onSubmit={onCreateItem}>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} />
            </label>
            <label>
              Owner email
              <input
                type="email"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
                maxLength={320}
              />
            </label>
            <label>
              Review frequency
              <select
                value={reviewFrequency}
                onChange={(e) => setReviewFrequency(e.target.value as ReviewFrequency)}
              >
                {REVIEW_FREQUENCIES.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Next review due
              <input
                type="datetime-local"
                value={nextDueLocal}
                onChange={(e) => setNextDueLocal(e.target.value)}
                required
              />
            </label>
            <button type="submit">Create</button>
          </form>
          {createdItem && (
            <div className="created">
              <h3>Latest created item</h3>
              <p>
                #{createdItem.id} — {createdItem.name} ({createdItem.owner}) ·{' '}
                {createdItem.reviewFrequency} · due {formatDate(createdItem.nextReviewDueAtUtc)}
              </p>
            </div>
          )}
        </section>
      )}

      {tab === 'overdue' && (
        <section className="panel">
          <div className="panel-header">
            <h2>Overdue items</h2>
            <button type="button" onClick={() => refreshOverdue().catch((err: Error) => setError(err.message))}>
              Refresh
            </button>
          </div>
          {overdue.length === 0 ? (
            <p className="empty">No overdue items.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Frequency</th>
                  <th>Last reviewed</th>
                  <th>Due</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {overdue.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.owner}</td>
                    <td>{item.reviewFrequency}</td>
                    <td>{formatDate(item.lastReviewedAtUtc)}</td>
                    <td>{formatDate(item.nextReviewDueAtUtc)}</td>
                    <td>
                      <button type="button" onClick={() => setActiveItemId(item.id)}>
                        Record review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeItemId != null && (
            <form className="form review-form" onSubmit={onRecordReview}>
              <h3>Record review for item #{activeItemId}</h3>
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
                <button type="submit">Save review</button>
                <button type="button" className="secondary" onClick={() => setActiveItemId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {tab === 'reviews' && (
        <section className="panel">
          <h2>Review audit</h2>
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

          {reviews.length === 0 ? (
            <p className="empty">No reviews found.</p>
          ) : (
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
          )}

          <div className="row">
            <button type="button" disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - take))}>
              Previous
            </button>
            <span>
              Showing from {skip} (page size {take})
            </span>
            <button
              type="button"
              disabled={reviews.length < take}
              onClick={() => setSkip(skip + take)}
            >
              Next
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

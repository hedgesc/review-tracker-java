import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'
import { useCreateItem } from '@/features/items/api/create-item'
import { REVIEW_FREQUENCIES, type ReviewFrequency } from '@/types/api'
import { toIsoFromLocalInput } from '@/utils/format'

export function CreateItemForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [reviewFrequency, setReviewFrequency] = useState<ReviewFrequency>('Monthly')
  const [nextDueLocal, setNextDueLocal] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createItemMutation = useCreateItem({
    mutationConfig: {
      onSuccess: () => {
        void navigate(paths.home.getHref())
      },
      onError: (err) => {
        setError(err.message)
      },
    },
  })

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    createItemMutation.mutate({
      name,
      owner,
      reviewFrequency,
      nextReviewDueAtUtc: toIsoFromLocalInput(nextDueLocal),
    })
  }

  return (
    <section className="panel">
      <h2>Create item</h2>
      {error && <div className="banner error">{error}</div>}
      <form className="form" onSubmit={onSubmit}>
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
        <button type="submit" disabled={createItemMutation.isPending}>
          Create
        </button>
      </form>
    </section>
  )
}

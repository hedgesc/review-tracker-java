import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { paths } from '@/config/paths'
import { useItems } from '@/features/items/api/get-items'
import { formatDate } from '@/utils/format'

const PAGE_SIZE = 20

type ItemsListProps = {
  activeItemId: number | null
  onSelectItem: (itemId: number) => void
  message?: string | null
  footer?: ReactNode
}

export function ItemsList({ activeItemId, onSelectItem, message, footer }: ItemsListProps) {
  const [filter, setFilter] = useState<'all' | 'overdue'>('all')
  const [skip, setSkip] = useState(0)

  const itemsQuery = useItems({
    params: {
      filter: filter === 'overdue' ? 'overdue' : undefined,
      skip,
      take: PAGE_SIZE,
    },
  })

  const items = itemsQuery.data ?? []

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Items</h2>
        <Link to={paths.createItem.getHref()}>Create Item</Link>
      </div>

      <div className="form filters">
        <label>
          Filter
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'overdue')
              setSkip(0)
            }}
          >
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>
      </div>

      {message && <div className="banner success">{message}</div>}

      {itemsQuery.isPending && <p className="empty">Loading items…</p>}
      {itemsQuery.isError && <div className="banner error">{itemsQuery.error.message}</div>}

      {!itemsQuery.isPending && !itemsQuery.isError && items.length === 0 ? (
        <p className="empty">No items found.</p>
      ) : null}

      {!itemsQuery.isPending && !itemsQuery.isError && items.length > 0 ? (
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
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.owner}</td>
                <td>{item.reviewFrequency}</td>
                <td>{formatDate(item.lastReviewedAtUtc)}</td>
                <td>{formatDate(item.nextReviewDueAtUtc)}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => onSelectItem(item.id)}
                    disabled={activeItemId === item.id}
                  >
                    Create Review
                  </button>
                </td>
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
          disabled={items.length < PAGE_SIZE}
          onClick={() => setSkip(skip + PAGE_SIZE)}
        >
          Next
        </button>
      </div>

      {footer}
    </section>
  )
}

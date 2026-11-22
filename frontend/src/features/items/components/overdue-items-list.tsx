import type { ReactNode } from 'react'

import { useOverdueItems } from '@/features/items/api/get-overdue-items'
import { formatDate } from '@/utils/format'

type OverdueItemsListProps = {
  activeItemId: number | null
  onSelectItem: (itemId: number) => void
  message?: string | null
  footer?: ReactNode
}

export function OverdueItemsList({
  activeItemId,
  onSelectItem,
  message,
  footer,
}: OverdueItemsListProps) {
  const overdueQuery = useOverdueItems()

  if (overdueQuery.isPending) {
    return (
      <section className="panel">
        <p className="empty">Loading overdue items…</p>
      </section>
    )
  }

  if (overdueQuery.isError) {
    return (
      <section className="panel">
        <div className="banner error">{overdueQuery.error.message}</div>
      </section>
    )
  }

  const overdue = overdueQuery.data

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Overdue items</h2>
        <button type="button" onClick={() => void overdueQuery.refetch()}>
          Refresh
        </button>
      </div>
      {message && <div className="banner success">{message}</div>}
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
                  <button
                    type="button"
                    onClick={() => onSelectItem(item.id)}
                    disabled={activeItemId === item.id}
                  >
                    Record review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {footer}
    </section>
  )
}

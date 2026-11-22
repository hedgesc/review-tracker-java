import { useState } from 'react'

import { OverdueItemsList } from '@/features/items/components/overdue-items-list'
import { RecordReviewForm } from '@/features/reviews/components/record-review-form'

export function OverdueRoute() {
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  return (
    <OverdueItemsList
      activeItemId={activeItemId}
      onSelectItem={(itemId) => {
        setMessage(null)
        setActiveItemId(itemId)
      }}
      message={message}
      footer={
        activeItemId != null ? (
          <RecordReviewForm
            itemId={activeItemId}
            onCancel={() => setActiveItemId(null)}
            onSuccess={(reviewId) => {
              setMessage(`Recorded review #${reviewId} for item #${activeItemId}`)
              setActiveItemId(null)
            }}
          />
        ) : null
      }
    />
  )
}

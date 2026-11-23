import { useState } from 'react'

import { ItemsList } from '@/features/items/components/items-list'
import { CreateReviewForm } from '@/features/reviews/components/create-review-form'

export function ItemsRoute() {
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  return (
    <ItemsList
      activeItemId={activeItemId}
      onSelectItem={(itemId) => {
        setMessage(null)
        setActiveItemId(itemId)
      }}
      message={message}
      footer={
        activeItemId != null ? (
          <CreateReviewForm
            itemId={activeItemId}
            onCancel={() => setActiveItemId(null)}
            onSuccess={(reviewId) => {
              setMessage(`Created review #${reviewId} for item #${activeItemId}`)
              setActiveItemId(null)
            }}
          />
        ) : null
      }
    />
  )
}

import { useState } from 'react'

import { ItemsList } from '@/features/items/components/items-list'
import { CreateReviewForm } from '@/features/reviews/components/create-review-form'

export function ItemsRoute() {
  const [activeItem, setActiveItem] = useState<{ id: number; name: string } | null>(
    null,
  )
  const [message, setMessage] = useState<string | null>(null)

  return (
    <ItemsList
      activeItemId={activeItem?.id ?? null}
      onSelectItem={(itemId, itemName) => {
        setMessage(null)
        setActiveItem({ id: itemId, name: itemName })
      }}
      message={message}
      footer={
        activeItem != null ? (
          <CreateReviewForm
            itemId={activeItem.id}
            itemName={activeItem.name}
            onCancel={() => setActiveItem(null)}
            onSuccess={(reviewId) => {
              setMessage(`Created review #${reviewId} for ${activeItem.name}`)
              setActiveItem(null)
            }}
          />
        ) : null
      }
    />
  )
}

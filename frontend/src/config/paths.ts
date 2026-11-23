export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  createItem: {
    path: '/items/create',
    getHref: () => '/items/create',
  },
  reviews: {
    path: '/reviews',
    getHref: () => '/reviews',
  },
  createReview: {
    path: '/reviews/create',
    getHref: (itemId?: number) =>
      itemId != null ? `/reviews/create?itemId=${itemId}` : '/reviews/create',
  },
} as const

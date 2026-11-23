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
    getHref: () => '/reviews/create',
  },
} as const

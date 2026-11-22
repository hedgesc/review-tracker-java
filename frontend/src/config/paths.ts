export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  overdue: {
    path: '/overdue',
    getHref: () => '/overdue',
  },
  reviews: {
    path: '/reviews',
    getHref: () => '/reviews',
  },
} as const

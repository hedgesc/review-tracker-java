import { createBrowserRouter, Navigate } from 'react-router'

import { paths } from '@/config/paths'

import { AppRootLayout } from './routes/root'
import { CreateItemRoute } from './routes/create-item'
import { CreateReviewRoute } from './routes/create-review'
import { ItemsRoute } from './routes/items'
import { NotFoundRoute } from './routes/not-found'
import { ReviewsRoute } from './routes/reviews'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <AppRootLayout />,
      children: [
        {
          index: true,
          element: <ItemsRoute />,
        },
        {
          path: 'items/create',
          element: <CreateItemRoute />,
        },
        {
          path: 'reviews',
          element: <ReviewsRoute />,
        },
        {
          path: 'reviews/create',
          element: <CreateReviewRoute />,
        },
        {
          path: '*',
          element: <NotFoundRoute />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={paths.home.getHref()} replace />,
    },
  ])

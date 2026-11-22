import { createBrowserRouter, Navigate } from 'react-router'

import { paths } from '@/config/paths'

import { AppRootLayout } from './routes/root'
import { ItemsRoute } from './routes/items'
import { NotFoundRoute } from './routes/not-found'
import { OverdueRoute } from './routes/overdue'
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
          path: 'overdue',
          element: <OverdueRoute />,
        },
        {
          path: 'reviews',
          element: <ReviewsRoute />,
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

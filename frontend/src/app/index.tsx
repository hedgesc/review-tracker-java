import { useMemo } from 'react'
import { RouterProvider } from 'react-router'

import { AppProvider } from './provider'
import { createAppRouter } from './router'

import '@/App.css'

export function App() {
  const router = useMemo(() => createAppRouter(), [])

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}

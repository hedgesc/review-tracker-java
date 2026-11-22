import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Component, useState, type ErrorInfo, type ReactNode, Suspense } from 'react'

import { MainErrorFallback } from '@/components/errors/main'
import { queryConfig } from '@/lib/react-query'

type AppProviderProps = {
  children: ReactNode
}

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return <MainErrorFallback error={this.state.error} resetErrorBoundary={this.reset} />
    }
    return this.props.children
  }
}

export function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  )

  return (
    <Suspense
      fallback={
        <div className="app">
          <p className="empty">Loading…</p>
        </div>
      }
    >
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          {import.meta.env.DEV && <ReactQueryDevtools />}
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  )
}

type MainErrorFallbackProps = {
  error: Error
  resetErrorBoundary?: () => void
}

export function MainErrorFallback({ error, resetErrorBoundary }: MainErrorFallbackProps) {
  return (
    <div className="app" role="alert">
      <div className="banner error">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        {resetErrorBoundary && (
          <button type="button" onClick={resetErrorBoundary}>
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

export function toIsoFromLocalInput(value: string): string {
  return new Date(value).toISOString()
}

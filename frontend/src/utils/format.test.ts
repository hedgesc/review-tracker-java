import { describe, expect, it } from 'vitest'

import { formatDate, toIsoFromLocalInput } from './format'

describe('formatDate', () => {
  it('returns an em dash for empty values', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('')).toBe('—')
  })

  it('formats ISO timestamps', () => {
    const result = formatDate('2024-01-15T12:00:00.000Z')
    expect(result).not.toBe('—')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('toIsoFromLocalInput', () => {
  it('converts a local datetime string to ISO', () => {
    const iso = toIsoFromLocalInput('2024-06-01T10:30')
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(() => new Date(iso)).not.toThrow()
  })
})

import { describe, it, expect } from 'vitest'
import { calculateEqualSplit } from './math'

describe('Math Utilities - calculateEqualSplit', () => {
  it('splits amount equally and returns string with 7 decimal precision', () => {
    expect(calculateEqualSplit(100, 3)).toBe('33.3333333')
    expect(calculateEqualSplit(50, 4)).toBe('12.5000000')
    expect(calculateEqualSplit(10, 1)).toBe('10.0000000')
  })

  it('handles zero split count safely', () => {
    expect(calculateEqualSplit(100, 0)).toBe('0.0000000')
    expect(calculateEqualSplit(100, -5)).toBe('0.0000000')
  })

  it('handles negative or zero amounts safely', () => {
    expect(calculateEqualSplit(0, 5)).toBe('0.0000000')
    expect(calculateEqualSplit(-10, 2)).toBe('0.0000000')
  })

  it('formats large numbers correctly without scientific notation', () => {
    expect(calculateEqualSplit(1000000, 2)).toBe('500000.0000000')
  })
})

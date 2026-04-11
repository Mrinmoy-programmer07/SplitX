import { describe, it, expect } from 'vitest'
import {
  calculateSplit,
  xlmToStroops,
  stroopsToXlm,
  isValidStellarAddress,
  truncateAddress,
} from '../utils/splitCalculator'

// ─── calculateSplit ──────────────────────────────────────────────────────────

describe('calculateSplit', () => {
  it('splits evenly between 4 people', () => {
    expect(calculateSplit('120', 4)).toBe('30.0000000')
  })

  it('handles uneven splits with 7-decimal precision', () => {
    // 100 / 3 = 33.3333333...
    expect(calculateSplit('100', 3)).toBe('33.3333333')
  })

  it('works for a single person (no split)', () => {
    expect(calculateSplit('50', 1)).toBe('50.0000000')
  })

  it('handles fractional XLM inputs', () => {
    expect(calculateSplit('0.5', 2)).toBe('0.2500000')
  })

  it('throws on zero amount', () => {
    expect(() => calculateSplit('0', 2)).toThrow('Amount must be a positive number')
  })

  it('throws on negative amount', () => {
    expect(() => calculateSplit('-10', 2)).toThrow('Amount must be a positive number')
  })

  it('throws on non-numeric amount', () => {
    expect(() => calculateSplit('abc', 2)).toThrow('Amount must be a positive number')
  })

  it('throws on zero split count', () => {
    expect(() => calculateSplit('100', 0)).toThrow('Split count must be a positive integer')
  })

  it('throws on fractional split count', () => {
    expect(() => calculateSplit('100', 2.5)).toThrow('Split count must be a positive integer')
  })
})

// ─── xlmToStroops ────────────────────────────────────────────────────────────

describe('xlmToStroops', () => {
  it('converts 1 XLM to 10,000,000 stroops', () => {
    expect(xlmToStroops('1')).toBe(10_000_000)
  })

  it('converts 25 XLM to 250,000,000 stroops', () => {
    expect(xlmToStroops('25')).toBe(250_000_000)
  })

  it('converts 0.5 XLM to 5,000,000 stroops', () => {
    expect(xlmToStroops('0.5')).toBe(5_000_000)
  })

  it('converts 0 XLM to 0 stroops', () => {
    expect(xlmToStroops('0')).toBe(0)
  })

  it('throws on invalid (NaN) input', () => {
    expect(() => xlmToStroops('abc')).toThrow('Invalid XLM amount')
  })

  it('throws on negative XLM', () => {
    expect(() => xlmToStroops('-5')).toThrow('Invalid XLM amount')
  })
})

// ─── stroopsToXlm ────────────────────────────────────────────────────────────

describe('stroopsToXlm', () => {
  it('converts 10,000,000 stroops to 1 XLM', () => {
    expect(stroopsToXlm(10_000_000)).toBe('1.0000000')
  })

  it('converts 250,000,000 stroops to 25 XLM', () => {
    expect(stroopsToXlm(250_000_000)).toBe('25.0000000')
  })

  it('converts 0 stroops to 0 XLM', () => {
    expect(stroopsToXlm(0)).toBe('0.0000000')
  })

  it('throws on negative stroops', () => {
    expect(() => stroopsToXlm(-1)).toThrow('Invalid stroop amount')
  })

  it('throws on fractional stroops', () => {
    expect(() => stroopsToXlm(1.5)).toThrow('Invalid stroop amount')
  })
})

// ─── isValidStellarAddress ───────────────────────────────────────────────────

describe('isValidStellarAddress', () => {
  it('accepts a real valid G... public key', () => {
    expect(
      isValidStellarAddress('GDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6DE'),
    ).toBe(true)
  })

  it('rejects an address starting with wrong letter', () => {
    expect(
      isValidStellarAddress('SDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6DE'),
    ).toBe(false)
  })

  it('rejects an address that is too short', () => {
    expect(isValidStellarAddress('GDMZTV')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidStellarAddress('')).toBe(false)
  })

  it('rejects an address with invalid base32 characters', () => {
    expect(
      isValidStellarAddress('GDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6D0'),
    ).toBe(false)   // '0' is not valid in Stellar base32
  })
})

// ─── truncateAddress ─────────────────────────────────────────────────────────

describe('truncateAddress', () => {
  it('truncates a long address with default chars=4', () => {
    // 'GDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6DE'
    // First 4: GDMZ, Last 4: P6DE
    expect(
      truncateAddress('GDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6DE'),
    ).toBe('GDMZ...P6DE')
  })

  it('uses custom chars parameter', () => {
    const result = truncateAddress('GDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6DE', 6)
    // First 6: GDMZTV, Last 6: SPP6DE
    expect(result).toBe('GDMZTV...SPP6DE')
  })

  it('returns the address unchanged if it is too short to truncate', () => {
    expect(truncateAddress('GDMZ', 4)).toBe('GDMZ')
  })
})

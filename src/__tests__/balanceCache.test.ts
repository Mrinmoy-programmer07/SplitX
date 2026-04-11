import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCachedBalance,
  setCachedBalance,
  clearBalanceCache,
  isCacheValid,
} from '../utils/balanceCache'

const TEST_ADDRESS = 'GDMZTVFVYFJHBABTPEAOQSMKVUA2UOAYLPWVZSO334KCE3B2GHSPP6DE'

beforeEach(() => {
  // Always start with a clean cache
  clearBalanceCache()
  sessionStorage.clear()
})

// ─── getCachedBalance ────────────────────────────────────────────────────────

describe('getCachedBalance', () => {
  it('returns null when cache is empty', () => {
    expect(getCachedBalance(TEST_ADDRESS)).toBeNull()
  })

  it('returns the cached balance after setting it', () => {
    setCachedBalance(TEST_ADDRESS, '1234.5600000')
    expect(getCachedBalance(TEST_ADDRESS)).toBe('1234.5600000')
  })

  it('returns null for a different address than cached', () => {
    setCachedBalance(TEST_ADDRESS, '100.0000000')
    expect(getCachedBalance('GDIFFERENTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')).toBeNull()
  })
})

// ─── setCachedBalance ────────────────────────────────────────────────────────

describe('setCachedBalance', () => {
  it('stores and retrieves a balance', () => {
    setCachedBalance(TEST_ADDRESS, '42.0000000')
    expect(getCachedBalance(TEST_ADDRESS)).toBe('42.0000000')
  })

  it('overwrites a previously cached balance', () => {
    setCachedBalance(TEST_ADDRESS, '10.0000000')
    setCachedBalance(TEST_ADDRESS, '20.0000000')
    expect(getCachedBalance(TEST_ADDRESS)).toBe('20.0000000')
  })
})

// ─── clearBalanceCache ───────────────────────────────────────────────────────

describe('clearBalanceCache', () => {
  it('removes a cached balance', () => {
    setCachedBalance(TEST_ADDRESS, '50.0000000')
    clearBalanceCache()
    expect(getCachedBalance(TEST_ADDRESS)).toBeNull()
  })

  it('does not throw when called on empty cache', () => {
    expect(() => clearBalanceCache()).not.toThrow()
  })
})

// ─── isCacheValid ────────────────────────────────────────────────────────────

describe('isCacheValid', () => {
  it('returns false when cache is empty', () => {
    expect(isCacheValid(TEST_ADDRESS)).toBe(false)
  })

  it('returns true immediately after setting a balance', () => {
    setCachedBalance(TEST_ADDRESS, '99.0000000')
    expect(isCacheValid(TEST_ADDRESS)).toBe(true)
  })

  it('returns false after clearing the cache', () => {
    setCachedBalance(TEST_ADDRESS, '99.0000000')
    clearBalanceCache()
    expect(isCacheValid(TEST_ADDRESS)).toBe(false)
  })
})

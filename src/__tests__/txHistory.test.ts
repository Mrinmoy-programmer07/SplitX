import { describe, it, expect, beforeEach } from 'vitest'
import {
  addTxToHistory,
  getTxHistory,
  clearTxHistory,
} from '../utils/txHistory'

beforeEach(() => {
  clearTxHistory()
  localStorage.clear()
})

const makeTx = (name: string, hash: string) => ({
  name,
  amount: '25.0000000',
  recipient: 'GDMZ...6DE',
  paymentHash: hash,
  timestamp: Date.now(),
})

// ─── getTxHistory ─────────────────────────────────────────────────────────────

describe('getTxHistory', () => {
  it('returns empty array on first run', () => {
    expect(getTxHistory()).toEqual([])
  })

  it('returns entries in reverse-chronological order (newest first)', () => {
    addTxToHistory(makeTx('Dinner', 'hash1'))
    addTxToHistory(makeTx('Airbnb', 'hash2'))
    const history = getTxHistory()
    expect(history[0].name).toBe('Airbnb')
    expect(history[1].name).toBe('Dinner')
  })
})

// ─── addTxToHistory ───────────────────────────────────────────────────────────

describe('addTxToHistory', () => {
  it('adds an entry and assigns an auto-generated id', () => {
    const entry = addTxToHistory(makeTx('Taxi', 'hash_taxi'))
    expect(entry.id).toBeTruthy()
    expect(typeof entry.id).toBe('string')
  })

  it('keeps only the last 5 entries (MAX_ENTRIES cap)', () => {
    for (let i = 0; i < 7; i++) {
      addTxToHistory(makeTx(`Expense ${i}`, `hash_${i}`))
    }
    expect(getTxHistory().length).toBe(5)
  })

  it('stores contractHash when provided', () => {
    const entry = addTxToHistory({
      ...makeTx('Trip', 'payment_hash'),
      contractHash: 'contract_hash',
    })
    expect(entry.contractHash).toBe('contract_hash')
  })
})

// ─── clearTxHistory ───────────────────────────────────────────────────────────

describe('clearTxHistory', () => {
  it('removes all entries', () => {
    addTxToHistory(makeTx('Hotel', 'hash_hotel'))
    clearTxHistory()
    expect(getTxHistory()).toEqual([])
  })

  it('does not throw when called on an empty history', () => {
    expect(() => clearTxHistory()).not.toThrow()
  })
})

import { describe, it, expect } from 'vitest'
import { classifyError } from '../utils/errorClassifier'

// ─── wallet_not_found ────────────────────────────────────────────────────────

describe('classifyError — wallet_not_found', () => {
  it('classifies "not found" messages', () => {
    const result = classifyError(new Error('Freighter is not found'))
    expect(result.type).toBe('wallet_not_found')
  })

  it('classifies "not installed" messages', () => {
    const result = classifyError(new Error('Extension not installed'))
    expect(result.type).toBe('wallet_not_found')
  })

  it('classifies "is not available" messages', () => {
    const result = classifyError(new Error('Wallet is not available'))
    expect(result.type).toBe('wallet_not_found')
  })

  it('classifies "No wallet module" messages', () => {
    const result = classifyError(new Error('No wallet module registered for this id'))
    expect(result.type).toBe('wallet_not_found')
  })

  it('returns a helpful install message', () => {
    const result = classifyError(new Error('Freighter is not found'))
    expect(result.message).toMatch(/install/i)
  })
})

// ─── rejected ────────────────────────────────────────────────────────────────

describe('classifyError — rejected', () => {
  it('classifies user declined', () => {
    expect(classifyError(new Error('User declined')).type).toBe('rejected')
  })

  it('classifies user rejected (lowercase)', () => {
    expect(classifyError(new Error('user rejected the request')).type).toBe('rejected')
  })

  it('classifies signing was cancelled', () => {
    expect(classifyError(new Error('signing was cancelled')).type).toBe('rejected')
  })

  it('classifies cancel', () => {
    expect(classifyError(new Error('User chose to cancel')).type).toBe('rejected')
  })

  it('returns a user-friendly cancelled message', () => {
    const result = classifyError(new Error('User declined'))
    expect(result.message).toMatch(/cancelled/i)
  })
})

// ─── insufficient_balance ────────────────────────────────────────────────────

describe('classifyError — insufficient_balance', () => {
  it('classifies op_underfunded via result_codes', () => {
    const error = {
      message: 'Transaction failed',
      response: { data: { extras: { result_codes: { operations: ['op_underfunded'] } } } },
    }
    expect(classifyError(error).type).toBe('insufficient_balance')
  })

  it('classifies "underfunded" in message', () => {
    expect(classifyError(new Error('Account is underfunded')).type).toBe('insufficient_balance')
  })

  it('classifies "insufficient" in message', () => {
    expect(classifyError(new Error('insufficient balance')).type).toBe('insufficient_balance')
  })

  it('returns a balance-specific message', () => {
    const result = classifyError(new Error('underfunded'))
    expect(result.message).toMatch(/XLM/i)
  })
})

// ─── no_destination ──────────────────────────────────────────────────────────

describe('classifyError — no_destination', () => {
  it('classifies op_no_destination via result_codes', () => {
    const error = {
      message: 'tx failed',
      response: { data: { extras: { result_codes: { operations: ['op_no_destination'] } } } },
    }
    expect(classifyError(error).type).toBe('no_destination')
  })

  it('classifies op_no_destination in message text', () => {
    expect(
      classifyError(new Error('op_no_destination')).type,
    ).toBe('no_destination')
  })
})

// ─── contract_error ───────────────────────────────────────────────────────────

describe('classifyError — contract_error', () => {
  it('classifies Soroban simulation errors', () => {
    expect(classifyError(new Error('simulation failed')).type).toBe('contract_error')
  })

  it('classifies contract-related errors', () => {
    expect(classifyError(new Error('Contract invocation failed')).type).toBe('contract_error')
  })
})

// ─── unknown ─────────────────────────────────────────────────────────────────

describe('classifyError — unknown fallback', () => {
  it('returns unknown for unrecognised errors', () => {
    expect(classifyError(new Error('Something weird happened')).type).toBe('unknown')
  })

  it('returns a fallback message when error has no message', () => {
    const result = classifyError({})
    expect(result.type).toBe('unknown')
    expect(result.message).toBe('An unexpected error occurred.')
  })

  it('handles null gracefully', () => {
    expect(() => classifyError(null)).not.toThrow()
  })
})

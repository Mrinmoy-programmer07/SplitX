import { describe, it, expect } from 'vitest'
import { classifyError } from './error'

describe('Error Utilities - classifyError', () => {
  it('identifies wallet not found errors', () => {
    const error1 = { message: 'not installed' }
    expect(classifyError(error1)).toEqual({
      type: 'wallet_not_found',
      message: 'Wallet extension not detected. Please install it and try again.'
    })
  })

  it('identifies user rejected errors', () => {
    const error = { message: 'User declined the transaction' }
    expect(classifyError(error)).toEqual({
      type: 'rejected',
      message: 'You cancelled the transaction in your wallet.'
    })
  })

  it('identifies insufficient balance errors via result_codes', () => {
    const error = {
      message: 'Transaction failed',
      response: { data: { extras: { result_codes: { operations: ['op_underfunded'] } } } }
    }
    expect(classifyError(error)).toEqual({
      type: 'insufficient_balance',
      message: 'Not enough XLM in your wallet for this transaction + fees.'
    })
  })

  it('identifies contract errors', () => {
    const error = { message: 'Contract simulation failed' }
    expect(classifyError(error)).toEqual({
      type: 'contract_error',
      message: 'Contract simulation failed'
    })
  })

  it('falls back to unknown for unidentified errors', () => {
    const error = { message: 'Something went incredibly wrong.' }
    expect(classifyError(error)).toEqual({
      type: 'unknown',
      message: 'Something went incredibly wrong.'
    })
  })
})

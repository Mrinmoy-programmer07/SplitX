/**
 * Error Classification Utility
 * Classifies raw blockchain/wallet errors into typed UI-friendly messages.
 * Extracted from App.tsx for independent testability.
 */

export type ErrorType =
  | 'wallet_not_found'
  | 'rejected'
  | 'insufficient_balance'
  | 'no_destination'
  | 'contract_error'
  | 'unknown'

export interface ClassifiedError {
  type: ErrorType
  message: string
}

export function classifyError(error: unknown): ClassifiedError {
  const err = error as any
  const msg: string = err?.message ?? ''
  const codes = err?.response?.data?.extras?.result_codes

  // Error Type 1: Wallet extension not found / not installed
  if (
    msg.includes('not found') ||
    msg.includes('not installed') ||
    msg.includes('is not available') ||
    msg.includes('No wallet module')
  ) {
    return {
      type: 'wallet_not_found',
      message: 'Wallet extension not detected. Please install it and try again.',
    }
  }

  // Error Type 2: User declined / rejected in wallet popup
  if (
    msg.includes('decline') ||
    msg.includes('reject') ||
    msg.includes('cancel') ||
    msg.includes('User declined') ||
    msg.includes('cancelled') ||
    msg.includes('user rejected') ||
    msg.includes('signing was cancelled')
  ) {
    return {
      type: 'rejected',
      message: 'You cancelled the transaction in your wallet.',
    }
  }

  // Error Type 3: Insufficient balance / underfunded
  if (
    codes?.operations?.includes('op_underfunded') ||
    msg.includes('underfunded') ||
    msg.includes('insufficient')
  ) {
    return {
      type: 'insufficient_balance',
      message: 'Not enough XLM in your wallet for this transaction + fees.',
    }
  }

  // Destination account does not exist on the network
  if (
    codes?.operations?.includes('op_no_destination') ||
    msg.includes('op_no_destination')
  ) {
    return {
      type: 'no_destination',
      message: 'The recipient address does not exist on the Stellar network.',
    }
  }

  // Soroban / contract-related error
  if (msg.includes('Contract') || msg.includes('contract') || msg.includes('simulation')) {
    return { type: 'contract_error', message: msg }
  }

  return { type: 'unknown', message: msg || 'An unexpected error occurred.' }
}

// We define ErrorType similarly to what was in App.tsx / TransactionModal
export type ErrorType = 
  | 'wallet_not_found' 
  | 'rejected' 
  | 'insufficient_balance' 
  | 'no_destination' 
  | 'contract_error' 
  | 'unknown';

export function classifyError(error: any): { message: string; type: ErrorType } {
  const msg: string = error?.message ?? ''
  const codes = error?.response?.data?.extras?.result_codes

  // Error Type 1: Wallet not found / extension not installed
  if (
    msg.includes('not found') ||
    msg.includes('not installed') ||
    msg.includes('is not available') ||
    msg.includes('No wallet module')
  ) {
    return { type: 'wallet_not_found', message: 'Wallet extension not detected. Please install it and try again.' }
  }

  // Error Type 2: User rejected / declined in wallet popup
  if (
    msg.includes('decline') ||
    msg.includes('reject') ||
    msg.includes('cancel') ||
    msg.includes('User declined') ||
    msg.includes('cancelled') ||
    msg.includes('user rejected') ||
    msg.includes('signing was cancelled')
  ) {
    return { type: 'rejected', message: 'You cancelled the transaction in your wallet.' }
  }

  // Error Type 3: Insufficient balance
  if (
    codes?.operations?.includes('op_underfunded') ||
    msg.includes('underfunded') ||
    msg.includes('insufficient')
  ) {
    return { type: 'insufficient_balance', message: 'Not enough XLM in your wallet for this transaction + fees.' }
  }

  // Destination account does not exist
  if (codes?.operations?.includes('op_no_destination') || msg.includes('op_no_destination')) {
    return { type: 'no_destination', message: 'The recipient address does not exist on the Stellar network.' }
  }

  // Contract-specific error
  if (msg.includes('Contract') || msg.includes('contract') || msg.includes('simulation')) {
    return { type: 'contract_error', message: msg }
  }

  return { type: 'unknown', message: msg || 'An unexpected error occurred.' }
}

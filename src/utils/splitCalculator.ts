/**
 * Expense Splitting Utilities
 * Pure functions for calculating XLM splits — easy to unit test.
 */

export interface SplitResult {
  name: string
  total: string         // gross amount as string (7 decimal places)
  perPerson: string     // per-person amount (7 decimal places)
  splitCount: number
  address: string
}

/**
 * Calculate the per-person share of an expense.
 * Returns perPerson rounded to 7 decimal places (Stellar's precision).
 *
 * @param amountXlm  - Total expense in XLM (e.g. "120")
 * @param splitCount - Number of people to split between (>= 1)
 * @returns perPerson in XLM with 7 decimal precision
 */
export function calculateSplit(amountXlm: string, splitCount: number): string {
  const amount = parseFloat(amountXlm)
  if (isNaN(amount) || amount <= 0) throw new Error('Amount must be a positive number')
  if (!Number.isInteger(splitCount) || splitCount < 1) throw new Error('Split count must be a positive integer')
  return (amount / splitCount).toFixed(7)
}

/**
 * Convert XLM (decimal) to stroops (integer, 1 XLM = 10,000,000 stroops).
 * Stroops are what the Stellar network and Soroban contracts use internally.
 */
export function xlmToStroops(xlm: string): number {
  const val = parseFloat(xlm)
  if (isNaN(val) || val < 0) throw new Error('Invalid XLM amount')
  return Math.round(val * 10_000_000)
}

/**
 * Convert stroops (integer) back to XLM string with 7 decimal places.
 */
export function stroopsToXlm(stroops: number): string {
  if (!Number.isInteger(stroops) || stroops < 0) throw new Error('Invalid stroop amount')
  return (stroops / 10_000_000).toFixed(7)
}

/**
 * Validate a Stellar public key (G... address, always 56 characters).
 */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address)
}

/**
 * Truncate a Stellar address for display (e.g. "GDMZ...PP6DE").
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length < chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

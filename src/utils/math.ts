/**
 * Calculates the equal split debt per person.
 * Ensures strict 7-decimal formatting required by Stellar's generic asset representation.
 * @param amount Total amount to be divided
 * @param splitCount Number of people splitting the bill
 * @returns Formatted string with 7 decimal precision
 */
export function calculateEqualSplit(amount: number, splitCount: number): string {
  if (splitCount <= 0) return '0.0000000'
  if (amount <= 0) return '0.0000000'
  
  return (amount / splitCount).toFixed(7)
}

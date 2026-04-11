/**
 * Transaction History Cache — Orange Belt: Caching + Loading States
 *
 * Persists the last N settlements to localStorage so they survive page
 * refreshes. Displayed in the Dashboard as a "Recent Settlements" list.
 */

const HISTORY_KEY = 'splitx_tx_history'
const MAX_ENTRIES  = 5

export interface TxHistoryEntry {
  id: string              // nanoid-like (timestamp+random)
  name: string            // expense name, e.g. "Airbnb Ibiza"
  amount: string          // per-person XLM amount
  recipient: string       // destination address (truncated for storage)
  paymentHash: string     // Stellar payment TX hash
  contractHash?: string   // Soroban contract call TX hash (optional)
  timestamp: number       // Date.now() at submission
}

function loadHistory(): TxHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as TxHistoryEntry[]) : []
  } catch {
    return []
  }
}

function saveHistory(entries: TxHistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
  } catch {
    // localStorage unavailable — ignore
  }
}

/** Add a completed settlement to the front of the history list. */
export function addTxToHistory(entry: Omit<TxHistoryEntry, 'id'>): TxHistoryEntry {
  const history = loadHistory()
  const newEntry: TxHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  }
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES)
  saveHistory(updated)
  return newEntry
}

/** Get the current list of recent settlements (most recent first). */
export function getTxHistory(): TxHistoryEntry[] {
  return loadHistory()
}

/** Clear all transaction history. */
export function clearTxHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    // ignore
  }
}

/**
 * Balance Cache — Orange Belt: Basic Caching Implementation
 *
 * Caches the XLM balance for a given wallet address with a TTL to avoid
 * hammering Horizon on every render. Persists to sessionStorage so the
 * balance survives hot-reloads but resets when the browser tab is closed.
 */

const CACHE_TTL_MS = 30_000   // 30 seconds
const CACHE_KEY    = 'splitx_balance_cache'

interface CacheEntry {
  address: string
  balance: string
  fetchedAt: number   // Date.now()
}

function loadCache(): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as CacheEntry) : null
  } catch {
    return null
  }
}

function saveCache(entry: CacheEntry): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // sessionStorage unavailable — silently skip
  }
}

/**
 * Get a cached balance for `address` if it's still within the TTL window.
 * Returns `null` if the cache is cold / stale / for a different address.
 */
export function getCachedBalance(address: string): string | null {
  const entry = loadCache()
  if (!entry) return null
  if (entry.address !== address) return null
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null
  return entry.balance
}

/**
 * Store a fresh balance reading in the cache.
 */
export function setCachedBalance(address: string, balance: string): void {
  saveCache({ address, balance, fetchedAt: Date.now() })
}

/**
 * Invalidate the cache (call on disconnect or after a settlement).
 */
export function clearBalanceCache(): void {
  try {
    sessionStorage.removeItem(CACHE_KEY)
  } catch {
    // ignore
  }
}

/** Returns true if a valid (non-stale) cache entry exists for `address`. */
export function isCacheValid(address: string): boolean {
  return getCachedBalance(address) !== null
}

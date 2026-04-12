import { useState, useEffect, useCallback } from 'react'
import {
  StellarWalletsKit,
  KitEventType,
} from '@creit.tech/stellar-wallets-kit'
import { Horizon } from '@stellar/stellar-sdk'

// Wallet identifiers used by the Kit
export type WalletId = 'freighter' | 'albedo' | 'xbull'

export interface WalletInfo {
  id: string
  name: string
  address: string
}

const horizonServer = new Horizon.Server('https://horizon-testnet.stellar.org')

export function useWalletKit() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isKitReady, setIsKitReady] = useState(false)

  // ─── Initialize StellarWalletsKit on mount ─────────────────────────────
  useEffect(() => {
    // Dynamically import modules to avoid SSR issues and reduce bundle
    const initKit = async () => {
      const { FreighterModule } = await import('@creit.tech/stellar-wallets-kit/modules/freighter')
      const { AlbedoModule }    = await import('@creit.tech/stellar-wallets-kit/modules/albedo')
      const { xBullModule }     = await import('@creit.tech/stellar-wallets-kit/modules/xbull')

      StellarWalletsKit.init({
        modules: [
          new FreighterModule(),
          new AlbedoModule(),
          new xBullModule(),
        ],
      })

      setIsKitReady(true)
    }

    initKit().catch(console.error)
  }, [])

  // ─── Listen to Kit state events (wallet connected / changed) ──────────
  useEffect(() => {
    if (!isKitReady) return

    const unsub = StellarWalletsKit.on(KitEventType.STATE_UPDATED, (_event: any) => {
      // The STATE_UPDATED event fires on module/network changes — use getAddress() to sync
      StellarWalletsKit.getAddress().then(({ address }) => {
        if (address) setWallet(address)
      }).catch(() => {})
    })

    return () => { unsub() }
  }, [isKitReady])

  // ─── Fetch XLM balance from Horizon ───────────────────────────────────
  const fetchBalance = useCallback(async (pubKey: string) => {
    try {
      setIsFetching(true)
      const account = await horizonServer.loadAccount(pubKey)
      const xlmBal  = account.balances.find((b: any) => b.asset_type === 'native')
      setBalance(xlmBal ? parseFloat(xlmBal.balance).toFixed(4) : '0.0000')
    } catch {
      setBalance('0.0000 (Unfunded)')
    } finally {
      setIsFetching(false)
    }
  }, [])

  // ─── Connect — skip modal if walletId provided, otherwise open auth modal ───
  const connectWallet = useCallback(async (walletId?: string): Promise<void> => {
    if (!isKitReady) throw new Error('Kit not ready yet')

    let address: string;
    
    if (walletId) {
      // Connect specifically to a wallet module without showing the kit's modal
      StellarWalletsKit.setWallet(walletId);
      const result = await StellarWalletsKit.fetchAddress();
      address = result.address;
    } else {
      // Fallback: Use the kit's built-in modal
      const result = await StellarWalletsKit.authModal();
      address = result.address;
    }

    // Determine which wallet module is selected
    const module  = StellarWalletsKit.selectedModule
    const name    = (module as any).productId ?? 'Unknown Wallet'

    setWallet(address)
    setWalletName(name)
    await fetchBalance(address)
  }, [isKitReady, fetchBalance])

  // ─── Disconnect ────────────────────────────────────────────────────────
  const disconnectWallet = useCallback(async () => {
    await StellarWalletsKit.disconnect()
    setWallet(null)
    setWalletName(null)
    setBalance(null)
  }, [])

  // ─── Sign a transaction XDR ───────────────────────────────────────────
  const signTx = useCallback(async (xdr: string): Promise<string> => {
    if (!wallet) throw new Error('No wallet connected')

    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase: 'Test SDF Network ; September 2015',
      address: wallet,
    })

    return signedTxXdr
  }, [wallet])

  return {
    wallet,
    walletName,
    balance,
    isFetching,
    isKitReady,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    signTx,
  }
}

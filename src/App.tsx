import { useState } from 'react'
import { setAllowed, getUserInfo } from '@stellar/freighter-api'
import { Horizon } from '@stellar/stellar-sdk'

const server = new Horizon.Server("https://horizon-testnet.stellar.org")

function App() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchBalance = async (pubKey: string) => {
    try {
      setIsFetching(true)
      const account = await server.loadAccount(pubKey)
      // XLM is the 'native' asset type on Stellar
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native')
      setBalance(xlmBalance ? xlmBalance.balance : "0.00")
    } catch (e) {
      console.error("Failed to fetch balance:", e)
      // Usually means the account is not yet funded on testnet
      setBalance("0.00 (Unfunded)")
    } finally {
      setIsFetching(false)
    }
  }

  const connectWallet = async () => {
    try {
      if (await setAllowed()) {
         const userInfo = await getUserInfo()
         setWallet(userInfo.publicKey)
         fetchBalance(userInfo.publicKey)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setBalance(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-splitx-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-splitx-primary to-splitx-secondary mb-2 text-center flex justify-center items-center gap-2">
           <svg className="w-8 h-8 text-splitx-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           SplitX
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Decentralized Expense Splitting & Auto Pay</p>
        
        {!wallet ? (
          <button 
            onClick={connectWallet}
            className="w-full bg-splitx-primary text-black font-bold text-lg py-4 px-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            Connect Freighter
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-splitx-background p-5 rounded-xl border border-gray-800 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <svg className="w-24 h-24 text-splitx-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.97-1.31-3.26-3.08-3.72V4h-1.06v1.96c-1.5.31-2.69 1.43-2.69 3.03 0 1.96 1.66 2.84 3.99 3.39 1.85.44 2.45 1.05 2.45 1.81 0 .9-.82 1.54-2.22 1.54-1.57 0-2.3-.82-2.35-1.88H8.88c.06 2.05 1.35 3.3 3.12 3.76V20h1.06v-1.92c1.68-.33 2.87-1.51 2.87-3.14 0-2.25-1.88-2.92-3.62-3.34z"/></svg>
              </div>

              <div className="h-14 w-14 bg-splitx-secondary/20 rounded-full flex items-center justify-center border border-splitx-secondary mb-3 z-10">
                 <svg className="w-6 h-6 text-splitx-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm text-gray-400 mb-1 z-10">Wallet Connected</p>
              <p className="font-mono text-sm max-w-full truncate text-splitx-primary px-4 tracking-wider z-10 mb-4">{wallet.substring(0,6) + "..." + wallet.substring(wallet.length - 6)}</p>

              <div className="w-full bg-gray-900/50 rounded-lg p-3 border border-gray-700/50 text-center z-10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Testnet Balance</p>
                {isFetching ? (
                  <p className="text-2xl font-bold text-gray-300 animate-pulse">Loading...</p>
                ) : (
                  <p className="text-3xl font-bold tracking-tight text-white">{balance} <span className="text-splitx-primary text-xl">XLM</span></p>
                )}
              </div>
            </div>
            
            <button 
              onClick={disconnectWallet}
              className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

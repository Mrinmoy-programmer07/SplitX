import { useState } from 'react'
import { setAllowed, getUserInfo } from '@stellar/freighter-api'

function App() {
  const [wallet, setWallet] = useState<string | null>(null)

  const connectWallet = async () => {
    try {
      if (await setAllowed()) {
         const userInfo = await getUserInfo()
         setWallet(userInfo.publicKey)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
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
            <div className="bg-splitx-background p-4 rounded-xl border border-gray-800 flex flex-col items-center">
              <div className="h-16 w-16 bg-splitx-secondary/20 rounded-full flex items-center justify-center border border-splitx-secondary mb-3">
                 <svg className="w-8 h-8 text-splitx-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
              <p className="font-mono text-sm max-w-full truncate text-splitx-primary px-4 tracking-wider">{wallet.substring(0,6) + "..." + wallet.substring(wallet.length - 6)}</p>
            </div>
            
            <button 
              onClick={disconnectWallet}
              className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

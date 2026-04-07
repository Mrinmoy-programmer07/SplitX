import { useState } from 'react'
import { setAllowed, getUserInfo, signTransaction } from '@stellar/freighter-api'
import { Horizon, TransactionBuilder, Networks, Operation, Asset } from '@stellar/stellar-sdk'

import { Navbar } from './components/layout/Navbar'
import { Dashboard } from './components/pages/Dashboard'
import { LandingPage } from './components/pages/LandingPage'
import { TransactionModal, TxStatus } from './components/dashboard/TransactionModal'
import { ExpenseData } from './components/ExpenseForm'

const server = new Horizon.Server("https://horizon-testnet.stellar.org")

function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing')
  
  const [wallet, setWallet] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [splitResult, setSplitResult] = useState<{name: string, perPerson: string, address: string, total: string} | null>(null)

  // Transaction state
  const [txStatus, setTxStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const fetchBalance = async (pubKey: string) => {
    try {
      setIsFetching(true)
      const account = await server.loadAccount(pubKey)
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native')
      setBalance(xlmBalance ? xlmBalance.balance : "0.00")
    } catch (e) {
      console.error("Failed to fetch balance:", e)
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
    setSplitResult(null)
    setTxStatus('idle')
    setTxHash(null)
    setTxError(null)
  }

  const handleCalculateSplit = (expense: ExpenseData) => {
    const perPerson = (expense.amount / expense.splitCount).toFixed(7) 
    setSplitResult({
      name: expense.name,
      perPerson,
      address: expense.address,
      total: expense.amount.toString()
    })
  }

  const settleDebt = async () => {
    if (!wallet || !splitResult) return

    setTxStatus('signing')
    setTxHash(null)
    setTxError(null)

    try {
      // 1. Load the source account from Horizon
      const sourceAccount = await server.loadAccount(wallet)

      // 2. Fetch the current base fee
      const baseFee = await server.fetchBaseFee()

      // 3. Build the transaction
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: baseFee.toString(),
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: splitResult.address,
            asset: Asset.native(),
            amount: splitResult.perPerson,
          })
        )
        .setTimeout(60)
        .build()

      // 4. Convert to XDR and request signature from Freighter
      const xdr = transaction.toXDR()
      
      const signResult = await signTransaction(xdr, {
        networkPassphrase: Networks.TESTNET,
      })

      // Handle both v2 (returns string XDR) and newer versions (returns object)
      const signedXdr: string = typeof signResult === 'string' 
        ? signResult 
        : (signResult as any).signedTxXdr

      if (!signedXdr) {
        throw new Error('Transaction signing was cancelled or returned empty result.')
      }

      // 5. Submit the signed transaction to the network
      setTxStatus('submitting')

      const signedTransaction = TransactionBuilder.fromXDR(
        signedXdr,
        Networks.TESTNET
      )

      const result = await server.submitTransaction(signedTransaction)
      
      // 6. Success!
      setTxHash(result.hash)
      setTxStatus('success')

      // 7. Refresh balance after settlement
      fetchBalance(wallet)

    } catch (error: any) {
      console.error("Transaction failed:", error)
      
      let message = "An unknown error occurred."
      
      if (error?.message?.includes('User declined')) {
        message = "Transaction was rejected by the user in Freighter."
      } else if (error?.response?.data?.extras?.result_codes) {
        const codes = error.response.data.extras.result_codes
        if (codes.operations?.includes('op_underfunded')) {
          message = "Insufficient XLM balance to complete this transaction."
        } else if (codes.operations?.includes('op_no_destination')) {
          message = "The destination account does not exist on the network."
        } else {
          message = `Transaction failed: ${JSON.stringify(codes)}`
        }
      } else if (error?.message) {
        message = error.message
      }

      setTxError(message)
      setTxStatus('error')
    }
  }

  const handleModalClose = () => {
    setTxStatus('idle')
    setTxHash(null)
    setTxError(null)
    // Clear the split result on success so user can enter a new expense
    if (txStatus === 'success') {
      setSplitResult(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-splitx-background">
      {/* Immersive Animated Background Elements - Global across both Views */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-splitx-secondary rounded-full mix-blend-screen filter blur-[100px] opacity-[0.08] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-splitx-primary rounded-full mix-blend-screen filter blur-[120px] opacity-[0.08] animate-blob delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-splitx-accent rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] animate-blob delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        <Navbar 
          view={view}
          wallet={wallet} 
          onConnect={connectWallet} 
          onDisconnect={disconnectWallet} 
          onLaunch={() => setView('app')}
        />
        
        {view === 'landing' ? (
          <LandingPage onLaunch={() => setView('app')} />
        ) : (
          <Dashboard 
             wallet={wallet}
             balance={balance}
             isFetching={isFetching}
             splitResult={splitResult}
             onCalculate={handleCalculateSplit}
             onSettle={settleDebt}
          />
        )}
      </div>

      {/* Transaction Feedback Modal (overlays everything) */}
      <TransactionModal
        status={txStatus}
        txHash={txHash}
        errorMessage={txError}
        onClose={handleModalClose}
        onRetry={settleDebt}
      />
    </div>
  )
}

export default App

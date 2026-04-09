import { useState, useCallback } from 'react'
import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
} from '@stellar/stellar-sdk'

import { useWalletKit } from './hooks/useWalletKit'
import { logExpenseOnChain } from './hooks/useContract'

import { Navbar }             from './components/layout/Navbar'
import { WalletSelectModal }  from './components/layout/WalletSelectModal'
import { Dashboard }          from './components/pages/Dashboard'
import { LandingPage }        from './components/pages/LandingPage'
import {
  TransactionModal,
  TxStatus,
  TxStep,
  ErrorType,
} from './components/dashboard/TransactionModal'
import { ExpenseData }        from './components/ExpenseForm'

const horizonServer = new Horizon.Server('https://horizon-testnet.stellar.org')

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyError(error: any): { message: string; type: ErrorType } {
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

// ─── Component ──────────────────────────────────────────────────────────────

function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing')

  // Wallet state from the StellarWalletsKit hook
  const {
    wallet,
    walletName,
    balance,
    isFetching,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    signTx,
  } = useWalletKit()

  // Wallet select modal state
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isConnecting, setIsConnecting]       = useState(false)

  // Expense split result
  const [splitResult, setSplitResult] = useState<{
    name: string; perPerson: string; address: string; total: string
  } | null>(null)

  // Transaction state
  const [txStatus,       setTxStatus]       = useState<TxStatus>('idle')
  const [txHash,         setTxHash]         = useState<string | null>(null)
  const [contractTxHash, setContractTxHash] = useState<string | null>(null)
  const [expenseCount,   setExpenseCount]   = useState<number | null>(null)
  const [txError,        setTxError]        = useState<string | null>(null)
  const [errorType,      setErrorType]      = useState<ErrorType>('unknown')
  const [txSteps,        setTxSteps]        = useState<TxStep[]>([])

  // ─── Step helpers ──────────────────────────────────────────────────────
  const buildSteps = (): TxStep[] => [
    { label: 'Loading account from Horizon',   status: 'pending' },
    { label: 'Building payment transaction',   status: 'pending' },
    { label: 'Awaiting wallet signature',      status: 'pending' },
    { label: 'Submitting to Stellar Testnet',  status: 'pending' },
    { label: 'Logging expense on-chain',       status: 'pending' },
    { label: 'Confirming on ledger',           status: 'pending' },
  ]

  const setStep = (index: number, status: TxStep['status']) => {
    setTxSteps((prev) => prev.map((s, i) => i === index ? { ...s, status } : s))
  }

  // ─── Connect wallet ────────────────────────────────────────────────────
  const handleConnectWallet = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
      setShowWalletModal(false)
    } catch (err: any) {
      const { type, message } = classifyError(err)
      setErrorType(type)
      setTxError(message)
      setTxStatus('error')
      setShowWalletModal(false)
    } finally {
      setIsConnecting(false)
    }
  }, [connectWallet])

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet()
    setSplitResult(null)
    setTxStatus('idle')
    setTxHash(null)
    setContractTxHash(null)
    setExpenseCount(null)
    setTxError(null)
  }, [disconnectWallet])

  // ─── Calculate split ───────────────────────────────────────────────────
  const handleCalculateSplit = (expense: ExpenseData) => {
    const perPerson = (expense.amount / expense.splitCount).toFixed(7)
    setSplitResult({
      name: expense.name,
      perPerson,
      address: expense.address,
      total: expense.amount.toString(),
    })
  }

  // ─── Settle debt: payment + contract call ─────────────────────────────
  const settleDebt = useCallback(async () => {
    if (!wallet || !splitResult) return

    const steps = buildSteps()
    setTxSteps(steps)
    setTxStatus('signing')
    setTxHash(null)
    setContractTxHash(null)
    setExpenseCount(null)
    setTxError(null)

    try {
      // Step 0 — Load account
      setStep(0, 'active')
      const sourceAccount = await horizonServer.loadAccount(wallet)
      const baseFee       = await horizonServer.fetchBaseFee()
      setStep(0, 'done')

      // Step 1 — Build transaction
      setStep(1, 'active')
      const tx = new TransactionBuilder(sourceAccount, {
        fee: baseFee.toString(),
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: splitResult.address,
            asset:       Asset.native(),
            amount:      splitResult.perPerson,
          })
        )
        .setTimeout(60)
        .build()
      setStep(1, 'done')

      // Step 2 — Sign (wallet popup)
      setStep(2, 'active')
      const signedXdr = await signTx(tx.toXDR())
      if (!signedXdr) throw new Error('signing was cancelled')
      setStep(2, 'done')

      // Step 3 — Submit XLM payment
      setStep(3, 'active')
      setTxStatus('submitting')
      const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
      const result   = await horizonServer.submitTransaction(signedTx)
      setTxHash(result.hash)
      setStep(3, 'done')

      // Step 4 — Log expense on-chain via Soroban contract
      setStep(4, 'active')
      setTxStatus('confirming')
      try {
        const { contractTxHash: cHash, expenseCount: count } = await logExpenseOnChain(
          wallet,
          splitResult.perPerson,
          signTx
        )
        setContractTxHash(cHash)
        setExpenseCount(count)
        setStep(4, 'done')
      } catch (contractErr: any) {
        // Contract failure is non-fatal — payment already succeeded
        console.warn('Contract call failed (non-fatal):', contractErr)
        setStep(4, 'error')
      }

      // Step 5 — Confirmed
      setStep(5, 'done')
      setTxStatus('success')

      // Refresh balance
      fetchBalance(wallet)

    } catch (error: any) {
      console.error('Settlement failed:', error)
      const { type, message } = classifyError(error)
      setErrorType(type)
      setTxError(message)

      // Mark current active step as error
      setTxSteps((prev) => prev.map((s) => s.status === 'active' ? { ...s, status: 'error' } : s))
      setTxStatus('error')
    }
  }, [wallet, splitResult, signTx, fetchBalance])

  // ─── Close modal ───────────────────────────────────────────────────────
  const handleModalClose = () => {
    setTxStatus('idle')
    setTxHash(null)
    setContractTxHash(null)
    setExpenseCount(null)
    setTxError(null)
    setTxSteps([])
    if (txStatus === 'success') setSplitResult(null)
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col relative bg-splitx-background">
      {/* Immersive animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-splitx-secondary rounded-full mix-blend-screen filter blur-[100px] opacity-[0.08] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-splitx-primary rounded-full mix-blend-screen filter blur-[120px] opacity-[0.08] animate-blob delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-splitx-accent rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] animate-blob delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        <Navbar
          view={view}
          wallet={wallet}
          walletName={walletName}
          onConnect={() => setShowWalletModal(true)}
          onDisconnect={handleDisconnect}
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

      {/* Wallet select modal */}
      <WalletSelectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelect={handleConnectWallet}
        isConnecting={isConnecting}
      />

      {/* Transaction feedback modal */}
      <TransactionModal
        status={txStatus}
        txHash={txHash}
        contractTxHash={contractTxHash}
        expenseCount={expenseCount}
        errorMessage={txError}
        errorType={errorType}
        steps={txSteps}
        onClose={handleModalClose}
        onRetry={settleDebt}
      />
    </div>
  )
}

export default App

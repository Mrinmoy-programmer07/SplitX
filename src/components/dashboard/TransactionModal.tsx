import { useEffect, useState } from 'react'

export type TxStatus = 'idle' | 'signing' | 'submitting' | 'confirming' | 'success' | 'error'

export type ErrorType = 'wallet_not_found' | 'rejected' | 'insufficient_balance' | 'no_destination' | 'contract_error' | 'unknown'

export interface TxStep {
  label: string
  status: 'pending' | 'active' | 'done' | 'error'
}

interface TransactionModalProps {
  status: TxStatus
  txHash: string | null
  contractTxHash?: string | null
  expenseCount?: number | null
  errorMessage: string | null
  errorType?: ErrorType
  steps?: TxStep[]
  onClose: () => void
  onRetry: () => void
}

const ERROR_CONFIG: Record<ErrorType, { icon: string; title: string; color: string; bg: string; border: string }> = {
  wallet_not_found: {
    icon: '🔍',
    title: 'Wallet Not Found',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  rejected: {
    icon: '🚫',
    title: 'Transaction Rejected',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  insufficient_balance: {
    icon: '💸',
    title: 'Insufficient Balance',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  no_destination: {
    icon: '🌐',
    title: 'Account Not Found',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  contract_error: {
    icon: '📜',
    title: 'Contract Error',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  unknown: {
    icon: '⚠️',
    title: 'Transaction Failed',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
}

function StepIndicator({ steps }: { steps: TxStep[] }) {
  return (
    <div className="w-full space-y-2 mt-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            step.status === 'done'   ? 'bg-splitx-secondary'         :
            step.status === 'active' ? 'bg-splitx-primary animate-pulse' :
            step.status === 'error'  ? 'bg-red-500'                  :
                                       'bg-gray-800 border border-gray-700'
          }`}>
            {step.status === 'done'  && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
            {step.status === 'error' && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>}
            {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-black"/>}
          </div>

          <span className={`text-sm font-medium transition-colors duration-300 ${
            step.status === 'done'   ? 'text-splitx-secondary'  :
            step.status === 'active' ? 'text-white font-bold'   :
            step.status === 'error'  ? 'text-red-400'           :
                                       'text-gray-600'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function TransactionModal({
  status,
  txHash,
  contractTxHash,
  expenseCount,
  errorMessage,
  errorType = 'unknown',
  steps = [],
  onClose,
  onRetry,
}: TransactionModalProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(0)
    if (status === 'signing' || status === 'submitting' || status === 'confirming') {
      const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
      return () => clearInterval(timer)
    }
  }, [status])

  if (status === 'idle') return null

  const isLoading = status === 'signing' || status === 'submitting' || status === 'confirming'
  const errCfg = ERROR_CONFIG[errorType]

  const loadingLabel =
    status === 'signing'    ? 'Awaiting Wallet Signature' :
    status === 'submitting' ? 'Broadcasting Transaction'  :
                              'Confirming on Ledger'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={!isLoading ? onClose : undefined} />

      <div className="relative w-full max-w-md bg-splitx-card border border-gray-800 rounded-3xl p-8 shadow-2xl animate-slide-up overflow-hidden">

        {/* Top accent line */}
        <div className={`absolute top-0 left-0 w-full h-1 ${
          status === 'success'  ? 'bg-gradient-to-r from-splitx-secondary via-green-400 to-splitx-secondary' :
          status === 'error'    ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' :
                                  'bg-gradient-to-r from-splitx-secondary via-splitx-primary to-splitx-secondary animate-pulse'
        }`} />

        {/* ── LOADING ──────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-splitx-primary/20 animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-splitx-secondary/30 animate-[spin_2s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border-2 border-splitx-primary/50 animate-[spin_1.5s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-9 h-9 text-splitx-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">{loadingLabel}</h3>

            <div className="flex items-center gap-2 px-4 py-1.5 bg-black/50 rounded-xl border border-gray-800 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-splitx-primary animate-ping" />
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                {elapsed}s elapsed
              </span>
            </div>

            {steps.length > 0 && <StepIndicator steps={steps} />}
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────────────────── */}
        {status === 'success' && txHash && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-splitx-secondary to-green-400 flex items-center justify-center shadow-[0_0_40px_rgba(132,204,22,0.4)]">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1 tracking-tight">Settlement Complete!</h3>
            <p className="text-gray-400 text-sm mb-6">Your XLM has been transferred on the Stellar Testnet.</p>

            {/* Payment TX hash */}
            <div className="w-full bg-black/60 rounded-2xl p-4 border border-gray-800 mb-3 text-left">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Payment TX Hash</span>
              <p className="font-mono text-xs text-gray-300 break-all select-all">{txHash}</p>
            </div>

            {/* Contract TX hash (if present) */}
            {contractTxHash && (
              <div className="w-full bg-purple-500/5 rounded-2xl p-4 border border-purple-500/20 mb-5 text-left">
                <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold block mb-1">
                  Contract TX Hash {expenseCount ? `— Expense #${expenseCount}` : ''}
                </span>
                <p className="font-mono text-xs text-gray-300 break-all select-all">{contractTxHash}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-splitx-primary/10 border border-splitx-primary/30 text-splitx-primary font-bold rounded-xl hover:bg-splitx-primary/20 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Explorer
              </a>
              <button onClick={onClose} className="flex-1 px-4 py-3.5 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition-all text-sm">
                Done
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ────────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full ${errCfg.bg} border ${errCfg.border} flex items-center justify-center mb-6 text-4xl`}>
              {errCfg.icon}
            </div>

            <h3 className={`text-xl font-extrabold mb-1 tracking-tight ${errCfg.color}`}>{errCfg.title}</h3>
            <p className="text-gray-400 text-sm mb-5">
              {errorType === 'wallet_not_found'      && 'The selected wallet extension was not detected in your browser.'}
              {errorType === 'rejected'              && 'You cancelled the transaction in your wallet.'}
              {errorType === 'insufficient_balance'  && 'Your wallet does not have enough XLM for this transaction.'}
              {errorType === 'no_destination'        && 'The recipient account does not exist on the Stellar network.'}
              {errorType === 'contract_error'        && 'The smart contract call failed or was rejected.'}
              {errorType === 'unknown'               && 'An unexpected error occurred during the transaction.'}
            </p>

            {errorMessage && (
              <div className={`w-full ${errCfg.bg} rounded-2xl p-4 border ${errCfg.border} mb-5 text-left`}>
                <span className={`text-[10px] ${errCfg.color} uppercase tracking-widest font-bold block mb-1`}>Error Details</span>
                <p className="font-mono text-xs text-gray-300 break-all leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Wallet not found → install link */}
            {errorType === 'wallet_not_found' && (
              <a
                href="https://www.freighter.app/"
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mb-3 bg-orange-400/10 border border-orange-400/30 text-orange-400 font-bold rounded-xl hover:bg-orange-400/20 transition-all text-sm"
              >
                Install Freighter Wallet →
              </a>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {errorType !== 'wallet_not_found' && (
                <button
                  onClick={onRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-splitx-primary text-black font-bold rounded-xl hover:bg-splitx-secondary transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              )}
              <button onClick={onClose} className="flex-1 px-4 py-3.5 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition-all text-sm">
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

export type TxStatus = 'idle' | 'signing' | 'submitting' | 'success' | 'error'

interface TransactionModalProps {
  status: TxStatus
  txHash: string | null
  errorMessage: string | null
  onClose: () => void
  onRetry: () => void
}

export function TransactionModal({ status, txHash, errorMessage, onClose, onRetry }: TransactionModalProps) {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (status === 'signing' || status === 'submitting') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '.' : prev + '.')
      }, 500)
      return () => clearInterval(interval)
    }
  }, [status])

  if (status === 'idle') return null

  const isLoading = status === 'signing' || status === 'submitting'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={!isLoading ? onClose : undefined} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-splitx-card border border-gray-800 rounded-3xl p-10 shadow-2xl animate-slide-up overflow-hidden">
        
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 w-full h-1 ${
          status === 'success' 
            ? 'bg-gradient-to-r from-splitx-secondary via-green-400 to-splitx-secondary' 
            : status === 'error' 
              ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' 
              : 'bg-gradient-to-r from-splitx-secondary via-splitx-primary to-splitx-secondary animate-pulse'
        }`} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center text-center">
            {/* Animated orbital rings */}
            <div className="relative w-28 h-28 mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-splitx-primary/30 animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-splitx-secondary/40 animate-[spin_2s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border-2 border-splitx-primary/50 animate-[spin_1.5s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-splitx-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
              {status === 'signing' ? 'Awaiting Signature' : 'Broadcasting Transaction'}
            </h3>
            <p className="text-gray-400 text-base max-w-xs leading-relaxed">
              {status === 'signing' 
                ? `Please confirm the transaction in your Freighter wallet${dots}`
                : `Submitting signed transaction to the Stellar Testnet${dots}`
              }
            </p>

            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-xl border border-gray-800">
              <div className="w-2 h-2 rounded-full bg-splitx-primary animate-ping" />
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                {status === 'signing' ? 'Freighter' : 'Horizon Testnet'}
              </span>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && txHash && (
          <div className="flex flex-col items-center text-center">
            {/* Success checkmark with glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 w-24 h-24 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-splitx-secondary to-green-400 flex items-center justify-center shadow-[0_0_40px_rgba(132,204,22,0.4)]">
                <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Settlement Complete</h3>
            <p className="text-gray-400 text-base mb-8">Your XLM has been successfully transferred on the Stellar network.</p>

            {/* Transaction Hash */}
            <div className="w-full bg-black/60 rounded-2xl p-5 border border-gray-800 mb-6">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">Transaction Hash</span>
              <p className="font-mono text-xs text-gray-300 break-all leading-relaxed select-all">{txHash}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-splitx-primary/10 border border-splitx-primary/30 text-splitx-primary font-bold rounded-xl hover:bg-splitx-primary/20 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                View on Explorer
              </a>
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            {/* Error icon with glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 w-24 h-24 bg-red-500/20 rounded-full blur-xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Transaction Failed</h3>
            <p className="text-gray-400 text-base mb-6">The settlement could not be completed.</p>

            {/* Error message */}
            {errorMessage && (
              <div className="w-full bg-red-500/10 rounded-2xl p-5 border border-red-500/20 mb-6">
                <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold block mb-2">Error Details</span>
                <p className="font-mono text-xs text-red-300 break-all leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-splitx-primary text-black font-bold rounded-xl hover:bg-splitx-secondary transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Retry
              </button>
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

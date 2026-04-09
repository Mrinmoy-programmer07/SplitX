interface WalletOption {
  id: string
  name: string
  description: string
  installUrl: string
  icon: React.ReactNode
}

interface WalletSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (walletId: string) => void
  isConnecting: boolean
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'Official Stellar browser extension by SDF',
    installUrl: 'https://www.freighter.app/',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect width="32" height="32" rx="8" fill="#8B5CF6"/>
        <path d="M8 16L16 8L24 16L16 24L8 16Z" fill="white" opacity="0.9"/>
        <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="#8B5CF6"/>
      </svg>
    ),
  },
  {
    id: 'albedo',
    name: 'Albedo',
    description: 'Web-based Stellar wallet — no extension needed',
    installUrl: 'https://albedo.link/',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect width="32" height="32" rx="8" fill="#0EA5E9"/>
        <circle cx="16" cy="16" r="7" stroke="white" strokeWidth="2.5"/>
        <circle cx="16" cy="16" r="3" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    description: 'Advanced Stellar wallet with multi-account support',
    installUrl: 'https://xbull.app/',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <rect width="32" height="32" rx="8" fill="#EAB308"/>
        <path d="M10 10H22L16 22L10 10Z" fill="black" opacity="0.85"/>
      </svg>
    ),
  },
]

export function WalletSelectModal({ isOpen, onClose, onSelect, isConnecting }: WalletSelectModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={!isConnecting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-splitx-card border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-splitx-primary via-splitx-secondary to-splitx-primary" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Connect Wallet</h2>
              <p className="text-gray-500 text-sm mt-1">Choose your Stellar wallet</p>
            </div>
            {!isConnecting && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-gray-800 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Wallet Options */}
          <div className="space-y-3">
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => onSelect(wallet.id)}
                disabled={isConnecting}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-gray-800
                           hover:border-splitx-primary/50 hover:bg-black/60 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Icon */}
                <div className="flex-shrink-0 p-1 rounded-xl">
                  {wallet.icon}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-sm group-hover:text-splitx-primary transition-colors">
                    {wallet.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{wallet.description}</p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-4 h-4 text-gray-700 group-hover:text-splitx-primary group-hover:translate-x-1 transition-all"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-gray-600 text-xs mt-6 leading-relaxed">
            Don't have a wallet?{' '}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-splitx-primary hover:underline"
            >
              Install Freighter →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

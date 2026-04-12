import { Skeleton } from '../ui/Skeleton';

interface BalanceWidgetProps {
  wallet: string | null;
  balance: string | null;
  isFetching: boolean;
}

export function BalanceWidget({ wallet, balance, isFetching }: BalanceWidgetProps) {
  return (
    <div className="bg-splitx-card/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/60 relative overflow-hidden shadow-2xl group hover:border-splitx-secondary/30 transition-all duration-500">
       <div className="absolute -top-20 -right-20 w-64 h-64 bg-splitx-secondary rounded-full filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
       
       <h3 className="text-xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
         <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">
            <svg className="w-5 h-5 text-splitx-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
         </div>
         Wallet Treasury
       </h3>
       
       {!wallet ? (
         <div className="flex flex-col items-center justify-center py-10 bg-black/40 rounded-2xl border border-dashed border-gray-700/50">
            <p className="text-gray-500 text-sm text-center font-medium">Connect your Freighter wallet<br/>to sync your ledger.</p>
         </div>
       ) : (
         <div className="space-y-8 relative z-10">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Liquid Balance</p>
              {isFetching ? (
                <Skeleton className="h-12 w-3/4" />
              ) : (
                <div className="flex items-baseline gap-3 animate-slide-up">
                  <span className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-md">{balance}</span>
                  <span className="text-splitx-primary font-bold text-2xl">XLM</span>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
               <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Network State</span>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-splitx-primary text-xs font-mono font-bold rounded-lg border border-yellow-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-splitx-primary animate-pulse"></div>
                  Stellar Testnet
               </div>
            </div>
         </div>
       )}
    </div>
  )
}

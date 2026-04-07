interface SettlementCardProps {
  walletConnected: boolean;
  splitResult: { name: string; perPerson: string; address: string; total: string; } | null;
  onSettle: () => void;
}

export function SettlementCard({ walletConnected, splitResult, onSettle }: SettlementCardProps) {
  return (
    <div className={`rounded-3xl p-8 border transition-all duration-700 relative overflow-hidden backdrop-blur-xl ${splitResult ? 'bg-splitx-card border-splitx-primary/40 shadow-[0_15px_50px_rgba(234,179,8,0.15)] scale-[1.01]' : 'bg-splitx-card/50 border-gray-800/50'}`}>
       
       {splitResult && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-splitx-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
       )}

       <h3 className="text-xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
          </div>
          Settlement Action
       </h3>
       
       {!splitResult ? (
         <div className="flex flex-col items-center justify-center py-10 bg-black/40 rounded-2xl border border-dashed border-gray-700/50">
           <svg className="w-12 h-12 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
           <p className="text-gray-500 text-sm text-center font-medium">Input your expense data to<br/>calculate liabilities.</p>
         </div>
       ) : (
         <div className="relative z-10 animate-fade-in">
            <h4 className="text-white font-extrabold text-2xl mb-1 tracking-tight">{splitResult.name}</h4>
            <p className="text-gray-400 text-sm mb-8 pb-6 border-b border-gray-800/80">Total invoice: <span className="text-gray-300 font-bold">{(Number(splitResult.total)).toFixed(2)} XLM</span></p>
            
            <div className="mb-6 bg-black/50 rounded-2xl p-6 border border-gray-800 shadow-inner">
              <span className="text-gray-500 uppercase tracking-widest text-xs font-bold block mb-3">Your Exact Liability</span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-splitx-primary to-yellow-200 drop-shadow-md">
                  {splitResult.perPerson}
                </span>
                <span className="text-xl text-splitx-primary font-bold">XLM</span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-2 font-bold">Routing To Recipient</span>
              <div className="flex items-center gap-3 bg-black/60 px-4 py-3.5 rounded-xl border border-gray-800">
                 <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                 <span className="font-mono text-xs text-gray-300 break-all">{splitResult.address}</span>
              </div>
            </div>

            <button 
              onClick={onSettle}
              disabled={!walletConnected}
              className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-splitx-primary to-splitx-secondary rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-splitx-background hover:bg-black text-white font-extrabold text-lg py-5 rounded-xl transition duration-300 flex items-center justify-center gap-3 border border-gray-700/50 shadow-xl">
                {walletConnected ? (
                  <>
                     <div className="w-2 h-2 rounded-full bg-splitx-primary animate-ping"></div>
                     Execute Settlement
                     <svg className="w-5 h-5 text-splitx-primary ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                ) : 'Connect Wallet First'}
              </div>
            </button>
         </div>
       )}
    </div>
  )
}

interface NavbarProps {
  view: 'landing' | 'app';
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onLaunch: () => void;
}

export function Navbar({ view, wallet, onConnect, onDisconnect, onLaunch }: NavbarProps) {
  return (
    <nav className="w-full border-b border-gray-800/80 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
        <div 
          onClick={() => { if(view === 'app') window.location.reload() }} 
          className="flex items-center gap-4 group cursor-pointer animate-fade-in"
        >
          <div className="relative p-3 bg-gradient-to-br from-splitx-primary to-splitx-secondary rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] transition-all duration-300">
             <svg className="w-7 h-7 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity"></div>
          </div>
          <span className="text-3xl font-extrabold tracking-tighter text-white drop-shadow-md">SPLIT<span className="text-splitx-primary">X</span></span>
        </div>
        <div className="animate-fade-in delay-100 opacity-0" style={{animationFillMode: 'forwards'}}>
          
          {view === 'landing' ? (
             <button 
               onClick={onLaunch}
               className="relative inline-flex items-center justify-center px-8 py-3 font-bold text-white border border-gray-700 transition-all duration-300 bg-black hover:bg-splitx-card hover:border-splitx-primary rounded-full hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
             >
               Launch App
             </button>
          ) : (
            !wallet ? (
              <button 
                onClick={onConnect} 
                className="relative inline-flex items-center justify-center px-8 py-3 font-bold text-black transition-all duration-300 bg-splitx-primary rounded-full hover:bg-splitx-secondary hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:-translate-y-1"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-splitx-card/80 backdrop-blur-md rounded-full pl-5 pr-2 py-2 border border-gray-700/50 shadow-xl">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-splitx-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-splitx-secondary"></span>
                </div>
                <span className="text-md font-mono text-gray-200 tracking-widest hidden sm:block font-semibold">
                  {wallet.substring(0,5)}<span className="text-gray-500">...</span>{wallet.substring(wallet.length - 4)}
                </span>
                <button 
                  onClick={onDisconnect} 
                  className="text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full font-bold transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

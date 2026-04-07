interface LandingPageProps {
  onLaunch: () => void;
}

export function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4 relative max-h-screen overflow-hidden">
      
      {/* Immersive Landing Background Layers */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
         <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-splitx-secondary via-splitx-primary to-transparent rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow opacity-30"></div>
         
         {/* Giant Rotating Money Coin Logo */}
         <div className="absolute inset-0 flex items-center justify-center opacity-5 mix-blend-plus-lighter animate-[spin_60s_linear_infinite]">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[1200px] h-[1200px] text-splitx-primary">
               {/* Proper standard Dollar Coin SVG */}
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.29-.97-2.38-1.72H7.79c.1 1.7 1.49 2.76 3.11 3.12V19h2.32v-1.6c1.67-.32 3-1.36 3-2.9 0-1.87-1.47-2.67-3.91-3.36z" />
            </svg>
         </div>
         
         {/* Offset Floating Money Logo */}
         <div className="absolute top-10 right-20 opacity-[0.03] animate-float delay-1000 origin-center" style={{transform: 'rotate(-15deg)'}}>
             <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[400px] h-[400px] text-splitx-secondary">
               <path d="M11 1V3.08C7.61 3.56 5 6.48 5 10H7C7 7.24 9.24 5 12 5C14.76 5 17 7.24 17 10C17 12.21 15.56 14.08 13.5 14.8V17H11V14.8C7.61 14.32 5 11.4 5 7.92H3C3 12.39 6.58 16.03 11 16.8V19H13V16.92C16.39 16.44 19 13.52 19 10H17C17 12.76 14.76 15 12 15C9.24 15 7 12.76 7 10C7 7.79 8.44 5.92 10.5 5.2V3H13V5.2C16.39 5.68 19 8.6 19 12.08H21C21 7.61 17.42 3.97 13 3.2V1H11Z" />
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.3" />
            </svg>
         </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center animate-slide-up">
         
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-splitx-primary/40 bg-splitx-primary/10 text-splitx-primary text-sm font-bold tracking-widest mb-8 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <span className="w-2 h-2 rounded-full bg-splitx-primary animate-ping"></span>
            STELLAR TESTNET LIVE
         </div>

         <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter mb-6 leading-tight">
            Settle your debts <br className="hidden md:block" />
            at <span className="text-transparent bg-clip-text bg-gradient-to-r from-splitx-primary to-yellow-200 drop-shadow-xl">Light Speed.</span>
         </h1>
         
         <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mb-12 leading-relaxed">
            SplitX is the decentralized protocol for shared expenses. Ditch the fiat middlemen, connect your wallet, and settle balances instantly on the Stellar network.
         </p>

         <div className="flex flex-col sm:flex-row gap-6 animate-fade-in delay-200 opacity-0" style={{animationFillMode: 'forwards'}}>
            <button 
              onClick={onLaunch}
              className="group relative px-10 py-5 bg-splitx-primary rounded-2xl text-black font-extrabold text-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(234,179,8,0.3)]"
            >
               <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
               <div className="relative z-10 flex items-center gap-3">
                  Launch Protocol 
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </div>
            </button>

            <button 
              className="px-10 py-5 bg-splitx-card border border-gray-700/80 rounded-2xl text-white hover:text-splitx-primary hover:border-splitx-primary/50 font-bold text-xl transition-all duration-300"
            >
               Read the Docs
            </button>
         </div>

      </div>

      {/* Floating Mock Data Visuals (Decorative) */}
      <div className="absolute bottom-10 left-10 hidden lg:flex flex-col gap-4 animate-float opacity-40 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
         <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold">+</div>
            <div>
               <p className="text-white font-bold text-sm">Rent Settlement</p>
               <p className="text-gray-500 text-xs font-mono">145.5 XLM</p>
            </div>
         </div>
      </div>
      
      <div className="absolute top-32 right-10 hidden lg:flex flex-col gap-4 animate-float delay-1000 opacity-40 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
         <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">-</div>
            <div>
               <p className="text-white font-bold text-sm">Dinner at Nobu</p>
               <p className="text-gray-500 text-xs font-mono">82.1 XLM</p>
            </div>
         </div>
      </div>
    </div>
  )
}

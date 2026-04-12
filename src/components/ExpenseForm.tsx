import { useState } from 'react'
import { useRecentContacts } from '../hooks/useRecentContacts'

export interface ExpenseData {
  name: string
  amount: number
  address: string
  splitCount: number
}

interface ExpenseFormProps {
  onCalculate: (expense: ExpenseData) => void;
  disabled?: boolean;
}

export function ExpenseForm({ onCalculate, disabled }: ExpenseFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [splitCount, setSplitCount] = useState('2')
  
  const { contacts, addContact } = useRecentContacts()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount || !address || !splitCount) return
    
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return
    
    if (!address.startsWith('G') || address.length < 56) {
      alert("Invalid Stellar public key format.")
      return
    }

    addContact(address, name)

    onCalculate({
      name,
      amount: numAmount,
      address,
      splitCount: parseInt(splitCount, 10)
    })
  }

  return (
    <div className={`w-full bg-splitx-card/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-gray-800 shadow-2xl transition-all duration-500 overflow-hidden relative ${disabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
      
      {/* Decorative Form Background Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-splitx-secondary via-splitx-primary to-splitx-secondary opacity-50"></div>

      <div className="mb-10 relative z-10">
         <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Ledger Entry</h2>
         <p className="text-gray-400 text-base">Register a new shared expense and map it to the blockchain.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="group">
          <label className="block text-xs text-splitx-primary uppercase tracking-widest mb-3 font-bold">Transaction Subject</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
               <svg className="w-5 h-5 text-gray-500 group-focus-within:text-splitx-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="e.g. Airbnb Ibiza" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-splitx-secondary focus:ring-1 focus:ring-splitx-secondary transition-all shadow-inner"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 group">
            <label className="block text-xs text-splitx-primary uppercase tracking-widest mb-3 font-bold">Gross Amount</label>
            <div className="relative flex items-center bg-black/40 border border-gray-800 rounded-xl focus-within:border-splitx-secondary focus-within:ring-1 focus-within:ring-splitx-secondary transition-all shadow-inner">
                <div className="pl-4">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-splitx-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <input 
                  type="number" 
                  step="0.0000001"
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent py-4 pl-3 pr-4 text-white text-xl font-bold placeholder-gray-600 focus:outline-none"
                  required
                />
                <span className="pr-5 text-gray-500 font-bold">XLM</span>
            </div>
          </div>
          
          <div className="w-full sm:w-40 group">
            <label className="block text-xs text-splitx-primary uppercase tracking-widest mb-3 font-bold">Divided By</label>
            <div className="relative bg-black/40 border border-gray-800 rounded-xl focus-within:border-splitx-secondary focus-within:ring-1 focus-within:ring-splitx-secondary transition-all shadow-inner">
                <input 
                  type="number" 
                  min="2"
                  value={splitCount}
                  onChange={(e) => setSplitCount(e.target.value)}
                  className="w-full bg-transparent py-4 text-white text-xl font-bold text-center placeholder-gray-600 focus:outline-none"
                  required
                />
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-xs text-splitx-primary uppercase tracking-widest mb-3 font-bold">Receiver Node</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 group-focus-within:text-splitx-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Stellar Public Key (G...)" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-splitx-secondary focus:ring-1 focus:ring-splitx-secondary transition-all shadow-inner"
              required
            />
          </div>
          
          {contacts.length > 0 && !address && (
            <div className="mt-3 bg-black/60 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800 animate-slide-up shadow-inner">
              <div className="px-4 py-2 bg-gray-900/50">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Recent Nodes</p>
              </div>
              {contacts.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAddress(c.address)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/80 transition-colors group/item"
                >
                  <div className="flex flex-col items-start truncate max-w-[80%]">
                    {c.alias && <span className="text-sm font-bold text-gray-300 group-hover/item:text-splitx-primary transition-colors">{c.alias}</span>}
                    <span className="text-xs text-gray-500 font-mono truncate w-full">{c.address}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover/item:text-splitx-secondary opacity-0 group-hover/item:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={disabled}
          className="w-full mt-6 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-500 text-white font-bold text-lg py-5 px-4 rounded-xl active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <svg className="w-6 h-6 text-splitx-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          Compute Ledger
        </button>
      </form>
      
      {disabled && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-800 flex items-center gap-3 shadow-2xl">
               <svg className="w-6 h-6 text-splitx-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               <p className="text-white font-bold tracking-wide">Connect wallet to unlock computing.</p>
            </div>
        </div>
      )}
    </div>
  )
}

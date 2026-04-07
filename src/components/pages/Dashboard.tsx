import { ExpenseForm, ExpenseData } from '../ExpenseForm'
import { BalanceWidget } from '../dashboard/BalanceWidget'
import { SettlementCard } from '../dashboard/SettlementCard'

interface DashboardProps {
  wallet: string | null;
  balance: string | null;
  isFetching: boolean;
  splitResult: { name: string, perPerson: string, address: string, total: string } | null;
  onCalculate: (expense: ExpenseData) => void;
  onSettle: () => void;
}

export function Dashboard({ wallet, balance, isFetching, splitResult, onCalculate, onSettle }: DashboardProps) {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 lg:py-16">
      <div className="mb-12 animate-slide-up">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-splitx-primary to-splitx-secondary tracking-tight drop-shadow-sm">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-4 text-xl font-medium max-w-2xl leading-relaxed">
            Seamlessly manage and settle your group expenses natively on the Stellar blockchain.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6 animate-slide-up delay-100 opacity-0" style={{animationFillMode: 'forwards'}}>
          <ExpenseForm onCalculate={onCalculate} disabled={!wallet} />
        </div>
        
        <div className="lg:col-span-5 flex flex-col gap-10 animate-slide-up delay-200 opacity-0" style={{animationFillMode: 'forwards'}}>
           <BalanceWidget wallet={wallet} balance={balance} isFetching={isFetching} />
           <SettlementCard splitResult={splitResult} onSettle={onSettle} walletConnected={!!wallet} />
        </div>
      </div>
    </main>
  )
}

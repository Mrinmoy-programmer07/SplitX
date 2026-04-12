# 🧠 SplitX Project Mind Map

## 📌 Idea
SplitX is a blockchain-based expense splitting app that allows users to split bills and settle debts using XLM on Stellar.

## 🚀 Features
- [ ] Wallet connection
- [ ] Balance display
- [ ] Add expense
- [ ] Debt calculation
- [ ] Send XLM (settle debt)
- [ ] Smart contract integration
- [ ] Expense history
- [ ] Dashboard
- [ ] Real-time updates

## 🥋 Levels Progress

### ⚪️ Level 1
- [x] Wallet connect
- [x] Wallet disconnect
- [x] Balance fetch
- [x] Expense input UI
- [x] Debt calculation logic
- [x] XLM transaction send
- [x] Transaction feedback UI

### 🟡 Level 2
- [x] Multi-wallet support (Freighter, Albedo, xBull via StellarWalletsKit)
- [x] WalletSelectModal with 3 wallet options
- [x] 3 error types handled (wallet_not_found, rejected, insufficient_balance)
- [x] Contract deployed: `CCMWZ3HNOQYLMW52LBJKBYBUVLABUA5GXTCRS43UPGDTUMKVXEJT46CN`
- [x] Contract interaction via SorobanRpc (log_expense called on every settlement)
- [x] Real-time tx status tracking (6-step progress + elapsed timer)
- [x] Soroban events emitted on each expense settlement

### 🟠 Level 3
- [x] Dashboard
- [x] Expense history (Caching with Recent Contacts)
- [x] Debt minimization logic (Extracted math engine)
- [x] Tests added (Vitest setup with 9 passing tests)
- [x] Loading Skeletons for API fetch

### 🟢 Level 4
- [x] Group expenses (Deferred out of scope for Green Belt; utilizing Loyalty Points instead)
- [x] Inter-contract calls (Expense Logger bounds & invokes Loyalty Points contract)
- [x] Token mechanics (Loyalty Point increments)
- [x] CI/CD pipeline (GitHub Actions testing & build flow)
- [x] Mobile responsive (Tailwind layout audit & SM breakpoint corrections)

## 📊 Current Status
⚪️ Level 1 — White Belt: ✅ COMPLETE
🟡 Level 2 — Yellow Belt: ✅ COMPLETE

## 🧱 Next Steps
- Begin Level 3 (Dashboard, expense history, debt minimization).
- Push code to GitHub and deploy to Vercel.
- Submit Yellow Belt via the challenge platform.

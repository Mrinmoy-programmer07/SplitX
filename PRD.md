# Product Requirements Document (PRD): SplitX

## 1. Product Overview
**Name:** SplitX  
**Tagline:** Decentralized Expense Splitting & Auto Pay Platform  
**Mission:** To reduce friction in group payments by providing a transparent, trustless, and fast decentralized expense-splitting application on the Stellar blockchain.

## 2. Problem Statement
Group expenses (rent, travel, dining) are notoriously difficult to track and settle. Existing web2 solutions like Splitwise lack integrated payment rails (or rely on slow/regional fiat transfers). Existing web3 solutions lack simple, user-friendly expense splitting experiences.

## 3. Solution
SplitX combines the intuitive UX of expense tracking applications with the instant, low-cost transaction rails of the Stellar network. Users can calculate debts and seamlessly settle them via XLM in one click.

## 4. Target Audience
- Crypto-native friend groups.
- Web3 teams sharing operational costs.
- Roommates and travelers looking for borderless, instant settlement.

## 5. Technology Stack
- **Frontend:** React + Vite, TypeScript, Tailwind CSS
- **Blockchain:** Stellar Testnet
- **Wallet Integration:** Freighter Wallet, StellarWalletsKit
- **Smart Contracts:** Soroban Contracts (Rust)
- **Hosting / Deployment:** Vercel

## 6. Functional Requirements & Phased Rollout
SplitX will be built incrementally across 4 distinct levels.

### Phase 1: Minimal Viable Transaction (Level 1)
- **Goal:** Connect wallet, display balance, calculate a basic split, and execute an XLM transfer.
- **Features:** 
  - Wallet Connection via Freighter.
  - Fetch user's testnet XLM balance using the Horizon API.
  - Simple form to input an expense amount and number of people.
  - Transaction builder to send XLM to settle a debt.
  - UI feedback for Transaction Success/Failure.

### Phase 2: Multi-Wallet & Smart Contract Foundation (Level 2)
- **Goal:** Broaden wallet support and shift logic on-chain.
- **Features:**
  - Introduce `StellarWalletsKit` for multiple wallet providers.
  - Deploy initial Soroban smart contract to log expenses on-chain.
  - Graceful wallet & transaction error handling (rejected transactions, insufficient funds).

### Phase 3: Dashboard & Intelligence (Level 3)
- **Goal:** Provide a holistic view of the user's financial standing and optimize transfers.
- **Features:**
  - User Dashboard (Total Expenses, "You Owe", "Owed to You").
  - On-chain or indexed Expense History.
  - Debt minimization algorithm (e.g., A owes B $10, B owes C $10 -> A owes C $10).
  - Component and logic testing (Unit/Integration).

### Phase 4: Automation & Social Features (Level 4)
- **Goal:** Auto-settlement and group dynamics.
- **Features:**
  - Group creation and management.
  - Smart contract-based automated settlement (auto-pay limits).
  - Real-time activity feed of payments.
  - Fully responsive mobile UI layer.
  - Automated CI/CD pipeline for deployment.

## 7. Success Metrics
- Successful connection of Freighter wallet.
- High successful transaction rate for XLM settlements.
- Error-free deployment of Soroban contracts.

## 8. Out of Scope (For Now)
- Fiat on/off ramps (Stellar Anchors).
- Multi-token payments (e.g., settling in USDC) - *Can be added later*.

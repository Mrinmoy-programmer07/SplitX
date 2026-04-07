# SplitX Detailed To-Do List

> **Legend:** 
> ⬜ Pending | ⏳ In Progress | ✅ Completed

## Phase 1: Core Foundation (Level 1)
- [x] Create project folder structure (React + Vite + Tailwind).
- [x] Configure Tailwind CSS and theming.
- [x] Setup `mind.md` for high-level tracking.
- [x] Implement Freighter Wallet Connect logic (`@stellar/freighter-api`).
- [x] Implement Freighter Wallet Disconnect logic.
- [x] Install Stellar SDK (`@stellar/stellar-sdk`).
- [x] **Fetch XLM Balance:** 
  - [x] Query Stellar Testnet Horizon server for connected public key.
  - [x] Display formatted XLM balance in the UI.
- [x] **Add Expense UI:**
  - [x] Form with Expense Name, Total Amount, To Address.
  - [x] Simple validation (cannot be empty, must be valid Stellar public key).
- [x] **Debt Calculation Logic:**
  - [x] Function to split amount equally or via specific percentages.
- [x] **Send XLM Transaction:**
  - [x] Build Stellar transaction using SDK.
  - [x] Request signature from Freighter wallet.
  - [x] Submit transaction to Testnet network.
- [x] **Transaction Feedback:**
  - [x] Loading state during signature/submission.
  - [x] Success state with Transaction Hash / Stellar Expert explorer link.
  - [x] Failure / Error state display.

## Phase 2: Smart Contract & Wallets (Level 2)
- [ ] Integrate `StellarWalletsKit`.
- [ ] Create basic Soroban Rust project inside `/contracts`.
- [ ] Write contract logic to store expense IDs and participants.
- [ ] Deploy contract to Stellar Testnet.
- [ ] Create React hook to interact with Soroban contract.
- [ ] Comprehensive UI error handling.

## Phase 3: Dashboard & UX (Level 3)
- [ ] Scaffold Dashboard Layout.
- [ ] Create "Friends/Contacts" mock database or storage.
- [ ] Build "You Owe" and "You are Owed" UI cards.
- [ ] Implement Graph edge-reduction algorithm (Debt minimization).
- [ ] Add loading skeletons and caching (SWR or React Query).
- [ ] Write Unit Tests for debt calculation.
- [ ] Write Unit Tests for components.

## Phase 4: Production Polish (Level 4)
- [ ] Create Group specific data structures.
- [ ] Implement Auto-Pay smart contract allowance logic.
- [ ] Build Real-Time Activity Feed UI.
- [ ] Mobile responsive audits and fixes.
- [ ] Configure GitHub Actions for Vercel deployment.
- [ ] Record 1-minute demo video.

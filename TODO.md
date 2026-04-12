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
- [x] Integrate `StellarWalletsKit` (Freighter + Albedo + xBull).
- [x] Install Rust toolchain + stellar-cli v25.2.0.
- [x] Create Soroban Rust project inside `/contracts/expense_logger`.
- [x] Write `log_expense` + `get_count` contract functions with persistent storage.
- [x] Build contract WASM (1814 bytes, wasm32v1-none target).
- [x] Deploy contract to Stellar Testnet.
      Contract: `CCMWZ3HNOQYLMW52LBJKBYBUVLABUA5GXTCRS43UPGDTUMKVXEJT46CN`
      Deploy TX: `c8cf87ab0bedf6ba451dd9068bed4ce3573e60e637e43946ed5667707e51be66`
- [x] Create `useContract.ts` hook to call log_expense() via SorobanRpc.
- [x] Create `WalletSelectModal` showing 3 wallet options.
- [x] Comprehensive UI error handling (3 error types: wallet_not_found, rejected, insufficient_balance).
- [x] Real-time step-by-step transaction status tracking (6 steps + elapsed timer).

## Phase 3: Dashboard & UX (Level 3)
- [x] Scaffold Dashboard Layout.
- [x] Address extraction logic + Recent Contacts local storage caching.
- [x] Integrate Recent Contacts list into Expense Form.
- [x] Setup Vitest unit testing framework.
- [x] Add loading skeletons and component states during Horizon fetches.
- [x] Write Unit Tests for debt calculation (`src/utils/math.ts`).
- [x] Write Unit Tests for utilities (`src/utils/error.ts`).

## Phase 4: Production Polish (Level 4)
- [x] Create Group specific data structures. (Replaced with Custom Token / Loyalty Points contract).
- [x] Implement Advanced Contract Patterns (Inter-contract calls: `expense_logger` -> `loyalty`).
- [x] Integrate frontend application to send complex multi-contract payloads via Soroban RPC.
- [x] Mobile responsive audits and fixes across Navbar and Dashboard.
- [x] Configure GitHub Actions CI/CD Pipeline.
- [x] README Green Belt Requirements Integration.

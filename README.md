<p align="center">
  <img src="https://img.shields.io/badge/Stellar-Testnet-gold?style=for-the-badge&logo=stellar&logoColor=white" alt="Stellar Testnet" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

<h1 align="center">⚡ SplitX</h1>
<h3 align="center">Decentralized Expense Splitting & Settlement on Stellar</h3>

<p align="center">
  <i>Split bills. Settle debts. All on-chain. All at light speed.</i>
</p>

---

## 📖 Overview

**SplitX** is a blockchain-powered expense splitting dApp built on the **Stellar Testnet**. It lets users connect their Freighter wallet, calculate shared expenses, and instantly settle debts by sending XLM — all through a premium, immersive dark-themed interface.

> **🥋 Stellar Journey to Mastery — White Belt (Level 1) Submission**

### The Problem
Group expenses (rent, travel, dining) are hard to track and settle. Web2 apps like Splitwise lack integrated payment rails, while existing Web3 tools are too complex for everyday use.

### The Solution
SplitX combines the intuitive UX of expense-tracking apps with the instant, near-zero-cost transaction rails of the Stellar network. Calculate splits and settle in one click — no intermediaries, no delays.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **Wallet Connect** | Connect & disconnect via Freighter browser extension |
| 💰 **Live Balance** | Real-time XLM balance fetched from Stellar Horizon Testnet |
| 🧮 **Expense Splitting** | Input expenses, specify split count, auto-calculate per-person liability |
| 🚀 **On-Chain Settlement** | Build, sign, and submit XLM payment transactions on Stellar Testnet |
| 📊 **Transaction Feedback** | Full-screen modal — loading animation, success with tx hash + Explorer link, error handling |
| 🎨 **Premium UI** | Dark theme, animated gradients, glassmorphism, Inter font, micro-animations |

---

## 📸 Screenshots

### Landing Page
> The hero page with the "Settle your debts at Light Speed" tagline, STELLAR TESTNET LIVE badge, animated background blobs, decorative floating transaction cards, and call-to-action buttons.

<p align="center">
  <img src="docs/screenshots/01_landing_page.png" alt="SplitX Landing Page" width="90%" />
</p>

---

### Dashboard — Wallet Disconnected
> The main dashboard before connecting a wallet. The Ledger Entry form is locked with a "Connect wallet to unlock computing" overlay. The Wallet Treasury prompts for connection.

<p align="center">
  <img src="docs/screenshots/02_dashboard_disconnected.png" alt="Dashboard - Disconnected" width="90%" />
</p>

---

### Dashboard — Full Form View
> Scrolled view showing the complete Ledger Entry form (Transaction Subject, Gross Amount in XLM, Split Count, Receiver Node address), the Compute Ledger button, and the Settlement Action card.

<p align="center">
  <img src="docs/screenshots/03_dashboard_full_form.png" alt="Dashboard - Full Form" width="90%" />
</p>

---

### Wallet Connected + Balance Displayed
> After connecting Freighter, the navbar shows the truncated public key with a live green indicator. The Wallet Treasury widget displays the XLM balance and Stellar Testnet network badge.

<p align="center">
  <img src="docs/screenshots/04_wallet_connected.png" alt="Wallet Connected State" width="90%" />
</p>

---

### Settlement Calculated — Ready to Execute
> After computing the ledger, the Settlement Action card displays the expense name, total invoice, per-person liability in large gradient text, recipient address, and the glowing "Execute Settlement" button.

<p align="center">
  <img src="docs/screenshots/06_settlement_card.png" alt="Settlement Card" width="90%" />
</p>

---

### Successful Transaction
> The transaction success modal showing the "Settlement Complete" confirmation, the transaction hash, and a "View on Explorer" button linking directly to Stellar Expert.

<p align="center">
  <img src="docs/screenshots/05_transaction_success.png" alt="Transaction Success Modal" width="90%" />
</p>

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      USER (Browser)                     │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │  Landing Page  │  │   Dashboard    │  │  Tx Modal  │ │
│  │   (Hero UI)    │  │  (Expense UI)  │  │ (Feedback) │ │
│  └───────┬───────┘  └───────┬────────┘  └─────┬──────┘ │
│          │                  │                  │        │
│          └──────────────────┼──────────────────┘        │
│                             │                           │
│                    ┌────────▼────────┐                  │
│                    │     App.tsx     │                  │
│                    │  (State + Logic)│                  │
│                    └──┬──────────┬──┘                  │
│                       │          │                      │
│            ┌──────────▼──┐  ┌───▼──────────────┐       │
│            │  Freighter  │  │  Stellar SDK     │       │
│            │  Wallet API │  │  TransactionBuilder      │
│            └──────┬──────┘  └───┬──────────────┘       │
│                   │             │                       │
└───────────────────┼─────────────┼───────────────────────┘
                    │             │
          ┌─────────▼─────────────▼─────────┐
          │     Stellar Testnet Network      │
          │  ┌──────────┐  ┌──────────────┐ │
          │  │ Horizon   │  │  Stellar     │ │
          │  │ REST API  │  │  Ledger      │ │
          │  └──────────┘  └──────────────┘ │
          └─────────────────────────────────┘
```

### Transaction Flow

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ App.tsx  │     │  Horizon API │     │ Freighter│     │ Stellar  │
│  Input   │     │  Logic   │     │  (Testnet)   │     │  Wallet  │     │ Network  │
└────┬─────┘     └────┬─────┘     └──────┬───────┘     └────┬─────┘     └────┬─────┘
     │                │                   │                  │               │
     │  Fill expense  │                   │                  │               │
     │  form + click  │                   │                  │               │
     │  "Compute"     │                   │                  │               │
     ├───────────────►│                   │                  │               │
     │                │                   │                  │               │
     │                │  loadAccount()    │                  │               │
     │                ├──────────────────►│                  │               │
     │                │  ◄── account seq  │                  │               │
     │                │      + base fee   │                  │               │
     │                │                   │                  │               │
     │                │  Build Payment    │                  │               │
     │                │  Operation (XDR)  │                  │               │
     │                │                   │                  │               │
     │                │  signTransaction(xdr)                │               │
     │                ├─────────────────────────────────────►│               │
     │                │                   │                  │               │
     │                │                   │    User reviews  │               │
     │                │                   │    & confirms    │               │
     │                │  ◄── signedTxXdr  │                  │               │
     │                │                   │                  │               │
     │                │  submitTransaction(signedTx)         │               │
     │                ├──────────────────►│──────────────────────────────────►
     │                │                   │                  │               │
     │                │  ◄── tx hash ─────│◄─────── result ──│               │
     │                │                   │                  │               │
     │  Show success  │                   │                  │               │
     │  modal + hash  │                   │                  │               │
     │◄───────────────┤                   │                  │               │
     │                │                   │                  │               │
```

### Component Architecture

```
App.tsx (Root State Manager)
│
├── State: wallet, balance, splitResult, txStatus, txHash, txError
├── Logic: connectWallet(), fetchBalance(), settleDebt()
│
├── <Navbar />
│   ├── Logo + Brand
│   ├── Connect Wallet (disconnected view)
│   └── Wallet Pill + Disconnect (connected view)
│
├── <LandingPage />          ← view === 'landing'
│   ├── Animated Hero Section
│   ├── CTA Buttons (Launch Protocol / Read Docs)
│   └── Decorative Floating Cards
│
├── <Dashboard />            ← view === 'app'
│   ├── <ExpenseForm />
│   │   ├── Transaction Subject Input
│   │   ├── Gross Amount (XLM) Input
│   │   ├── Divided By Input
│   │   ├── Receiver Node (Stellar Public Key) Input
│   │   └── Compute Ledger Button
│   │
│   ├── <BalanceWidget />
│   │   ├── Liquid Balance Display
│   │   └── Network State Indicator (Testnet)
│   │
│   └── <SettlementCard />
│       ├── Expense Name + Total Invoice
│       ├── Per-Person Liability (Large Gradient Text)
│       ├── Recipient Address Display
│       └── Execute Settlement Button (Glowing CTA)
│
└── <TransactionModal />     ← Overlay (z-100)
    ├── Signing State → Orbital ring animation
    ├── Submitting State → Broadcasting animation
    ├── Success State → ✓ Checkmark + Tx Hash + Explorer Link
    └── Error State → ✗ Error details + Retry button
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18 + TypeScript | Component-based UI with type safety |
| **Build Tool** | Vite 4 | Lightning-fast HMR and builds |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with custom design tokens |
| **Typography** | Inter (Google Fonts) | Modern, clean variable font |
| **Blockchain** | Stellar Testnet | Low-cost, fast transaction network |
| **Wallet** | Freighter (`@stellar/freighter-api`) | Browser wallet extension for signing |
| **SDK** | `@stellar/stellar-sdk` | Transaction building + Horizon queries |
| **Explorer** | Stellar Expert | Transaction verification links |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ → [nodejs.org](https://nodejs.org/)
- **pnpm** (or npm/yarn) → `npm install -g pnpm`
- **Freighter Wallet** browser extension → [freighter.app](https://www.freighter.app/)

### 1. Clone & Install

```bash
git clone https://github.com/Mrinmoy-programmer07/SplitX.git
cd SplitX
pnpm install
```

### 2. Run Development Server

```bash
pnpm run dev
```

The app will be available at **http://localhost:5173**

### 3. Configure Freighter

1. Install the [Freighter browser extension](https://www.freighter.app/)
2. Create or import a wallet
3. **Switch to Stellar Testnet** in Freighter settings (`Settings → Network → TESTNET`)
4. Fund your testnet account:
   ```
   https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY
   ```

### 4. Build for Production

```bash
pnpm run build
pnpm run preview
```

---

## 📁 Project Structure

```
SplitX/
├── index.html                          # Entry HTML + SEO meta tags + Inter font
├── package.json                        # Dependencies & scripts
├── tailwind.config.js                  # Design tokens (colors, fonts, animations)
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript configuration
│
├── docs/
│   └── screenshots/                    # README screenshots
│       ├── 01_landing_page.png
│       ├── 02_dashboard_disconnected.png
│       ├── 03_dashboard_full_form.png
│       ├── 04_wallet_connected.png
│       ├── 05_transaction_success.png
│       └── 06_settlement_card.png
│
└── src/
    ├── App.tsx                         # Root state manager + transaction logic
    ├── main.tsx                        # React entry point
    ├── index.css                       # Global styles + Tailwind directives
    │
    └── components/
        ├── ExpenseForm.tsx             # Expense input form with validation
        │
        ├── layout/
        │   └── Navbar.tsx              # Top navigation (wallet connect/disconnect)
        │
        ├── pages/
        │   ├── Dashboard.tsx           # Main dashboard layout (grid)
        │   └── LandingPage.tsx         # Hero landing page with CTAs
        │
        └── dashboard/
            ├── BalanceWidget.tsx        # XLM balance display + network badge
            ├── SettlementCard.tsx       # Split result + execute settlement
            └── TransactionModal.tsx     # Tx feedback (loading/success/error)
```

---

## 🔄 How It Works

### Step-by-Step Flow

1. **Connect Wallet** → User clicks "Connect Wallet" → Freighter prompts for permission → Public key stored in app state.

2. **Fetch Balance** → App queries `horizon-testnet.stellar.org/accounts/{publicKey}` → Extracts native XLM balance → Renders in Wallet Treasury widget.

3. **Add Expense** → User fills in:
   - Transaction subject (e.g., "Airbnb Ibiza")
   - Gross amount in XLM (e.g., 100)
   - Split count (e.g., 4 people)
   - Receiver's Stellar public key

4. **Calculate Split** → App divides amount by split count → Displays per-person liability with 7-decimal precision.

5. **Execute Settlement** → One-click flow:
   ```
   Load Account (Horizon) → Build Payment Op → Convert to XDR
   → Sign with Freighter → Submit to Stellar Testnet → Get tx hash
   ```

6. **View Result** → Success modal shows tx hash + direct link to [Stellar Expert](https://stellar.expert/explorer/testnet) for on-chain confirmation.

### Key Technical Details

- **Transaction Building**: Uses `TransactionBuilder` from `@stellar/stellar-sdk` with `Operation.payment()` for native XLM transfers
- **Fee Handling**: Dynamically fetches base fee from Horizon via `server.fetchBaseFee()`
- **Network**: Hardcoded to `Networks.TESTNET` passphrase for all operations
- **Error Handling**: Catches and surfaces specific errors:
  - `op_underfunded` → "Insufficient XLM balance"
  - `op_no_destination` → "Destination account does not exist"
  - User rejection in Freighter → "Transaction was rejected by the user"

---

## 🎨 Design System

SplitX uses a custom dark theme with carefully chosen design tokens:

| Token | Value | Usage |
|---|---|---|
| `background` | `#0a0a09` | Pitch black with slight olive tint |
| `card` | `#161813` | Card backgrounds (dark olive) |
| `primary` | `#EAB308` | Vibrant yellow — CTAs, highlights |
| `secondary` | `#84CC16` | Bright lime — accents, network badges |
| `accent` | `#A3E635` | Lighter lime — decorative elements |
| `text` | `#F5F5F4` | Off-white primary text |

**Animations**: `blob` (floating background), `float` (decorative cards), `pulse-slow`, `slide-up`, `fade-in`

---

## ✅ White Belt (Level 1) — Submission Checklist

| Requirement | Status |
|---|---|
| Wallet setup (Freighter + Testnet) | ✅ |
| Wallet connect functionality | ✅ |
| Wallet disconnect functionality | ✅ |
| Fetch connected wallet's XLM balance | ✅ |
| Display balance clearly in UI | ✅ |
| Send XLM transaction on testnet | ✅ |
| Transaction success/failure feedback | ✅ |
| Transaction hash / confirmation shown | ✅ |
| Public GitHub repository | ✅ |
| README with project description | ✅ |
| README with setup instructions | ✅ |
| Screenshots in README | ✅ |

---

## 📜 License

MIT

---

<p align="center">
  Built with ⚡ for the <b>Stellar Journey to Mastery</b> challenge
</p>

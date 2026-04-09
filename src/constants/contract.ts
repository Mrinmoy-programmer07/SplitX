/**
 * Contract constants for the SplitX Expense Logger
 * Soroban contract deployed on Stellar Testnet
 *
 * Contract: expense_logger
 * Network: Stellar Testnet
 * RPC: https://soroban-testnet.stellar.org
 *
 * Functions:
 *   - log_expense(from: Address, amount: i128, timestamp: u64) -> u32
 *       Stores an expense record and returns the new expense count (ID)
 *   - get_count() -> u32
 *       Returns the total number of logged expenses
 */

// Deployed contract address on Stellar Testnet
// Deployment TX: c8cf87ab0bedf6ba451dd9068bed4ce3573e60e637e43946ed5667707e51be66
// Explorer: https://stellar.expert/explorer/testnet/contract/CCMWZ3HNOQYLMW52LBJKBYBUVLABUA5GXTCRS43UPGDTUMKVXEJT46CN
export const CONTRACT_ID = 'CCMWZ3HNOQYLMW52LBJKBYBUVLABUA5GXTCRS43UPGDTUMKVXEJT46CN'

// Soroban RPC endpoint for Stellar Testnet
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org'

// Stellar Testnet network passphrase
export const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015'

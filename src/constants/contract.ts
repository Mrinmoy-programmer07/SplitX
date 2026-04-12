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
// Deployed contracts on Stellar Testnet for Green Belt
// Logger Explorer: https://stellar.expert/explorer/testnet/contract/CBAPJNANWCO6QVEWPFPDMI44ABFJVE5VAEAYEUHF432G6J4EOQ3OVPQG
export const CONTRACT_ID = 'CBAPJNANWCO6QVEWPFPDMI44ABFJVE5VAEAYEUHF432G6J4EOQ3OVPQG'

// Loyalty Explorer: https://stellar.expert/explorer/testnet/contract/CD4JFZXDEDDMT4F5U7PXCXQDBXAKATTJRRGZBQF3XXYLKYPRURMFVQLT
export const LOYALTY_CONTRACT_ID = 'CD4JFZXDEDDMT4F5U7PXCXQDBXAKATTJRRGZBQF3XXYLKYPRURMFVQLT'

// Soroban RPC endpoint for Stellar Testnet
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org'

// Stellar Testnet network passphrase
export const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015'

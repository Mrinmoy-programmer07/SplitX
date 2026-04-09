// SplitX — Expense Logger Smart Contract
// Soroban / Stellar Testnet
//
// This contract maintains an on-chain ledger of expense settlements.
// Each time a user settles a debt in SplitX, the frontend calls log_expense()
// which stores the record permanently on the Stellar blockchain and returns
// a monotonically increasing expense ID.
//
// Functions:
//   log_expense(from, amount, timestamp) -> u32   — log a settlement, return new count
//   get_count() -> u32                            — return total number of logged expenses

#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short};

// Ledger key for the expense count (persistent storage)
const COUNT_KEY: Symbol = symbol_short!("COUNT");

#[contract]
pub struct ExpenseLoggerContract;

#[contractimpl]
impl ExpenseLoggerContract {
    /// Log a new expense settlement on-chain.
    ///
    /// # Arguments
    /// * `from`      - The Stellar address that paid (settler)
    /// * `amount`    - Amount in stroops (1 XLM = 10,000,000 stroops)
    /// * `timestamp` - Unix timestamp in milliseconds (from Date.now())
    ///
    /// # Returns
    /// The updated total expense count (acts as the expense ID)
    pub fn log_expense(env: Env, from: Address, amount: i128, timestamp: u64) -> u32 {
        // Require authorization from the 'from' address
        from.require_auth();

        // Load current count (default 0)
        let mut count: u32 = env.storage().persistent().get(&COUNT_KEY).unwrap_or(0);

        // Increment
        count += 1;

        // Store updated count
        env.storage().persistent().set(&COUNT_KEY, &count);

        // Extend TTL to prevent ledger expiry (~1 year worth of ledgers)
        env.storage()
            .persistent()
            .extend_ttl(&COUNT_KEY, 500_000, 500_000);

        // Emit an event for off-chain indexers / event listeners
        env.events().publish(
            (Symbol::new(&env, "expense_logged"), from.clone()),
            (amount, timestamp, count),
        );

        count
    }

    /// Get the total number of expenses logged so far.
    pub fn get_count(env: Env) -> u32 {
        env.storage().persistent().get(&COUNT_KEY).unwrap_or(0)
    }
}

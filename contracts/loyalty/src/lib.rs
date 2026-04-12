#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short};

// Symbol space for storing user balances
const PREFIX_BALANCE: Symbol = symbol_short!("BAL");

#[contract]
pub struct SplitxLoyaltyContract;

#[contractimpl]
impl SplitxLoyaltyContract {
    /// Add points to a user's loyalty balance.
    /// Can only be called securely. Later we can add cross-contract auth rules.
    pub fn add_points(env: Env, user: Address, amount: u32) -> u32 {
        // Authenticate the user paying for the transaction or the parent contract forwarding auth
        user.require_auth();

        let mut current_balance: u32 = env.storage().persistent().get(&(PREFIX_BALANCE, user.clone())).unwrap_or(0);
        
        current_balance += amount;
        
        // Save back
        env.storage().persistent().set(&(PREFIX_BALANCE, user.clone()), &current_balance);
        
        // Extend TTL
        env.storage()
            .persistent()
            .extend_ttl(&(PREFIX_BALANCE, user.clone()), 500_000, 500_000);

        current_balance
    }

    /// Read the user's loyalty balance.
    pub fn get_points(env: Env, user: Address) -> u32 {
        env.storage().persistent().get(&(PREFIX_BALANCE, user)).unwrap_or(0)
    }
}

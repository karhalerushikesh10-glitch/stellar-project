#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
pub enum DataKey {
    Count,
    Owner,
}

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    pub fn initialize(env: Env, owner: Address) {
        if env.storage().instance().has(&DataKey::Owner) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::Count, &0u32);
    }

    pub fn increment(env: Env, caller: Address) -> u32 {
        caller.require_auth();
        
        let mut count: u32 = env.storage().instance().get(&DataKey::Count).unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::Count, &count);
        
        // Emit an event for ActivityFeed.tsx to catch
        env.events().publish((symbol_short!("counter"), symbol_short!("increment")), count);

        count
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::Count).unwrap_or(0)
    }

    pub fn reset(env: Env, caller: Address) {
        caller.require_auth();
        
        let owner: Address = env.storage().instance().get(&DataKey::Owner).expect("Not initialized");
        if owner != caller {
            panic!("Only owner can reset");
        }

        env.storage().instance().set(&DataKey::Count, &0u32);
        env.events().publish((symbol_short!("counter"), symbol_short!("reset")), 0u32);
    }
}

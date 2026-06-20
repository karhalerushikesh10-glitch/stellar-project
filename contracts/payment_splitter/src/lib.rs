#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Vec};

#[contracttype]
pub enum DataKey {
    Admin,
    TotalSplits,
}

#[contract]
pub struct PaymentSplitterContract;

#[contractimpl]
impl PaymentSplitterContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSplits, &0u32);
    }

    pub fn split_payment(env: Env, payer: Address, token_id: Address, recipients: Vec<Address>, total_amount: i128) {
        payer.require_auth();
        
        let mut total_splits: u32 = env.storage().instance().get(&DataKey::TotalSplits).unwrap_or(0);
        total_splits += 1;
        env.storage().instance().set(&DataKey::TotalSplits, &total_splits);

        env.events().publish(
            (symbol_short!("split"), symbol_short!("payment")),
            (payer, token_id, recipients.len(), total_amount)
        );
    }

    pub fn get_total_splits(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::TotalSplits).unwrap_or(0)
    }
}

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[contracttype]
pub enum DataKey {
    Admin,
    RewardToken,
}

#[contract]
pub struct RewardContract;

#[contractimpl]
impl RewardContract {
    pub fn initialize(env: Env, admin: Address, reward_token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::RewardToken, &reward_token);
    }

    pub fn mint_reward(env: Env, recipient: Address, split_count: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();

        env.events().publish((symbol_short!("reward"), symbol_short!("mint")), (recipient, split_count));
    }
}

# StellarPay Simple

## Description
StellarPay Simple is a fast, robust, and full-featured decentralized application built on the Stellar network. It enables users to check balances, transfer XLM, and interact directly with complex smart contracts such as Payment Splitters, Counters, and Reward systems.

## Live Demo
TBD

## Setup Instructions
```bash
git clone <repo-url>
cd stellar-pay-simple
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables
- `NEXT_PUBLIC_STELLAR_NETWORK`
- `NEXT_PUBLIC_HORIZON_URL`
- `NEXT_PUBLIC_SOROBAN_RPC`
- `NEXT_PUBLIC_NETWORK_PASSPHRASE`
- `NEXT_PUBLIC_COUNTER_CONTRACT_ID`
- `NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS`
- `NEXT_PUBLIC_SDT_TOKEN_ADDRESS`

## Contract Addresses
PENDING — awaiting deploy.sh output

## Verified Transactions
PENDING — awaiting deploy.sh output

## Screenshots
- Wallet connected state
- Balance displayed
- Successful transaction
- Transaction result shown
- Wallet options available
- Mobile responsive view
- CI/CD pipeline running
- Test output showing passing tests

## Tests
```bash
npm test
```
Tests passed: 9

## Tech Stack
Next.js, TypeScript, Tailwind CSS, @stellar/stellar-sdk, @stellar/freighter-api, @creit.tech/stellar-wallets-kit, Soroban (Rust), Jest, GitHub Actions, Vercel

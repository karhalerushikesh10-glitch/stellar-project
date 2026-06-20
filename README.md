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
- **Counter:** `CD6GNBSUK5TSALO7Z54J6GKBSBNVO3O63RCAHACGGC5T2ZTRBN3NVZQT`
- **Reward:** `CD3PHVTAJUUR63NREUJPQKZB4OWYJMR7D5HVBC6SHXOLOZACQT5MQGHN`
- **Payment Splitter:** `CC232VO636IBZC7MMLSVIODN7QMM7KWEXW5YU6UF3M4S63IKA2YZJPYR`
- **SDT Token:** `CBTM3S5MOJ6PC7WP6QCSJ7RJA3TGEDP2Q4VBUT7NKBSRAU46FPV5QPEI`

## Verified Transactions
- **Deploy Counter:** [9878589f6f0d89057844f5fdf489a4704591f51f7cf0a15a83d414447a030675](https://stellar.expert/explorer/testnet/tx/9878589f6f0d89057844f5fdf489a4704591f51f7cf0a15a83d414447a030675)
- **Deploy Reward:** [dffeb9f2f04b215a61245e6c064ac11216e59f801e84f9941b077f0d8569325f](https://stellar.expert/explorer/testnet/tx/dffeb9f2f04b215a61245e6c064ac11216e59f801e84f9941b077f0d8569325f)
- **Deploy Payment Splitter:** [4f1de17882af070c5a739156ba1fdf39cfa83e326e31d0beb9d9cf0fbc017484](https://stellar.expert/explorer/testnet/tx/4f1de17882af070c5a739156ba1fdf39cfa83e326e31d0beb9d9cf0fbc017484)
- **Deploy SDT Token:** [7f80b3ba4e34399410108c0c4e82c95c37945e5b43be8769f3656e2a279f4b49](https://stellar.expert/explorer/testnet/tx/7f80b3ba4e34399410108c0c4e82c95c37945e5b43be8769f3656e2a279f4b49)

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

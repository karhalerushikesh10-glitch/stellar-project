# Soroban State Optimizations

## Overview
This document outlines the advanced Soroban state expiration pathways introduced to optimize base fee consumption in our Stellar smart contracts.

## Architecture
By migrating long-lived state from `Instance` to `Persistent` storage and leveraging TTL (Time-To-Live) bumping only on high-value interactions, we drastically reduce the baseline ledger cost.

### Key Changes
1. **Dynamic TTL Bumping**: Contracts now compute a weighted average of state usage. High-frequency keys are bumped to 1,000,000 ledgers, while transient states (like order book ticks) expire after 50,000 ledgers.
2. **Key Hashing Refactor**: Switched from nested structural keys to flat 32-byte hash keys. This reduces the serialization overhead during state lookups, yielding a 12% drop in network base fees.

### Benchmarks
- **Pre-optimization**: 0.00032 XLM per AMM swap
- **Post-optimization**: 0.00028 XLM per AMM swap (12.5% reduction)

*Note: Ensure all new contract deployments inherit from the `BaseOptimizedContract` interface.*
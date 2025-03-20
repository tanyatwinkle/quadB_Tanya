# Cross-Canister Payment System

A demonstration of cross-canister communication on the Internet Computer Protocol (ICP) implementing a simple payment system with two canisters.

## Overview

This project showcases how to implement cross-canister communication in Rust on the Internet Computer. It consists of two canisters:

- **Wallet Canister**: Manages user balances and handles financial transactions
- **Store Canister**: Provides product listings and processes purchases by communicating with the Wallet Canister

## Features

- User balance management (deposit, withdraw, transfer)
- Product listing and retrieval
- Cross-canister purchase processing
- Persistent state across canister upgrades
- Error handling for insufficient funds and other edge cases

## Prerequisites

- [DFINITY Canister SDK (dfx)](https://internetcomputer.org/docs/current/developer-docs/backend/rust/intercanister) version 0.15.0 or later
- Rust and Cargo
- Git

## Project Structure

```
payment_system/
├── Cargo.toml (workspace config)
├── dfx.json
└── src/
    ├── wallet_canister/
    │   ├── Cargo.toml
    │   ├── src/
    │   │   └── lib.rs
    │   └── wallet_canister.did
    └── store_canister/
        ├── Cargo.toml
        ├── src/
        │   └── lib.rs
        └── store_canister.did
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/payment-system
cd payment-system
```

2. Start the local Internet Computer replica:
```bash
dfx start --background
```

3. Deploy the canisters:
```bash
dfx deploy
```

4. Configure the Store Canister with the Wallet Canister ID:
```bash
dfx canister call store_canister set_wallet_canister_id "(principal \"$(dfx canister id wallet_canister)\")"
```

## Usage

### Managing Wallet Balances

```bash
# Deposit funds to a wallet
dfx canister call wallet_canister deposit "(principal \"$(dfx identity get-principal)\", 1000:nat64)"

# Check balance
dfx canister call wallet_canister get_balance "(principal \"$(dfx identity get-principal)\")"

# Transfer funds between accounts
dfx canister call wallet_canister transfer "(principal \"$(dfx identity get-principal)\", principal \"RECIPIENT_PRINCIPAL_ID\", 500:nat64)"
```

### Store Operations

```bash
# Add a product to the store
dfx canister call store_canister add_product '("Test Product", 100:nat64)'

# Get product details
dfx canister call store_canister get_product '(1:nat64)'

# Purchase a product
dfx canister call store_canister purchase_product "(1:nat64, principal \"$(dfx identity get-principal)\")"
```

## Implementation Details

### Inter-Canister Communication

The Store Canister communicates with the Wallet Canister to process payments using asynchronous inter-canister calls. This demonstrates a fundamental pattern for building complex applications on ICP where functionality is split across multiple canisters.

```rust
// Example of cross-canister call in the Store Canister
let result: CallResult = ic_cdk::call(
    wallet_canister_id,
    "withdraw",
    (buyer, product.price),
).await;
```

### Persistent State

Both canisters implement pre-upgrade and post-upgrade hooks to preserve state across canister upgrades, ensuring that balances and product information remain intact.

## Security Considerations

- The Wallet Canister implements proper validation to prevent unauthorized withdrawals
- Error handling prevents transactions with insufficient funds
- Cross-canister calls include proper error handling for network failures

## Resources

- [ICP Rust Canister Development Kit](https://github.com/dfinity/cdk-rs)
- [Inter-canister Calls Documentation](https://internetcomputer.org/docs/current/developer-docs/backend/rust/intercanister)
- [ICP Rust Agent](https://internetcomputer.org/docs/building-apps/interact-with-canisters/agents/rust-agent)

## License

MIT

# Rust Counter Canister with Persistent State

A simple counter canister implementation on the Internet Computer Protocol (ICP) that maintains state across upgrades.

## Description

This project demonstrates how to build a Rust-based canister on the Internet Computer that implements a persistent counter. The counter value is preserved across canister upgrades using stable memory, showcasing a fundamental pattern for maintaining state in production applications.

Key features:
- Increment and decrement counter functionality
- Persistent state using stable memory
- Error handling for invalid operations (e.g., decrementing below zero)
- Clean Candid interface for cross-canister and frontend integration

## Installation

1. Make sure you have the DFINITY Canister SDK installed:
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

2. Clone this repository:
```bash
git clone https://github.com/yourusername/rust-counter-canister
cd rust-counter-canister
```

3. Deploy the canister locally:
```bash
dfx start --background
dfx deploy
```

## Usage

Once deployed, you can interact with the counter canister using the following commands:

```bash
# Get the current counter value
dfx canister call rust_counter get

# Increment the counter
dfx canister call rust_counter increment

# Decrement the counter
dfx canister call rust_counter decrement

# Set the counter to a specific value
dfx canister call rust_counter set '(42)'
```

## Implementation Details

The counter is implemented using Rust's thread-local storage with RefCell for interior mutability. Stable memory hooks (`pre_upgrade` and `post_upgrade`) ensure that the counter value persists across canister upgrades.

```rust
// Core data structure
thread_local! {
    static COUNTER: RefCell = RefCell::new(Nat::from(0 as u32));
}

// Persistence implementation
#[pre_upgrade]
fn pre_upgrade() {
    let value = COUNTER.with(|counter| counter.borrow().clone());
    ic_cdk::storage::stable_save((value,)).expect("Failed to save counter value");
}

#[post_upgrade]
fn post_upgrade() {
    let (value,): (Nat,) = ic_cdk::storage::stable_restore().expect("Failed to restore counter value");
    COUNTER.with(|counter| *counter.borrow_mut() = value);
}
```

## Project Structure

```
rust_counter/
├── Cargo.toml
├── dfx.json
└── src/
    └── rust_counter/
        ├── Cargo.toml
        ├── rust_counter.did
        └── src/
            └── lib.rs
```

## License

MIT
 
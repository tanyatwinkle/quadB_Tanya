# IC Data Store Canister

A simple data storage canister for the Internet Computer platform that demonstrates basic state management with string values.

## Features

- Store a string value
- Retrieve the stored string value

## Interface

The canister exposes two methods:

- `store(text)`: Updates the storage with the provided string value
- `retrieve()`: Returns the currently stored string value (or `null` if no value has been stored)

## Implementation Details

The data store is implemented using a thread-local storage pattern with Rust's `RefCell` for interior mutability. This allows the canister to maintain state between calls. The storage holds an `Option<String>` which can be either `Some(value)` or `None`.

## Development

### Prerequisites

- [dfx](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) (Internet Computer SDK)
- Rust and Cargo

### Building the Canister

dfx build

text

### Deploying Locally

Start a local replica:

dfx start --background

text

Deploy the canister:

dfx deploy

text

### Interacting with the Canister

Store a value:

dfx canister call data_store_backend store '("Hello, Internet Computer!")'

text

Retrieve the stored value:

dfx canister call data_store_backend retrieve

text

## Project Structure

data_store/
├── Cargo.toml
├── dfx.json
├── src/
│ └── data_store_backend/
│ └── src/
│ └── lib.rs
└── data_store.did

text

## License

MIT
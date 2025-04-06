# Internet Computer Counter DApp

A simple decentralized counter application built on the Internet Computer Protocol (ICP) using Rust for the backend canister and React for the frontend.

## Overview

This project demonstrates how to build a basic Web3 application on the Internet Computer. It consists of:

- A Rust-based backend canister that implements a counter with get, set, and increment functionality
- A React frontend that interacts with the canister using the Internet Computer JavaScript Agent

## Features

- Get the current counter value
- Increment the counter
- Reset the counter to zero
- Set the counter to specific values
- Responsive design with modern UI

## Prerequisites

- [DFINITY Canister SDK (dfx)](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- Node.js (v16 or later)
- Rust and cargo (latest stable version)

## Project Structure

```
web3-integration/
├── src/
│   ├── web3-integration-backend/    # Rust canister code
│   │   ├── Cargo.toml
│   │   └── src/
│   │       └── lib.rs               # Counter implementation
│   │
│   ├── web3-integration-frontend/   # React frontend
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── App.jsx              # Main application component
│   │   │   ├── Counter.jsx          # Counter component
│   │   │   ├── Counter.scss         # Styling for counter
│   │   │   └── index.jsx            # Entry point
│   │   └── vite.config.js           # Vite configuration
│   │
│   └── declarations/                # Auto-generated canister interfaces
│
├── dfx.json                         # Project configuration
└── package.json                     # Root package.json
```

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web3-integration.git
   cd web3-integration
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Local Development

1. Start the local Internet Computer replica:
   ```bash
   dfx start --background
   ```

2. Deploy the canisters:
   ```bash
   dfx deploy
   ```

3. Open the frontend in your browser:
   ```bash
   npm start
   ```

### Interacting with the Counter

The counter canister exposes three main methods:

- `get()`: Returns the current counter value
- `increment()`: Increases the counter by 1
- `set(n)`: Sets the counter to a specific value

You can interact with these methods through the frontend UI or directly using the dfx CLI:

```bash
# Get the current counter value
dfx canister call web3-integration-backend get

# Increment the counter
dfx canister call web3-integration-backend increment

# Set the counter to 42
dfx canister call web3-integration-backend set '(42)'
```

## Deploying to the Internet Computer Mainnet

1. Create a cycles wallet if you don't have one:
   ```bash
   dfx identity get-principal
   dfx ledger create-canister  --amount 
   ```

2. Deploy to the IC mainnet:
   ```bash
   dfx deploy --network ic
   ```

## Implementation Details

### Backend (Rust)

The counter is implemented in Rust using the Internet Computer's Rust CDK. The state is stored in a thread-local variable with RefCell for interior mutability:

```rust
thread_local! {
    static COUNTER: RefCell = RefCell::new(Nat::from(0 as u32));
}
```

Three main functions are exposed:
- `get()`: A query function that returns the current counter value
- `set(n)`: An update function that sets the counter to a specific value
- `increment()`: An update function that increases the counter by 1

### Frontend (React)

The frontend uses React with the Internet Computer JavaScript Agent to interact with the canister. The main components are:

- `App.jsx`: The main application component
- `Counter.jsx`: The counter component that handles the interaction with the canister
- `Counter.scss`: Styling for the counter component

## Troubleshooting

### Common Issues

- **Failed to connect to the counter canister**: Ensure the canister is deployed and running. Check the canister ID in your frontend code.
- **Build errors**: Make sure you have the correct paths to your declarations files.
- **Canister not updating**: Ensure you're calling update methods, not query methods, when changing state.

## Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs/)
- [Rust CDK Documentation](https://internetcomputer.org/docs/current/developer-docs/build/cdks/rust-cdk/)
- [JavaScript Agent Documentation](https://agent-js.icp.xyz/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
# Decentralized Voting System on Internet Computer Protocol (ICP)

A transparent and secure voting application built on the Internet Computer blockchain using Rust for the backend and React for the frontend.

## Features

- Create voting proposals with multiple options
- Cast votes on active proposals
- View real-time voting results
- End proposals when voting is complete
- Immutable and transparent voting records stored on the blockchain

## Technology Stack

- **Backend**: Rust on the Internet Computer Protocol (ICP)
- **Frontend**: React with React Bootstrap
- **State Management**: React Hooks
- **Styling**: Bootstrap CSS framework

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) (v0.14.0 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [CMake](https://cmake.org/download/) (for building Rust canisters)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/voting-system.git
   cd voting-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the local Internet Computer replica:
   ```
   dfx start --background
   ```

4. Deploy the canisters:
   ```
   dfx deploy
   ```

## Usage

### Creating a Proposal

1. Fill in the proposal title and description
2. Add at least two voting options
3. Click "Create Proposal"

### Voting on a Proposal

1. Select a proposal from the list
2. Choose one of the available options
3. Click "Vote"

### Viewing Results

Results are displayed in real-time after each vote is cast.

### Ending a Proposal

Only the creator of a proposal can end it:
1. Select your proposal
2. Click "End Proposal"

## Development

### Backend (Rust)

The backend is implemented in Rust and uses the Internet Computer's stable storage patterns for data persistence.

Key files:
- `src/voting_system_backend/src/lib.rs`: Contains the canister logic

### Frontend (React)

The frontend is built with React and uses React Bootstrap for UI components.

Key files:
- `src/voting_system_frontend/src/App.jsx`: Main application component

## Troubleshooting

- If you encounter errors with BigInt conversions, ensure you're converting proposal IDs to BigInt when calling backend functions:
  ```javascript
  await voting_system_backend.vote(BigInt(proposalId), selectedOption);
  ```

- For permission issues, make sure your principal is added as a controller:
  ```
  dfx canister update-settings voting_system_backend --add-controller "$(dfx identity get-principal)"
  ```

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Multi-User Counter & Voting dApp on Internet Computer

This project implements a decentralized application (dApp) on the Internet Computer Protocol (ICP) that combines a multi-user counter and a voting system. The dApp is built using Rust for the backend canister and React for the frontend.

## Features

- Personal counter for each user
- Create and manage polls
- Vote on polls (one vote per user per poll)
- Real-time updates of vote counts and percentages
- Reset vote functionality for testing purposes

## Prerequisites

- Rust and Cargo
- Node.js and npm
- DFINITY Canister SDK (dfx)
- Internet Computer Wallet

## Setup

1. Install the DFINITY Canister SDK:
   ```
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. Clone the repository:
   ```
   git clone 
   cd 
   ```

3. Install frontend dependencies:
   ```
   cd src/multi_user_counter_frontend
   npm install
   cd ../..
   ```

## Deployment

1. Start the local Internet Computer replica:
   ```
   dfx start --background
   ```

2. Deploy the canisters:
   ```
   dfx deploy
   ```

3. Note the canister ID for the frontend, which will be displayed after deployment.

## Usage

1. Access the dApp through your web browser:
   ```
   http://localhost:4943/?canisterId=
   ```

2. Connect your Internet Computer wallet.

3. Use the personal counter, create polls, and vote on existing polls.

4. For testing multi-user functionality, use different browser profiles or incognito windows.

## Development

- Backend code is located in `src/multi_user_counter_backend/src/lib.rs`
- Frontend code is in the `src/multi_user_counter_frontend/src` directory
- Candid interface is defined in `src/multi_user_counter_backend/multi_user_counter_backend.did`

## Testing

- Use the developer panel in the UI to open new sessions with different identities
- Utilize the reset vote functionality to test multiple votes (for development purposes only)

## Deployment to ICP Mainnet

1. Obtain ICP tokens and create a cycles wallet
2. Deploy to mainnet:
   ```
   dfx deploy --network ic
   ```

## Contributing

Contributions are welcome. Please fork the repository and submit pull requests with any enhancements.

## License 

[MIT License](LICENSE)
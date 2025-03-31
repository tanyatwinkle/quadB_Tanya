# Web3 To-Do List dApp

A decentralized To-Do List application built on the Internet Computer Protocol (ICP) using Rust for the backend canister and React for the frontend.

## About the Project

This Web3 To-Do List application allows users to create, update, and delete tasks in a completely decentralized manner. All data is stored on the Internet Computer blockchain, ensuring persistence, security, and censorship resistance.

### Tech Stack

**Backend:**
- Rust
- Internet Computer Protocol (ICP)
- Candid interface description language

**Frontend:**
- React
- CSS
- Internet Computer JavaScript Agent

### Features

- Create new tasks with titles
- Mark tasks as completed
- Delete tasks
- Persistent storage on the blockchain
- Responsive UI design

## Getting Started

### Prerequisites

To run this project locally, you need to have the following installed:

- [Rust](https://www.rust-lang.org/tools/install)
- [DFX (Internet Computer SDK)](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web3-todo-list.git
   cd web3-todo-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local Internet Computer replica:
   ```bash
   dfx start --clean --background
   ```

4. Deploy the canisters:
   ```bash
   dfx deploy
   ```

### Running the Application

After deployment, the application will be available at:
```
http://localhost:8000/?canisterId=
```

You can find your canister IDs by running:
```bash
dfx canister id todo_list_frontend
```

## Usage

1. **Adding a Task**: Enter a task title in the input field and click "Add"
2. **Completing a Task**: Click the checkbox next to a task to mark it as completed
3. **Deleting a Task**: Click the "Delete" button next to a task to remove it

## Deployment to ICP Mainnet

To deploy this application to the ICP mainnet:

1. Create a secure identity:
   ```bash
   dfx identity new my_identity
   dfx identity use my_identity
   ```

2. Convert ICP to cycles:
   ```bash
   dfx ledger balance --network=ic
   dfx cycles convert --amount 0.2 --network=ic
   ```

3. Deploy to the mainnet:
   ```bash
   dfx deploy --network=ic
   ```

## Project Structure

```
todo_list/
├── src/
│   ├── declarations/       # Auto-generated canister interface bindings
│   ├── todo_list_backend/  # Rust backend canister
│   │   ├── Cargo.toml      # Rust dependencies
│   │   ├── src/
│   │   │   └── lib.rs      # Rust implementation
│   │   └── todo_list_backend.did  # Candid interface
│   └── todo_list_frontend/ # React frontend
│       ├── src/
│       │   ├── App.jsx     # Main React component
│       │   ├── main.jsx    # Entry point
│       │   ├── index.html  # HTML template
│       │   └── styles.css  # CSS styles
│       └── assets/         # Static assets
├── dfx.json                # Project configuration
└── webpack.config.js       # Webpack configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Internet Computer Protocol](https://internetcomputer.org/)
- [Rust Programming Language](https://www.rust-lang.org/)
- [React](https://reactjs.org/)

 
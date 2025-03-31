text
# IC Counter Canister

A simple counter canister for the Internet Computer platform that demonstrates basic state management.

## Features

- Increment a counter value
- Query the current counter value

## Interface

The canister exposes two methods:

- `increment()`: Updates the counter by incrementing its value by 1
- `get_count()`: Returns the current counter value

## Implementation Details

The counter is implemented using a thread-local storage pattern with Rust's `RefCell` for interior mutability. This allows the canister to maintain state between calls.

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

Increment the counter:

dfx canister call counter_backend increment

text

Get the current count:

dfx canister call counter_backend get_count

text

### Testing

Run the included unit tests:

cargo test

text

## License

MIT
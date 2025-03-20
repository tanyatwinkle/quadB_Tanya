use ic_cdk_macros::{query, update};
use std::cell::RefCell;

// Define a thread-local storage for the counter
thread_local! {
    static COUNTER: RefCell<i32> = RefCell::new(0);
}

// Increment the counter
#[update]
fn increment() {
    COUNTER.with(|counter| *counter.borrow_mut() += 1);
}

// Get the current counter value
#[query]
fn get_count() -> i32 {
    COUNTER.with(|counter| *counter.borrow())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_counter() {
        increment();
        assert_eq!(get_count(), 1);
        increment();
        assert_eq!(get_count(), 2);
    }
}

use ic_cdk::{query, update};
use ic_cdk_macros::*;
use std::cell::RefCell;
use candid::{Nat, CandidType, Deserialize};

// Define a static mutable counter variable that will persist
thread_local! {
    static COUNTER: RefCell<Nat> = RefCell::new(Nat::from(0 as u32));
}

/// Get the current value of the counter
#[query]
fn get() -> Nat {
    COUNTER.with(|counter| counter.borrow().clone())
}

/// Set the counter to a specific value
#[update]
fn set(n: Nat) {
    COUNTER.with(|counter| *counter.borrow_mut() = n);
}

/// Increment the counter by 1
#[update]
fn increment() {
    COUNTER.with(|counter| *counter.borrow_mut() += 1 as u32);
}

/// Decrement the counter by 1
#[update]
fn decrement() -> Result<(), String> {
    COUNTER.with(|counter| {
        let mut value = counter.borrow_mut();
        if *value == Nat::from(0 as u32) {
            return Err("Counter cannot be decremented below zero".to_string());
        }
        *value -= 1 as u32;
        Ok(())
    })
}

// Pre-upgrade hook to save the counter value to stable memory
#[pre_upgrade]
fn pre_upgrade() {
    let value = COUNTER.with(|counter| counter.borrow().clone());
    ic_cdk::storage::stable_save((value,)).expect("Failed to save counter value");
}

// Post-upgrade hook to restore the counter value from stable memory
#[post_upgrade]
fn post_upgrade() {
    let (value,): (Nat,) = ic_cdk::storage::stable_restore().expect("Failed to restore counter value");
    COUNTER.with(|counter| *counter.borrow_mut() = value);
}

// For testing
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_get_set() {
        let expected = Nat::from(42 as u32);
        set(expected.clone());
        assert_eq!(get(), expected);
    }
    
    #[test]
    fn test_increment() {
        set(Nat::from(0 as u32));
        for i in 1..10 {
            increment();
            assert_eq!(get(), Nat::from(i as u32));
        }
    }
    
    #[test]
    fn test_decrement() {
        set(Nat::from(10 as u32));
        for i in (1..10).rev() {
            assert!(decrement().is_ok());
            assert_eq!(get(), Nat::from(i as u32));
        }
        
        // Test decrementing to zero
        assert!(decrement().is_ok());
        assert_eq!(get(), Nat::from(0 as u32));
        
        // Test decrementing below zero (should fail)
        assert!(decrement().is_err());
        assert_eq!(get(), Nat::from(0 as u32));
    }
}

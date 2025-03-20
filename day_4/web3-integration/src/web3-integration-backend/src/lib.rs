use candid::types::number::Nat;
use ic_cdk::{query, update};
use std::cell::RefCell;

thread_local! {
    static COUNTER: RefCell<Nat> = RefCell::new(Nat::from(0 as u32));
}

/// Get the value of the counter.
#[query]
fn get() -> Nat {
    COUNTER.with(|counter| counter.borrow().clone())
}

/// Set the value of the counter.
#[update]
fn set(n: Nat) {
    COUNTER.with(|counter| *counter.borrow_mut() = n);
}

/// Increment the counter by 1.
#[update]
fn increment() {
    COUNTER.with(|counter| *counter.borrow_mut() += 1 as u32);
}

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
    fn test_init() {
        assert_eq!(get(), Nat::from(0 as u32));
    }
    
    #[test]
    fn test_inc() {
        for i in 1..10 {
            increment();
            assert_eq!(get(), Nat::from(i as u32));
        }
    }
}
ic_cdk::export_candid!();
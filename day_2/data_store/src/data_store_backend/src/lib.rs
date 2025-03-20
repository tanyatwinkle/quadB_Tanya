use ic_cdk::storage;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;

thread_local! {
    static STORAGE: RefCell<Option<String>> = RefCell::new(None);
}

#[update]
fn store(value: String) {
    STORAGE.with(|storage| {
        *storage.borrow_mut() = Some(value);
    });
}

#[query]
fn retrieve() -> Option<String> {
    STORAGE.with(|storage| storage.borrow().clone())
}

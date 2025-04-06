use candid::{CandidType, Deserialize};
use ic_cdk::storage;
use ic_cdk_macros::{query, update, pre_upgrade, post_upgrade};
use std::cell::RefCell;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
struct StorageData {
    content: String,
    timestamp: u64,
}

thread_local! {
    static STORAGE: RefCell<Option<StorageData>> = RefCell::new(None);
}

#[update]
fn store(value: String) {
    let timestamp = ic_cdk::api::time();
    let data = StorageData { 
        content: value,
        timestamp 
    };
    
    STORAGE.with(|storage| {
        *storage.borrow_mut() = Some(data);
    });
}

#[query]
fn retrieve() -> Option<StorageData> {
    STORAGE.with(|storage| storage.borrow().clone())
}

#[pre_upgrade]
fn pre_upgrade() {
    STORAGE.with(|storage| {
        let data = storage.borrow().clone();
        storage::stable_save((data,)).expect("Failed to save to stable storage");
    });
}

#[post_upgrade]
fn post_upgrade() {
    let (data,): (Option<StorageData>,) = storage::stable_restore().expect("Failed to restore from stable storage");
    STORAGE.with(|state| {
        *state.borrow_mut() = data;
    });
}

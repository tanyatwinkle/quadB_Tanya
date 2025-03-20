use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{query, update};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Account {
    owner: Principal,
    balance: u64,
}

thread_local! {
    static ACCOUNTS: RefCell<HashMap<Principal, Account>> = RefCell::new(HashMap::new());
}

#[query]
fn get_balance(owner: Principal) -> u64 {
    ACCOUNTS.with(|accounts| {
        accounts
            .borrow()
            .get(&owner)
            .map(|account| account.balance)
            .unwrap_or(0)
    })
}

#[update]
fn deposit(owner: Principal, amount: u64) -> u64 {
    ACCOUNTS.with(|accounts| {
        let mut accounts_mut = accounts.borrow_mut();
        let account = accounts_mut.entry(owner).or_insert(Account {
            owner,
            balance: 0,
        });
        account.balance += amount;
        account.balance
    })
}

#[derive(CandidType, Deserialize)]
enum TransferResult {
    Ok(u64),
    Err(String),
}

#[update]
fn withdraw(owner: Principal, amount: u64) -> TransferResult {
    ACCOUNTS.with(|accounts| {
        let mut accounts_mut = accounts.borrow_mut();
        
        if let Some(account) = accounts_mut.get_mut(&owner) {
            if account.balance >= amount {
                account.balance -= amount;
                TransferResult::Ok(account.balance)
            } else {
                TransferResult::Err("Insufficient funds".to_string())
            }
        } else {
            TransferResult::Err("Account not found".to_string())
        }
    })
}

#[update]
fn transfer(from: Principal, to: Principal, amount: u64) -> TransferResult {
    ACCOUNTS.with(|accounts| {
        let mut accounts_mut = accounts.borrow_mut();
        
        // First check if sender exists and has enough funds
        let from_balance = match accounts_mut.get(&from) {
            Some(account) => {
                if account.balance < amount {
                    return TransferResult::Err("Insufficient funds".to_string());
                }
                account.balance
            },
            None => return TransferResult::Err("Sender account not found".to_string()),
        };
        
        // Now update both accounts
        if let Some(from_account) = accounts_mut.get_mut(&from) {
            from_account.balance -= amount;
        }
        
        let to_account = accounts_mut.entry(to).or_insert(Account {
            owner: to,
            balance: 0,
        });
        
        to_account.balance += amount;
        
        TransferResult::Ok(from_balance - amount)
    })
}


// For stable memory persistence
#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade() {
    ACCOUNTS.with(|accounts| {
        let accounts_data: Vec<(Principal, Account)> = accounts
            .borrow()
            .iter()
            .map(|(k, v)| (*k, v.clone()))
            .collect();
        ic_cdk::storage::stable_save((accounts_data,)).expect("Failed to save accounts");
    });
}

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    let (accounts_data,): (Vec<(Principal, Account)>,) = 
        ic_cdk::storage::stable_restore().expect("Failed to restore accounts");
    
    ACCOUNTS.with(|accounts| {
        let mut accounts_mut = accounts.borrow_mut();
        for (principal, account) in accounts_data {
            accounts_mut.insert(principal, account);
        }
    });
}

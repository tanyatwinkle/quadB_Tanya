use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{query, update, api::call::CallResult};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Product {
    id: u64,
    name: String,
    price: u64,
}

thread_local! {
    static PRODUCTS: RefCell<HashMap<u64, Product>> = RefCell::new(HashMap::new());
    static NEXT_PRODUCT_ID: RefCell<u64> = RefCell::new(1);
}

#[update]
fn add_product(name: String, price: u64) -> Product {
    let id = NEXT_PRODUCT_ID.with(|next_id| {
        let current_id = *next_id.borrow();
        *next_id.borrow_mut() = current_id + 1;
        current_id
    });
    
    let product = Product { id, name, price };
    
    PRODUCTS.with(|products| {
        products.borrow_mut().insert(id, product.clone());
    });
    
    product
}

#[query]
fn get_product(id: u64) -> Option<Product> {
    PRODUCTS.with(|products| {
        products.borrow().get(&id).cloned()
    })
}

#[derive(CandidType, Deserialize)]
enum TransferResult {
    Ok(u64),
    Err(String),
}

#[derive(CandidType, Deserialize)]
enum PaymentResult {
    Ok(String),
    Err(String),
}

#[update]
async fn purchase_product(product_id: u64, buyer: Principal) -> PaymentResult {
    let product_opt = PRODUCTS.with(|products| {
        products.borrow().get(&product_id).cloned()
    });
    
    match product_opt {
        Some(product) => {
            // Use the correct wallet canister ID
            // Replace this with the actual wallet canister ID from your deployment
            let wallet_canister_id = Principal::from_text("ctiya-peaaa-aaaaa-qaaja-cai").unwrap();
            
            // Call the wallet canister to process the payment
            let result: CallResult<(TransferResult,)> = ic_cdk::call(
                wallet_canister_id,
                "withdraw",
                (buyer, product.price),
            ).await;
            
            // Rest of your code remains the same
            match result {
                Ok((transfer_result,)) => {
                    match transfer_result {
                        TransferResult::Ok(_) => {
                            PaymentResult::Ok(format!("Successfully purchased product: {}", product.name))
                        },
                        TransferResult::Err(msg) => {
                            PaymentResult::Err(format!("Payment failed: {}", msg))
                        }
                    }
                },
                Err((code, msg)) => {
                    PaymentResult::Err(format!("Inter-canister call failed with code {:?}: {}", code, msg))
                }
            }
        },
        None => PaymentResult::Err(format!("Product with ID {} not found", product_id))
    }
}


// For stable memory persistence
#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade() {
    PRODUCTS.with(|products| {
        let products_data: Vec<(u64, Product)> = products
            .borrow()
            .iter()
            .map(|(k, v)| (*k, v.clone()))
            .collect();
        
        let next_id = NEXT_PRODUCT_ID.with(|id| *id.borrow());
        
        ic_cdk::storage::stable_save((products_data, next_id))
            .expect("Failed to save products");
    });
}

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    let (products_data, next_id): (Vec<(u64, Product)>, u64) = 
        ic_cdk::storage::stable_restore().expect("Failed to restore products");
    
    PRODUCTS.with(|products| {
        let mut products_mut = products.borrow_mut();
        for (id, product) in products_data {
            products_mut.insert(id, product);
        }
    });
    
    NEXT_PRODUCT_ID.with(|id| {
        *id.borrow_mut() = next_id;
    });
}

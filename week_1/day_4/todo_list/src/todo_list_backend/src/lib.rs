use candid::{CandidType, Decode, Deserialize, Encode};
use ic_cdk::api::time;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, Cell, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};

// Define memory and ID types
type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdCell = Cell<u64, Memory>;

#[derive(CandidType, Clone, Deserialize, Debug)]
struct TodoItem {
    id: u64,
    title: String,
    completed: bool,
    created_at: u64,
}


// Implement Storable for TodoItem
impl Storable for TodoItem {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// Implement BoundedStorable for TodoItem
impl BoundedStorable for TodoItem {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

// Define thread-local storage
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static ID_COUNTER: RefCell<IdCell> = RefCell::new(
        Cell::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))), 0)
            .expect("Cannot create a counter")
    );

    static TODO_MAP: RefCell<StableBTreeMap<u64, TodoItem, Memory>> = RefCell::new(
        StableBTreeMap::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))))
    );
}

// Helper function to get the next ID
fn get_next_id() -> u64 {
    ID_COUNTER.with(|counter| {
        let mut counter_ref = counter.borrow_mut(); // Create a longer-lived binding
        let current_value = counter_ref.get();
        let next_value = current_value + 1;
        counter_ref.set(next_value).expect("Cannot set counter");
        next_value
    })
}

#[ic_cdk::query]
fn get_todos() -> Vec<TodoItem> {
    TODO_MAP.with(|todo_map| {
        todo_map
            .borrow()
            .iter()
            .map(|(_, todo)| todo.clone())
            .collect()
    })
}

#[ic_cdk::update]
fn add_todo(title: String) -> TodoItem {
    let id = get_next_id();
    let todo = TodoItem {
        id,
        title,
        completed: false,
        created_at: time(),
    };

    TODO_MAP.with(|todo_map| {
        todo_map.borrow_mut().insert(id, todo.clone());
    });

    todo
}

#[ic_cdk::update]
fn update_todo(id: u64, completed: bool) -> Result<TodoItem, String> {
    TODO_MAP.with(|todo_map| {
        let mut borrowed_map = todo_map.borrow_mut();
        match borrowed_map.get(&id) {
            Some(mut todo) => {
                todo.completed = completed;
                borrowed_map.insert(id, todo.clone());
                Ok(todo)
            }
            None => Err(format!("Todo with id={} not found", id)),
        }
    })
}

#[ic_cdk::update]
fn delete_todo(id: u64) -> Result<(), String> {
    TODO_MAP.with(|todo_map| {
        let mut borrowed_map = todo_map.borrow_mut();
        match borrowed_map.remove(&id) {
            Some(_) => Ok(()),
            None => Err(format!("Todo with id={} not found", id)),
        }
    })
}

// #[cfg(test)]
// mod tests {
//     #[test]
//     fn did() {
//         use candid::export_service;
        
//         fn export_candid() -> String {
//             export_service!();
//             __export_service()
//         }
        
//         use std::env;
//         use std::fs::write;
//         use std::path::PathBuf;
        
//         let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
//         write(dir.join("todo_list_backend.did"), export_candid()).expect("Write failed.");
//     }
// }
// Generate Candid interface
ic_cdk::export_candid!();

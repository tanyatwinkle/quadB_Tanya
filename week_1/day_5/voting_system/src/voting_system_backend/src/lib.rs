use candid::{CandidType, Deserialize};
use ic_principal::Principal; // Fixed import
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap,
    storable::{Storable, BoundedStorable},
};
use std::{cell::RefCell, collections::HashMap, borrow::Cow};

// Define a fixed-size key for stable storage
#[derive(Debug, Clone, Ord, PartialOrd, Eq, PartialEq)]
struct StableKey(Vec<u8>);

impl Storable for StableKey {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Borrowed(&self.0)
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Self(bytes.to_vec())
    }
}

impl BoundedStorable for StableKey {
    const MAX_SIZE: u32 = 1024; // Set a reasonable max size for keys
    const IS_FIXED_SIZE: bool = false;
     
}

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );
    
    static VOTES: RefCell<StableBTreeMap<StableKey, u64, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
    
    static PROPOSALS: RefCell<HashMap<u64, Proposal>> = RefCell::new(HashMap::new());
    static NEXT_PROPOSAL_ID: RefCell<u64> = RefCell::new(1);
}

#[derive(CandidType, Deserialize, Clone)]
struct Proposal {
    id: u64,
    title: String,
    description: String,
    creator: Principal,
    options: Vec<String>,
    active: bool,
}

#[derive(CandidType, Deserialize)]
struct VoteResult {
    option: String,
    votes: u64,
}

#[ic_cdk::update]
fn create_proposal(title: String, description: String, options: Vec<String>) -> u64 {
    let caller = ic_cdk::caller();
    
    let id = NEXT_PROPOSAL_ID.with(|id| {
        let current_id = *id.borrow();
        *id.borrow_mut() = current_id + 1;
        current_id
    });
    
    let proposal = Proposal {
        id,
        title,
        description,
        creator: caller,
        options,
        active: true,
    };
    
    PROPOSALS.with(|proposals| {
        proposals.borrow_mut().insert(id, proposal);
    });
    
    id
}

#[ic_cdk::update]
fn vote(proposal_id: u64, option: String) -> bool {
    let caller = ic_cdk::caller();
    let caller_str = caller.to_string();
    
    let is_active = PROPOSALS.with(|proposals| {
        proposals.borrow().get(&proposal_id).map_or(false, |p| p.active)
    });
    
    if !is_active {
        return false;
    }
    
    let vote_key = format!("{}:{}", proposal_id, caller_str);
    
    VOTES.with(|votes| {
        let mut votes = votes.borrow_mut();
        let option_key = format!("{}:{}", proposal_id, option);
        
        let current_votes = votes.get(&StableKey(option_key.clone().into_bytes())).unwrap_or(0);
        votes.insert(StableKey(option_key.into_bytes()), current_votes + 1);
        votes.insert(StableKey(vote_key.into_bytes()), 1); // Mark that this user has voted
    });
    
    true
}

#[ic_cdk::query]
fn get_proposal(id: u64) -> Option<Proposal> {
    PROPOSALS.with(|proposals| {
        proposals.borrow().get(&id).cloned()
    })
}

#[ic_cdk::query]
fn get_all_proposals() -> Vec<Proposal> {
    PROPOSALS.with(|proposals| {
        proposals.borrow().values().cloned().collect()
    })
}

#[ic_cdk::query]
fn get_vote_results(proposal_id: u64) -> Vec<VoteResult> {
    let mut results = Vec::new();
    
    PROPOSALS.with(|proposals| {
        if let Some(proposal) = proposals.borrow().get(&proposal_id) {
            for option in &proposal.options {
                let option_key = format!("{}:{}", proposal_id, option);
                let votes = VOTES.with(|votes| {
                    votes.borrow().get(&StableKey(option_key.into_bytes())).unwrap_or(0)
                });
                
                results.push(VoteResult {
                    option: option.clone(),
                    votes,
                });
            }
        }
    });
    
    results
}

#[ic_cdk::update]
fn end_proposal(proposal_id: u64) -> bool {
    let caller = ic_cdk::caller();
    
    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        if let Some(proposal) = proposals.get_mut(&proposal_id) {
            if proposal.creator == caller && proposal.active {
                proposal.active = false;
                return true;
            }
        }
        false
    })
}

// Generate Candid interface
ic_cdk::export_candid!();

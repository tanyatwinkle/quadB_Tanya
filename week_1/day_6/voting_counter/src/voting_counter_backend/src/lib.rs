use ic_cdk::export::{
    candid::{CandidType, Deserialize as CandidDeserialize},
    Principal,
};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde::{Serialize, Deserialize};
use std::cell::RefCell;
use std::collections::HashMap;
use std::borrow::Cow;

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, CandidDeserialize, Clone, Debug, Serialize, Deserialize)]
struct Proposal {
    id: u64,
    title: String,
    description: String,
    creator: Principal,
    yes_votes: u64,
    no_votes: u64,
    status: ProposalStatus,
    voters: Vec<Principal>,
}
impl Storable for Proposal {
    fn to_bytes(&self) -> Cow<[u8]> {
        let mut bytes: Vec<u8> = vec![];
        let bytes = bincode::serialize(self).unwrap_or_default();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        bincode::deserialize(bytes.as_ref()).unwrap_or_else(|_| {
            Proposal {
                id: 0,
                title: String::new(),
                description: String::new(),
                creator: Principal::anonymous(),
                yes_votes: 0,
                no_votes: 0,
                status: ProposalStatus::Active,
                voters: Vec::new(),
            }
        })
    }
}

impl BoundedStorable for Proposal {
    const MAX_SIZE: u32 = 2048;
    const IS_FIXED_SIZE: bool = false;
}

impl BoundedStorable for Proposal {
    // Set a reasonable maximum size for your Proposal
    const MAX_SIZE: u32 = 2048; // Adjust based on your needs
    
    // Set to false since Proposal can vary in size (due to strings and vectors)
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, CandidDeserialize, Clone, Debug, PartialEq, Serialize, Deserialize)]
enum ProposalStatus {
    Active,
    Accepted,
    Rejected,
}

#[derive(CandidType, CandidDeserialize, Clone, Debug, Serialize, Deserialize)]
enum Vote {
    Yes,
    No,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct UserCounter {
    owner: Principal,
    count: i64,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static PROPOSALS: RefCell<StableBTreeMap<u64, Proposal, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );

    static COUNTERS: RefCell<HashMap<Principal, i64>> = RefCell::new(HashMap::new());
    static NEXT_PROPOSAL_ID: RefCell<u64> = RefCell::new(0);
}

#[ic_cdk::update]
fn increment_counter() -> i64 {
    let caller = ic_cdk::caller();
    COUNTERS.with(|counters| {
        let mut counters = counters.borrow_mut();
        let count = counters.entry(caller).or_insert(0);
        *count += 1;
        *count
    })
}

#[ic_cdk::update]
fn decrement_counter() -> i64 {
    let caller = ic_cdk::caller();
    COUNTERS.with(|counters| {
        let mut counters = counters.borrow_mut();
        let count = counters.entry(caller).or_insert(0);
        *count -= 1;
        *count
    })
}

#[ic_cdk::query]
fn get_counter() -> i64 {
    let caller = ic_cdk::caller();
    COUNTERS.with(|counters| {
        let counters = counters.borrow();
        *counters.get(&caller).unwrap_or(&0)
    })
}

#[ic_cdk::query]
fn get_all_counters() -> Vec<UserCounter> {
    COUNTERS.with(|counters| {
        let counters = counters.borrow();
        counters
            .iter()
            .map(|(owner, count)| UserCounter {
                owner: *owner,
                count: *count,
            })
            .collect()
    })
}

#[ic_cdk::update]
fn create_proposal(title: String, description: String) -> u64 {
    let caller = ic_cdk::caller();
    
    let proposal_id = NEXT_PROPOSAL_ID.with(|id| {
        let next_id = *id.borrow();
        *id.borrow_mut() = next_id + 1;
        next_id
    });
    
    let proposal = Proposal {
        id: proposal_id,
        title,
        description,
        creator: caller,
        yes_votes: 0,
        no_votes: 0,
        status: ProposalStatus::Active,
        voters: Vec::new(),
    };
    
    PROPOSALS.with(|proposals| {
        proposals.borrow_mut().insert(proposal_id, proposal);
    });
    
    proposal_id
}

#[ic_cdk::update]
fn vote(proposal_id: u64, vote: Vote) -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        
        if let Some(proposal) = proposals.get(&proposal_id) {
            if proposal.status != ProposalStatus::Active {
                return Err("Proposal is no longer active".to_string());
            }
            
            if proposal.voters.contains(&caller) {
                return Err("You have already voted on this proposal".to_string());
            }
            
            let mut updated_proposal = proposal.clone();
            updated_proposal.voters.push(caller);
            
            match vote {
                Vote::Yes => {
                    updated_proposal.yes_votes += 1;
                },
                Vote::No => {
                    updated_proposal.no_votes += 1;
                }
            }
            
            // Check if proposal should be accepted or rejected
            if updated_proposal.yes_votes >= 3 {
                updated_proposal.status = ProposalStatus::Accepted;
            } else if updated_proposal.no_votes >= 3 {
                updated_proposal.status = ProposalStatus::Rejected;
            }
            
            proposals.insert(proposal_id, updated_proposal);
            Ok(())
        } else {
            Err("Proposal not found".to_string())
        }
    })
}

#[ic_cdk::query]
fn get_proposal(id: u64) -> Option<Proposal> {
    PROPOSALS.with(|proposals| {
        proposals.borrow().get(&id)
    })
}

#[ic_cdk::query]
fn get_all_proposals() -> Vec<Proposal> {
    PROPOSALS.with(|proposals| {
        proposals.borrow().iter().map(|(_, proposal)| proposal.clone()).collect()
    })
}
 
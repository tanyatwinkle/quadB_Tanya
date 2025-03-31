use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call::RejectionCode;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone, Debug)]
struct VoteOption {
    id: u64,
    name: String,
    votes: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct Poll {
    id: u64,
    name: String,
    creator: Principal,
    options: Vec<VoteOption>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
struct UserCounter {
    value: u64,
}

thread_local! {
    static USER_COUNTERS: RefCell<HashMap<Principal, UserCounter>> = RefCell::new(HashMap::new());
    static POLLS: RefCell<Vec<Poll>> = RefCell::new(Vec::new());
    static VOTES: RefCell<HashMap<Principal, HashMap<u64, u64>>> = RefCell::new(HashMap::new());
    static NEXT_POLL_ID: RefCell<u64> = RefCell::new(0);
}

#[update]
fn increment() -> u64 {
    let caller = ic_cdk::caller();
    USER_COUNTERS.with(|counters| {
        let mut counters_mut = counters.borrow_mut();
        let counter = counters_mut.entry(caller).or_insert(UserCounter { value: 0 });
        counter.value += 1;
        counter.value
    })
}

#[query]
fn get_counter() -> u64 {
    let caller = ic_cdk::caller();
    USER_COUNTERS.with(|counters| {
        counters
            .borrow()
            .get(&caller)
            .map_or(0, |counter| counter.value)
    })
}

#[update]
fn create_poll(name: String, options: Vec<String>) -> Poll {
    let caller = ic_cdk::caller();
    
    POLLS.with(|polls| {
        NEXT_POLL_ID.with(|next_id| {
            let id = *next_id.borrow();
            *next_id.borrow_mut() += 1;
            
            let vote_options = options.iter().enumerate().map(|(i, name)| {
                VoteOption {
                    id: i as u64,
                    name: name.clone(),
                    votes: 0,
                }
            }).collect();
            
            let new_poll = Poll {
                id,
                name,
                creator: caller,
                options: vote_options,
            };
            
            polls.borrow_mut().push(new_poll.clone());
            new_poll
        })
    })
}

#[query]
fn get_polls() -> Vec<Poll> {
    POLLS.with(|polls| polls.borrow().clone())
}

#[update]
fn vote(poll_id: u64, option_id: u64) -> Result<Poll, String> {
    let caller = ic_cdk::caller();
    
    // Check if user has already voted on this poll
    let has_voted = VOTES.with(|votes| {
        votes.borrow().get(&caller).map_or(false, |user_votes| {
            user_votes.contains_key(&poll_id)
        })
    });
    
    if has_voted {
        return Err("You have already voted on this poll".to_string());
    }
    
    POLLS.with(|polls| {
        let mut polls_mut = polls.borrow_mut();
        let poll = polls_mut.iter_mut().find(|p| p.id == poll_id);
        
        match poll {
            Some(poll) => {
                let option = poll.options.iter_mut().find(|o| o.id == option_id);
                match option {
                    Some(option) => {
                        option.votes += 1;
                        
                        // Record the vote
                        VOTES.with(|votes| {
                            let mut votes_mut = votes.borrow_mut();
                            let user_votes = votes_mut.entry(caller).or_insert_with(HashMap::new);
                            user_votes.insert(poll_id, option_id);
                        });
                        
                        Ok(poll.clone())
                    },
                    None => Err(format!("Option with ID {} not found", option_id)),
                }
            },
            None => Err(format!("Poll with ID {} not found", poll_id)),
        }
    })
}

#[query]
fn get_poll(poll_id: u64) -> Result<Poll, String> {
    POLLS.with(|polls| {
        polls.borrow().iter()
            .find(|p| p.id == poll_id)
            .map(|p| p.clone())
            .ok_or_else(|| format!("Poll with ID {} not found", poll_id))
    })
}

#[update]
fn reset_vote(poll_id: u64) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Check if user has voted on this poll
    let has_voted = VOTES.with(|votes| {
        votes.borrow().get(&caller).map_or(false, |user_votes| {
            user_votes.contains_key(&poll_id)
        })
    });
    
    if !has_voted {
        return Err("You haven't voted on this poll yet".to_string());
    }
    
    // Get the previously voted option
    let previous_option_id = VOTES.with(|votes| {
        votes.borrow()
            .get(&caller)
            .and_then(|user_votes| user_votes.get(&poll_id))
            .cloned()
    });
    
    if let Some(option_id) = previous_option_id {
        // Decrement the vote count
        POLLS.with(|polls| {
            let mut polls_mut = polls.borrow_mut();
            if let Some(poll) = polls_mut.iter_mut().find(|p| p.id == poll_id) {
                if let Some(option) = poll.options.iter_mut().find(|o| o.id == option_id) {
                    if option.votes > 0 {
                        option.votes -= 1;
                    }
                }
            }
        });
        
        // Remove the vote record
        VOTES.with(|votes| {
            let mut votes_mut = votes.borrow_mut();
            if let Some(user_votes) = votes_mut.get_mut(&caller) {
                user_votes.remove(&poll_id);
            }
        });
        
        Ok("Vote reset successfully".to_string())
    } else {
        Err("Failed to find your previous vote".to_string())
    }
}

// For Candid interface generation
ic_cdk::export_candid!();
